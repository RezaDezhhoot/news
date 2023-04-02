const {Router} = require('express');
const CategoryController = require('../Controllers/Api/V1/CategoryController');
const {authenticated} = require("../../Auth/Middlewares/Auth");

const router = new Router('').use(authenticated);

router.get('/',CategoryController.index);

exports.categoryRouterV1 = router;