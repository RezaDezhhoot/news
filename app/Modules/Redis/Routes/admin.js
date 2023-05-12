const {Router} = require('express');
const {admin} = require('../../Auth/Middlewares/Admin');
const RedisController = require('../Controllers/Admin/RedisController');

const router = new Router('').use(admin);

router.get('/flush',RedisController.flush);

exports.routerRedis = router;