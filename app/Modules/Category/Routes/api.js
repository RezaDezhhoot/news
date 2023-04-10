const {Router} = require('express');
const CategoryController = require('../Controllers/Api/V1/CategoryController');

const router = new Router('');

router.get('/',CategoryController.index);

exports.categoryRouterV1 = router;