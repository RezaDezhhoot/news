const ForgetPasswordRequest = require("../../../Requests/Api/V1/ForgetPasswordRequest");
const ResetPasswordRequest = require("../../../Requests/Api/V1/ResetPasswordRequest");
const utils = require("../../../../../../utils/helpers");
const User = require("../../../../User/Models/User");
const Token = require("../../../../User/Models/Token");
const SMS = require('../../../Services/SmsService');

exports.store = async (req , res) => {
    const errorArr = [];
    try {
        await ForgetPasswordRequest(res).validate(req.body, {
            abortEarly: false,
        });
        const phone = utils.normalizeIranianPhoneNumber(req.body.phone);
        let user = await User.findOne({ phone });
        if (! user) {
            errorArr.push({
                filed: 'phone',
                message: res.__("auth.user_not_found")
            });
            return res.status(404).json({ data: errorArr, message:  res.__('general.error') });
        }

        if (await Token.findOne({$and:
                [
                    {expires_at:{$gt:Date.now()}},
                    {phone},
                ]
        })){
            errorArr.push({
                filed: 'code',
                message: res.__('auth.token_has_already_sent')
            });
            return res.status(403).json({ data: errorArr, message:  res.__('general.error') });
        }
        await Token.deleteMany({phone});

        const value = utils.getRandomIntInclusive(1111,9999);

        // Send sms api...
        const status = await SMS.send(utils.normalizePhoneNumber(user.country_code,phone),value);

        if (status === 200 || process.env.MODE === 'test') {
            const expires_at = Date.now() + 3 * 60 * 1000;
            const token = await Token.create({phone , country_code: user.country_code , value, expires_at});
            return res.status(201).json({ data: {
                    phone: token['phone'],
                    expires_at:token['expires_at'],
                    value: (process.env.MODE === 'development' || process.env.MODE === 'test') ? value : undefined
                }, message: res.__('general.success') });
        } else throw res.__('sms.error');

    } catch (exception) {
        const errors = utils.getErrors(exception);
        return res.status(errors.status).json({ data: errors.errors, message: res.__('general.error') });
    }
}

exports.reset = async (req , res) => {
    const errorArr = [];
    try {
        await ResetPasswordRequest(res).validate(req.body, {
            abortEarly: false,
        });
        const phone = utils.normalizeIranianPhoneNumber(req.body.phone);
        const {code , password} = req.body;

        const user = await User.findOne({ phone });
        if (! user) {
            errorArr.push({
                filed: 'phone',
                message: res.__("auth.user_not_found")
            });
            return res.status(422).json({ data: errorArr, message: res.__('general.error') });
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
                message: res.__('auth.invalid_token')
            });
            return res.status(403).json({ data: errorArr, message: res.__('general.error') });
        }

        user.password = password;
        user.save();
        await Token.deleteMany({phone});
        return res.status(200).json({message: res.__('auth.password_updated') });

    } catch (exception) {
        const errors = utils.getErrors(exception);
        return res.status(errors.status).json({ data: errors.errors, message: res.__('general.error') });
    }
}