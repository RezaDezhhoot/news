const {Router} = require('express');
const {admin} = require('../../Auth/Middlewares/Admin');
const GalleryController = require('../Controllers/Admin/GalleryController');

const router = new Router('').use(admin);

router.get('/',GalleryController.index);

router.get('/create',GalleryController.create);

router.post('/store',GalleryController.store);

router.get('/edit/:id',GalleryController.edit);

router.post('/update/:id',GalleryController.update);

router.get('/delete/:id',GalleryController.destroy);

module.exports.routerGalleryAdmin = router;