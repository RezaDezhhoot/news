const {Router} = require('express');
const ArticleController = require('../Controllers/Api/V1/ArticleController');
const {authenticated} = require("../../Auth/Middlewares/Auth");

const router = new Router('').use(authenticated);

router.get('/',ArticleController.index);

router.get('/:id',ArticleController.show);

exports.articleRouterV1 = router;