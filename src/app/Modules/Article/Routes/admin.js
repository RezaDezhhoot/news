const {Router} = require('express');
const {admin} = require('../../Auth/Middlewares/Admin');
const ArticleController = require('../Controllers/Admin/ArticleController');

const router = new Router('').use(admin);

router.get('/',ArticleController.index);

router.get('/create',ArticleController.create);

router.post('/store',ArticleController.store);

router.get('/edit/:id',ArticleController.edit);

router.post('/update/:id',ArticleController.update);

router.get('/delete/:id',ArticleController.destroy);

module.exports.routerArticleAdmin = router;