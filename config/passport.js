const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const UserModel = require('../app/Modules/User/Models/User');

const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

passport.use(
    'login',
    new localStrategy({
            usernameField: 'email',
            passwordField: 'password'
        },
        async(email, password, done) => {
            try {
                const user = await UserModel.findOne({ email });

                if (!user) {
                    return done(null, false, { message: 'کاربری با این ادرس ایمیل یافت نشد' });
                }

                const validate = await user.isValidPassword(password);

                if (!validate) {
                    return done(null, false, { message: 'رمر عبور یا ادرس ایمیل اشتباه می باشد' });
                }

                return done(null, user, { message: 'ورود با موفقیت انجام شد' });
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