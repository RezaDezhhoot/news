const {Router} = require('express');
const ArticleController = require('../Controllers/Api/V1/ArticleController');

const router = new Router('');

router.get('/',ArticleController.index);

router.get('/:id',ArticleController.show);

exports.articleRouterV1 = router;