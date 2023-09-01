const {Router} = require('express');
const {guest} = require('../Middlewares/Guest');
const {authenticated} = require('../Middlewares/Auth');
const AuthController = require('../Controllers/Api/V1/AuthController');
const TokenController = require('../Controllers/Api/V1/TokenController');
const ForgetPasswordController = require('../Controllers/Api/V1/ForgetPasswordController');
const rateLimit = require("express-rate-limit");

const routerV1 = new Router().use(guest);

routerV1.use('/register/get-token',
    rateLimit({
        windowMs: 3 * 60 * 60 * 1000,
        max: 3,
        message: {
            message: 'too many requests'
        },
        headers: true,
    })
).post('/register/get-token',TokenController.store);

routerV1.post('/register/verify-token',TokenController.verify);

routerV1.post('/register',AuthController.register);

routerV1.post('/login',AuthController.login);

routerV1.use('/forget-password',
    rateLimit({
        windowMs: 3 * 60 * 60 * 1000,
        max: 3,
        message: {
            message: 'too many requests'
        },
        headers: true,
    })
).post('/forget-password',ForgetPasswordController.store);

routerV1.patch('/reset-password',ForgetPasswordController.reset);

exports.routerV1 = routerV1;