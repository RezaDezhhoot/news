const path = require("path");
const passport = require('passport');
const appDir = path.dirname(require.main.filename);
const GoogleRecaptcha = require('../../Services/GoogleRecaptcha');

exports.loginForm = (req , res, next) => {
    res.render(path.join('admin/auth/login'),
        {
            page_title:'ورود مدیریت',
            layout: path.join(appDir,'resources','views','layouts','auth'),
            path: "/login",
            message: req.flash("success_msg"),
            error: req.flash("error"),
            oldPhone: req.flash("old_phone"),
            site_key: process.env.RECAPTCHA_SITE_KEY
        }
    );
}

exports.login = async (req , res ,next) => {
    // if (!req.body["g-recaptcha-response"] && (process.env.MODE !== 'test' && process.env.MODE !== 'development')) {
    //     req.flash("error",'فیلد امنیتی اجباری می باشد');
    //     req.flash("old_phone",req.body.phone)
    //     return res.redirect('login');
    // }
    //
    // const json = await GoogleRecaptcha.verify(req);

    // if (json.success || process.env.MODE === 'test' || process.env.MODE === 'development') {
        passport.authenticate("admin_login",{
            successRedirect: '/admin',
            failureRedirect: 'login',
            failureFlash: true
        })(req,res,next);
    // } else {
    //     req.flash("error",'خظا در بررسی فیلد امنییتی');
    //     return res.redirect('login');
    // }
}

exports.logout = (req , res , next) => {
    req.logout(function(err) {
        req.session = null;
        if (err) { return next(err); }
        return res.redirect('login');
    });
}