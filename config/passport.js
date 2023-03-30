const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const UserModel = require('../app/Modules/User/Models/User');
const bcrypt = require('bcryptjs');
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const utils = require("../utils/helpers");

passport.use(
    'login',
    new localStrategy({
            usernameField: 'phone',
            passwordField: 'password'
        },
        async(phone, password, done) => {
            try {
                const user = await UserModel.findOne({ phone: utils.normalizeIranianPhoneNumber(phone) });
                if (!user) {
                    return done(null, false, { message: 'کاربری با این شماره همراه یافت نشد' });
                }

                const isMatch = await bcrypt.compare(password,user.password);

                if (isMatch){
                    return done(null,user);
                } else {
                    return done(null,false,{
                        message: "نام کاربری یا کلمه عبور صحیح نمی باشد"
                    });
                }

                return done(null, user, { message: 'ورود با موفقیت انجام شد' });
            } catch (error) {
                console.log(11);
                return done(error);
            }
        }
    )
);

passport.use(
    'admin_login',
    new localStrategy({
            usernameField: 'phone',
            passwordField: 'password'
        },
        async(phone, password, done) => {
            try {
                const user = await UserModel.findOne({ $and: [
                        {phone: utils.normalizeIranianPhoneNumber(phone)},
                        {role: "admin"}
                    ]
                });
                if (!user) {
                    return done(null, false, { message: 'کاربری با این شماره همراه یافت نشد' });
                }

                const isMatch = await bcrypt.compare(password,user.password);

                if (isMatch){
                    return done(null,user);
                } else {
                    return done(null,false,{
                        message: "نام کاربری یا کلمه عبور صحیح نمی باشد"
                    });
                }

                return done(null, user, { message: 'ورود با موفقیت انجام شد' });
            } catch (error) {
                console.log(11);
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