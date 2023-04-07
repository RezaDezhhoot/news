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
        await RegisterRequest.validate(req.body, {
            abortEarly: false,
        });
        const phone = utils.normalizeIranianPhoneNumber(req.body.phone);
        const {full_name , password} = req.body;
        if (await User.findOne({ phone })) {
            errorArr.push({
                filed: 'phone',
                message: 'کاربر با این شماره موجود است'
            });
            return res.status(422).json({ data: errorArr, message: 'error' });
        }

        if (! await Token.findOne({$and:
                [
                    {phone},
                    {status: true}
                ]
        })){
            errorArr.push({
                filed: 'phone',
                message: 'این شماره همراه هنوز تایید نشده'
            });
            return res.status(422).json({ data: errorArr, message: 'error' });
        }
        await Token.deleteMany({phone});
        const user = await User.create({full_name,phone,password});
        return res.status(201).json({data:UserResource.make(user,utils.makeToken(user)),message:'success'});
    } catch (e) {
        const errors = utils.getErrors(e);
        return res.status(errors.status).json({ data: errors.errors, message: 'error' });
    }
}

exports.login = (req , res ,next) => {
    const errorArr = [];
    passport.authenticate(
        'login',
        async(err, user, info) => {
            try {
                await LoginRequest.validate(req.body, {
                    abortEarly: false,
                });
                if (err || !user) {
                    errorArr.push({
                        filed: 'phone',
                        message: 'شماره یا رمز عبور اشتباه می باشد'
                    });
                    return res.status(422).json({ data: errorArr, message: 'error' });
                }

                req.login(user, { session: false },
                    async(error) => {
                        if (error) return res.status(422).json({ data: {}, message: 'error' });
                        return res.status(200).json({data:UserResource.make(user,utils.makeToken(user)),message:'success'});
                    }
                );
            } catch (error) {
                const errors = utils.getErrors(error);
                return res.status(errors.status).json({ data: errors.errors, message: 'error' });
            }
        }
    )(req, res, next);
}