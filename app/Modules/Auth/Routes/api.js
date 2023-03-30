const {Router} = require('express');
const {guest} = require('../Middlewares/Guest');
const AuthController = require('../Controllers/Api/V1/AuthController');
const TokenController = require('../Controllers/Api/V1/TokenController');
const ForgetPasswordController = require('../Controllers/Api/V1/ForgetPasswordController');

const routerV1 = new Router('').use(guest);

routerV1.post('/register/get-token',TokenController.store);

routerV1.post('/register/verify-token',TokenController.verify);

routerV1.post('/register',AuthController.register);

routerV1.post('/login',AuthController.login);

routerV1.post('/forget-password',ForgetPasswordController.store);

routerV1.patch('/reset-password',ForgetPasswordController.reset);

exports.routerV1 = routerV1;