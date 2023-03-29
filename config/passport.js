const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const UserModel = require('../app/Models/User');

const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

const User = require('../app/Models/User');

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
        return User.findOne({ email: jwtPayload.user.email })
            .then(user => {
                return cb(null, user);
            })
            .catch(err => {

                return cb(err);
            });
    }
));

let userProfile;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_OAUTH2_CALLBACK_URL = process.env.GOOGLE_OAUTH2_CALLBACK_URL;

passport.use(new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: GOOGLE_OAUTH2_CALLBACK_URL,
        passReqToCallback: true,
    },
    function(req, accessToken, refreshToken, profile, done) {
        userProfile = profile;
        done(null, userProfile);
    }
));


passport.serializeUser(function(user, cb) {
    cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
});