const {Router} = require('express');
const ChannelController = require('../Controllers/Api/V1/ChannelController');
const ChatController = require('../Controllers/Api/V1/ChatController');
const {authenticated} = require("../../Auth/Middlewares/Auth");

const router = new Router('').use(authenticated);
const chatRouter = new Router('').use(authenticated);

// channels V1
router.get('/',ChannelController.index);

router.get('/:id',ChannelController.show);

exports.channelRouterV1 = router;
// end channels V1


// chats V1
chatRouter.get('/:channel',ChatController.index);

exports.chatRouterV1 = chatRouter;
// end chats
