const GetTokenRequest = require('../../../Requests/Api/V1/GetTokenRequest');
const VerifyTokenRequest = require('../../../Requests/Api/V1/VerifyTokenRequest');
const User = require('../../../../User/Models/User');
const Token = require('../../../../User/Models/Token');
const utils = require('../../../../../../utils/helpers');
const SMS = require('../../../Services/SmsService');

exports.store = async (req , res) => {
    const errorArr = [];
    try {
        await GetTokenRequest.validate(req.body, {
            abortEarly: false,
        });
        const phone = utils.normalizeIranianPhoneNumber(req.body.phone);

        if (await User.findOne({ phone })) {
            errorArr.push({
                filed: 'phone',
                message: 'کاربر با این شماره موجود است'
            });
            return res.status(422).json({ data: errorArr, message: 'error' });
        }

        if (await Token.findOne({$and:
                [
                    {expires_at:{$gt:Date.now()}},
                    {phone},
                    {country_code: req.body.country_code},
                ]
        })){
            errorArr.push({
                filed: 'code',
                message: 'کد تایید قبلا ارسال شده است'
            });
            return res.status(403).json({ data: errorArr, message: 'error' });
        }
        await Token.deleteMany({phone});

        const value = utils.getRandomIntInclusive(1111,9999);
        const expires_at = Date.now() + 2 * 60 * 1000;

        // Send sms api...
        const status = await SMS.send(utils.normalizePhoneNumber(req.body.country_code,phone),value);
        if (status === 200 || process.env.MODE === 'test') {
            const token = await Token.create({phone , country_code: req.body.country_code , value, expires_at});
            return res.status(201).json({ data: {
                phone: token['phone'],
                    country_code:req.body.country_code,
                    expires_at:token['expires_at'],
                    value: (process.env.MODE === 'development' || process.env.MODE === 'test') ? value : undefined
                }, message: 'success' });
        } else throw 'خظا در هنگام ارسال sms';

    } catch (exception) {
        const errors = utils.getErrors(exception);
        return res.status(errors.status).json({ data: errors.errors, message: 'error' });
    }
}

exports.verify = async (req , res) => {
    const errorArr = [];
    try {
        await VerifyTokenRequest.validate(req.body, {
            abortEarly: false,
        });
        const phone =  utils.normalizeIranianPhoneNumber(req.body.phone);
        const code = req.body.code;
        if (await User.findOne({ phone })) {
            errorArr.push({
                filed: 'phone',
                message: 'کاربر با این شماره موجود است'
            });
            return res.status(422).json({ data: errorArr, message: 'error' });
        }
        const token = await Token.findOne({$and:
                [
                    {expires_at:{$gt:Date.now()}},
                    {phone},
                    {status: false},
                    {value:code}
                ]
        });
        if (token){
            token.status = true;
            await token.save();
            return res.status(200).json({ data: {phone: token['phone'],country_code:token['country_code'],result:'شماره همراه با موفقیت اعبارسنجی شد'}, message: 'success' });
        }
        errorArr.push({
            filed: 'code',
            message: 'کد تایید نامعتبر'
        });
        return res.status(422).json({ data:errorArr, message: 'error' });
    } catch (exception) {
        const errors = utils.getErrors(exception);
        return res.status(errors.status).json({ data: errors.errors, message: 'error' });
    }
}