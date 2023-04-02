const {Router} = require('express');
const ChannelController = require('../Controllers/Api/V1/ChannelController');
const {authenticated} = require("../../Auth/Middlewares/Auth");

const router = new Router('').use(authenticated);

// channels V1
router.get('/',ChannelController.index);

router.get('/:id',ChannelController.show);

exports.channelRouterV1 = router;
// end channels V1
