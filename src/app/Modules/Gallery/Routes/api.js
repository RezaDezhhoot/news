const {Router} = require('express');
const GalleryController = require('../Controllers/Api/V1/GalleryController');
const GalleryControllerV2 = require('../Controllers/Api/V2/GalleryController');

const router = new Router('');
const routerV2 = new Router('');

router.get('/',GalleryController.index);

exports.galleryRouterV1 = router;

routerV2.get('/',GalleryControllerV2.index);

exports.galleryRouterV2 = routerV2;