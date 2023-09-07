const {Router} = require('express');
const {admin} = require('../../Auth/Middlewares/Admin');
const ChannelController = require('../Controllers/Admin/ChannelController');

const router = new Router('').use(admin);

router.get('/',ChannelController.index);

router.get('/create',ChannelController.create);

router.post('/store',ChannelController.store);

router.get('/edit/:id',ChannelController.edit);

router.post('/update/:id',ChannelController.update);

router.get('/delete/:id',ChannelController.destroy);

module.exports.routerChatAdmin = router;