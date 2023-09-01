const path = require("path");
const appDir = path.dirname(require.main.filename);
const GoogleRecaptcha = require('../../Services/GoogleRecaptcha');
const utils = require("../../../../../utils/helpers");
const User = require("../../../User/Models/User");
const Token = require("../../../User/Models/Token");
const ResetPasswordRequest = require("../../Requests/Admin/ResetPasswordRequest");
const RoleConst = require('../../../../Base/Constants/Role');
const SMS = require("../../Services/SmsService");

exports.forgetForm = (req , res , next) => {
    res.render(path.join('admin/auth/forget-password'),
        {
            page_title: res.__('admin.auth.forget_password'),
            layout: path.join(appDir,'resources','views','layouts','auth'),
            path: "/forget",
            message: req.flash("success_msg"),
            error: req.flash("error"),
            oldPhone: req.flash("old_phone"),
            site_key: process.env.RECAPTCHA_SITE_KEY,
            direction: utils.getDirection(req),
            assetsDirection: utils.getAssetsDirection(req),
        }
    );
}

exports.forget = async (req , res , next) => {

    if (!req.body["phone"]) {
        req.flash("error",res.__("validation.required",res.__('admin.fields.phone')));
        return res.redirect('forget-password');
    }


        const phone = utils.normalizeIranianPhoneNumber(req.body.phone);
        let user = await User.findOne({ $and:[
                {phone},
                {$or:[{role: RoleConst.ADMIN}, {role: RoleConst.ADMINSTRATOR}]}
            ] })
        if (! user) {
            req.flash("error",res.__("auth.user_not_found"));
            return res.redirect('forget-password');
        }

        if (await Token.findOne({$and:
                [
                    {expires_at:{$gt:Date.now()}},
                    {phone},
                ]
        })){
            req.flash("error",res.__('auth.token_has_already_sent'));
            return res.redirect('forget-password');
        }
        const value = utils.getRandomIntInclusive(1111,9999);

        // Send sms api...
        const status = await SMS.send(utils.normalizePhoneNumber(user.country_code,phone),value);

        if (status === 200) {
            await Token.deleteMany({phone});
            const expires_at = Date.now() + 2 * 60 * 1000;
            await Token.create({phone, value, expires_at});
        } else {
            req.flash("error",res.__('sms.error'));
            return res.redirect('forget-password');
        }

        req.flash("success_msg",res.__('admin.general.messages.info.enter_code'));
        return res.redirect('reset-password?phone='+phone);
}

exports.resetForm = (req , res) => {
    res.render(path.join('admin/auth/reset-password'),
        {
            page_title: res.__('admin.actions.reset_password'),
            layout: path.join(appDir,'resources','views','layouts','auth'),
            path: "/reset",
            message: req.flash("success_msg"),
            error: req.flash("error"),
            oldCode: req.flash("oldCode"),
            phone: req.query.phone,
            site_key: process.env.RECAPTCHA_SITE_KEY,
            direction: utils.getDirection(req),
            assetsDirection: utils.getAssetsDirection(req),
        }
    );
}

exports.reset = async (req , res) => {

        try {
            await ResetPasswordRequest.validate(req.body, {
                abortEarly: true,
            });
            const phone = utils.normalizeIranianPhoneNumber(req.body.phone);
            const {code , password , floatingConfirmation} = req.body;

            const user = await User.findOne({$and:[
                    { phone },
                    {$or:[{role: RoleConst.ADMIN}, {role: RoleConst.ADMINSTRATOR}]}
                ]});
            if (! user) {
                req.flash("error",res.__("auth.user_not_found"));
                return res.redirect('reset-password?phone='+phone);
            }

            if (! await Token.findOne({$and:
                    [
                        {expires_at:{$gt:Date.now()}},
                        {phone},
                        {status: false},
                        {value: code},
                    ]
            })){
                req.flash("error",res.__("validation.matches",res.__('fields.code')));
                return res.redirect('reset-password?phone='+phone);
            }
            user.password = password;
            user.save();
            await Token.deleteMany({phone});

            req.flash("success_msg",res.__('admin.general.messages.success.reset_password'));
            return res.redirect('login');
        } catch (e) {
            req.flash("error",e.errors[0]);
            return res.redirect('reset-password?phone='+req.body.phone);
        }
}