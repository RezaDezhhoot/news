const ForgetPasswordRequest = require("../../../Requests/Api/V1/ForgetPasswordRequest");
const ResetPasswordRequest = require("../../../Requests/Api/V1/ResetPasswordRequest");
const utils = require("../../../../../../utils/helpers");
const User = require("../../../../User/Models/User");
const Token = require("../../../../User/Models/Token");
const SMS = require('../../../Services/SmsService');

exports.store = async (req , res) => {
    const errorArr = [];
    try {
        await ForgetPasswordRequest.validate(req.body, {
            abortEarly: false,
        });
        const phone = utils.normalizeIranianPhoneNumber(req.body.phone);

        if (! await User.findOne({ phone })) {
            errorArr.push({
                filed: 'phone',
                message: 'کاربر با این شماره وجود ندارد'
            });
            return res.status(422).json({ data: errorArr, message: 'error' });
        }

        if (await Token.findOne({$and:
                [
                    {expires_at:{$gt:Date.now()}},
                    {phone},
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
        const expires_at = Date.now() + 3 * 60 * 1000;

        // Send sms api...
        const status = await SMS.send(phone,value);

        if (status === 200 || process.env.MODE === 'test') {
            const token = await Token.create({phone, value, expires_at});
            return res.status(201).json({ data: {
                    phone: token['phone'],
                    expires_at:token['expires_at'],
                    value: (process.env.MODE === 'development' || process.env.MODE === 'test') ? value : undefined
                }, message: 'success' });
        } else throw 'خظا در هنگام ارسال sms';

    } catch (exception) {
        console.log(exception)
        const errors = utils.getErrors(exception);
        return res.status(errors.status).json({ data: errors.errors, message: 'error' });
    }
}

exports.reset = async (req , res) => {
    const errorArr = [];
    try {
        await ResetPasswordRequest.validate(req.body, {
            abortEarly: false,
        });
        const phone = utils.normalizeIranianPhoneNumber(req.body.phone);
        const {code , password} = req.body;

        const user = await User.findOne({ phone });
        if (! user) {
            errorArr.push({
                filed: 'phone',
                message: 'کاربر با این شماره وجود ندارد'
            });
            return res.status(422).json({ data: errorArr, message: 'error' });
        }

        if (! await Token.findOne({$and:
                [
                    {expires_at:{$gt:Date.now()}},
                    {phone},
                    {value: code},
                    {status: false}
                ]
        })){
            errorArr.push({
                filed: 'code',
                message: 'کد تایید نا معتبر'
            });
            return res.status(403).json({ data: errorArr, message: 'error' });
        }

        user.password = password;
        user.save();
        await Token.deleteMany({phone});
        return res.status(200).json({ data: {result: 'رمز عبور با موفقیت ویرایش شد'}, message: 'success' });

    } catch (exception) {
        const errors = utils.getErrors(exception);
        return res.status(errors.status).json({ data: errors.errors, message: 'error' });
    }
}