const RegisterRequest = require("../../../Requests/Api/V1/RegisterRequest");
const LoginRequest = require("../../../Requests/Api/V1/LoginRequest");
const utils = require("../../../../../../utils/helpers");
const User = require("../../../../User/Models/User");
const Token = require("../../../../User/Models/Token");
const UserResource = require('../../../../User/Resources/Api/V1/UserResource');
const passport = require('passport');

exports.register = async (req , res) => {
    const errorArr = [];
    try {
        await RegisterRequest(res).validate(req.body, {
            abortEarly: false,
        });
        const phone = utils.normalizeIranianPhoneNumber(req.body.phone);
        const {full_name , password , city} = req.body;
        if (await User.findOne({ phone })) {
            errorArr.push({
                filed: 'phone',
                message: res.__('auth.user_has_already_registered')
            });
            return res.status(422).json({ data: errorArr, message: res.__('general.error') });
        }
        let token = await Token.findOne({$and:
                [
                    {phone},
                    {status: true}
                ]
        });
        if (! token ){
            errorArr.push({
                filed: 'phone',
                message: res.__('auth.not_verified_mobile')
            });
            return res.status(422).json({ data: errorArr, message: res.__('general.error') });
        }
        await Token.deleteMany({phone});
        const user = await User.create({full_name,country_code:token['country_code'],phone,city,password});
        return res.status(201).json({data:UserResource.make(user,utils.makeToken(user)),message: res.__('general.success')});
    } catch (e) {
        const errors = utils.getErrors(e);
        return res.status(errors.status).json({ data: errors.errors, message: res.__('general.error') });
    }
}

exports.login = (req , res ,next) => {
    const errorArr = [];
    passport.authenticate(
        'login',
        async(err, user, info) => {
            try {
                await LoginRequest(res).validate(req.body, {
                    abortEarly: false,
                });
                if (err || !user) {
                    errorArr.push({
                        filed: 'phone',
                        message: res.__('auth.invalid_mobile_or_password')
                    });
                    return res.status(422).json({ data: errorArr, message: res.__('general.error') });
                }

                req.login(user, { session: false },
                    async(error) => {
                        if (error) return res.status(422).json({message: res.__('general.error') });
                        return res.status(200).json({data:UserResource.make(user,utils.makeToken(user)),message:res.__('general.success')});
                    }
                );
            } catch (error) {
                const errors = utils.getErrors(error);
                return res.status(errors.status).json({ data: errors.errors, message: res.__('general.error') });
            }
        }
    )(req, res, next);
}