const {Router} = require('express');
const GalleryController = require('../Controllers/Api/V1/GalleryController');
const {authenticated} = require("../../Auth/Middlewares/Auth");

const router = new Router('').use(authenticated);

router.get('/',GalleryController.index);

exports.galleryRouterV1 = router;