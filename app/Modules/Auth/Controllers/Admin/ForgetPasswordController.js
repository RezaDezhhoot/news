const path = require("path");
const appDir = path.dirname(require.main.filename);
const GoogleRecaptcha = require('../../Services/GoogleRecaptcha');
const utils = require("../../../../../utils/helpers");
const User = require("../../../User/Models/User");
const Token = require("../../../User/Models/Token");
const ResetPasswordRequest = require("../../Requests/Admin/ResetPasswordRequest");
const RoleConst = require('../../../../Base/Constants/Role');

exports.forgetForm = (req , res , next) => {
    res.render(path.join('admin/auth/forget-password'),
        {
            page_title:'فراموشی رمز',
            layout: path.join(appDir,'resources','views','layouts','auth'),
            path: "/forget",
            message: req.flash("success_msg"),
            error: req.flash("error"),
            oldPhone: req.flash("old_phone"),
            site_key: process.env.RECAPTCHA_SITE_KEY
        }
    );
}

exports.forget = async (req , res , next) => {
    if (!req.body["g-recaptcha-response"]) {
        req.flash("error",'فیلد امنیتی اجباری می باشد');
        req.flash("old_phone",req.body.phone)
        return res.redirect('forget-password');
    }

    if (!req.body["phone"]) {
        req.flash("error",'فیلد شماره هماره اجباری می باشد');
        return res.redirect('forget-password');
    }

    const json = await GoogleRecaptcha.verify(req);


    if (json.success) {
        const phone = utils.normalizeIranianPhoneNumber(req.body.phone);

        if (! await User.findOne({ $and:[
                {phone},
                {$or:[{role: RoleConst.ADMIN}, {role: RoleConst.ADMINSTRATOR}]}
            ] })) {
            req.flash("error",'کاربری با این شماره یافت نشد');
            return res.redirect('forget-password');
        }

        if (await Token.findOne({$and:
                [
                    {expires_at:{$gt:Date.now()}},
                    {phone},
                ]
        })){
            req.flash("error",'کد تایید قبلا ارسال شده است');
            return res.redirect('forget-password');
        }
        await Token.deleteMany({phone});
        const value = utils.getRandomIntInclusive(1111,9999);
        const expires_at = Date.now() + 2 * 60 * 1000;
        await Token.create({phone, value, expires_at});

        // Send sms api...
        req.flash("success_msg",'کد ارسال شده را وارد نمایید');
        return res.redirect('reset-password?phone='+phone);
    } else {
        req.flash("error",'خظا در بررسی فیلد امنییتی');
        return res.redirect('forget-password');
    }
}

exports.resetForm = (req , res) => {
    res.render(path.join('admin/auth/reset-password'),
        {
            page_title:'بازیابی رمز',
            layout: path.join(appDir,'resources','views','layouts','auth'),
            path: "/reset",
            message: req.flash("success_msg"),
            error: req.flash("error"),
            oldCode: req.flash("oldCode"),
            phone: req.query.phone,
            site_key: process.env.RECAPTCHA_SITE_KEY
        }
    );
}

exports.reset = async (req , res) => {
    if (!req.body["g-recaptcha-response"]) {
        req.flash("error",'فیلد امنیتی اجباری می باشد');
        req.flash("oldCode",req.body.code)
        return res.redirect('reset-password?phone='+req.body.phone);
    }
    const json = await GoogleRecaptcha.verify(req);

    if (json.success) {
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
                req.flash("error",'کاربری با این شماره یافت نشد');
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
                req.flash("error",'کد تایید نامعتبر');
                return res.redirect('reset-password?phone='+phone);
            }
            user.password = password;
            user.save();
            await Token.deleteMany({phone});

            req.flash("success_msg",'رمز عبور با موفقیت ویرایش شد');
            return res.redirect('login');
        } catch (e) {
            req.flash("error",e.errors[0]);
            return res.redirect('reset-password?phone='+req.body.phone);
        }
    }  else {
        req.flash("error",'خظا در بررسی فیلد امنییتی');
        return res.redirect('reset-password?phone='+phone);
    }
}