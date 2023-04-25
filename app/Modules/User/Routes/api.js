const {Router} = require('express');
const UserController = require('../Controllers/Api/V1/UserController');
const {authenticated} = require("../../Auth/Middlewares/Auth");

const router = new Router('').use(authenticated);

router.get('/',UserController.profile);

router.post('/',UserController.update);

exports.userRouterV1 = router;