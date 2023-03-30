const {Router} = require('express');
const {guest} = require('../Middlewares/Guest');
const AuthController = require('../Controllers/Admin/AuthController');
const ForgetPasswordController = require('../Controllers/Admin/ForgetPasswordController');

const router = new Router('').use(guest);

router.get('/login',AuthController.loginForm);

router.post('/login',AuthController.login);

router.get('/forget-password',ForgetPasswordController.forgetForm);

router.post('/forget-password',ForgetPasswordController.forget);

router.get('/reset-password',ForgetPasswordController.resetForm);

router.post('/reset-password',ForgetPasswordController.reset);

exports.routerAdmin = router;