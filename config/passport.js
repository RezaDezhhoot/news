const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const UserModel = require('../app/Modules/User/Models/User');
const bcrypt = require('bcryptjs');
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const utils = require("../utils/helpers");
const {ADMIN, ADMINSTRATOR} = require("../app/Base/Constants/Role");
const I18n = require('./i18n');

passport.use(
    'login',
    new localStrategy({
            passReqToCallback: true,
            usernameField: 'phone',
            passwordField: 'password'
        },
        async(req,phone, password, done) => {
            try {
                I18n.setLocale(I18n.getLocale(req));

                const user = await UserModel.findOne({ phone: utils.normalizeIranianPhoneNumber(phone) });
                if (!user) {
                    return done(null, false, { message: I18n.__('auth.invalid_mobile_or_password') });
                }

                const isMatch = await bcrypt.compare(password,user.password);

                if (isMatch){
                    return done(null,user);
                } else {
                    return done(null,false,{
                        message: I18n.__('auth.invalid_mobile_or_password')
                    });
                }

                return done(null, user, { message: I18n.__('auth.login') });
            } catch (error) {
                return done(error);
            }
        }
    )
);

passport.use(
    'admin_login',
    new localStrategy({
            passReqToCallback: true,
            usernameField: 'phone',
            passwordField: 'password'
        },
        async(req,phone, password, done) => {
            try {
                const user = await UserModel.findOne({ $and: [
                        {phone: utils.normalizeIranianPhoneNumber(phone)},
                        {$or:[{role: ADMIN}, {role: ADMINSTRATOR}]}
                    ]
                });

                I18n.setLocale(I18n.getLocale(req));

                if (!user) {
                    return done(null, false, { message: I18n.__('auth.invalid_mobile_or_password') });
                }

                const isMatch = await bcrypt.compare(password,user.password);

                if (isMatch){
                    return done(null,user);
                } else {
                    return done(null,false,{
                        message: I18n.__('auth.invalid_mobile_or_password')
                    });
                }

                return done(null, user, { message: I18n.__('auth.login') });
            } catch (error) {
                return done(error);
            }
        }
    )
);

passport.use(new JWTstrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET
    },
    (jwtPayload, cb) => {
        return UserModel.findOne({ email: jwtPayload.user.email })
            .then(user => {
                return cb(null, user);
            })
            .catch(err => {

                return cb(err);
            });
    }
));

passport.serializeUser(function(user, cb) {
    cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
});