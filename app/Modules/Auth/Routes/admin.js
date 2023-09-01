const {Router} = require('express');
const {guest} = require('../Middlewares/Guest');
const {authenticated} = require('../Middlewares/Auth');
const AuthController = require('../Controllers/Admin/AuthController');
const ForgetPasswordController = require('../Controllers/Admin/ForgetPasswordController');
const rateLimit = require("express-rate-limit");

const router = new Router('');

router.get('/logout',(req,res,next) => {return authenticated(req,res,next,'admin')},AuthController.logout);

router.use((req,res,next) => {return guest(req,res,next,'admin')});

router.get('/login',AuthController.loginForm);

router.use('/login',
    rateLimit({
        windowMs: 2 * 60 * 60 * 1000,
        max: 3,
        message: {
            message: 'too many requests'
        },
        headers: true,
    })
).post('/login',AuthController.login);

router.get('/forget-password',ForgetPasswordController.forgetForm);

router.use('/forget-password',
    rateLimit({
        windowMs: 2 * 60 * 60 * 1000,
        max: 3,
        message: {
            message: 'too many requests'
        },
        headers: true,
    })
).post('/forget-password',ForgetPasswordController.forget);

router.get('/reset-password',ForgetPasswordController.resetForm);

router.post('/reset-password',ForgetPasswordController.reset);

exports.routerAdmin = router;