const {Router} = require('express');
const {admin} = require('../../Auth/Middlewares/Admin');
const CategoryController = require('../Controllers/Admin/CategoryController');

const router = new Router('').use(admin);

router.get('/',CategoryController.index);

router.get('/create',CategoryController.create);

router.post('/store',CategoryController.store);

router.get('/edit/:id',CategoryController.edit);

router.post('/update/:id',CategoryController.update);

router.get('/delete/:id',CategoryController.destroy);

module.exports.routerCategoryAdmin = router;