const {Router} = require('express');
const GalleryController = require('../Controllers/Api/V1/GalleryController');

const router = new Router('');

router.get('/',GalleryController.index);

exports.galleryRouterV1 = router;