const {Router} = require('express');
const UserController = require('../Controllers/Api/V1/UserController');
const {authenticated} = require("../../Auth/Middlewares/Auth");

const router = new Router('');

router.use(authenticated);

router.get('/',UserController.profile);

router.patch('/',UserController.update);

router.delete('/',UserController.destroy);

exports.userRouterV1 = router;