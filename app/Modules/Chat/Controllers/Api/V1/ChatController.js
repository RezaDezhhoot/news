const utils = require("../../../../../../utils/helpers");
const UserResource = require("../../../../User/Resources/Api/V1/UserResource");
const Chat = require('../../../Models/Chat');
const Channel = require('../../../Models/Channel');
const ChatsResource = require("../../../Resources/Api/V1/ChatsResource");
let users = [];

module.exports.index = async (req , res) => {
   try {
       const page = +req.query.page || 1 , PerPage = +req.query.per_page ||  10;
       let chats , itemNumbers = 0 , options = {channel: req.params.channel};

       if (await Channel.exists({ $and:[
               {_id: req.params.channel}, {status: true}
           ]})) {
           chats = await Chat.find(options).populate(['user','reply',{
               path: 'reply',
               populate: {path: 'user' , model: 'User'}
           }]).sort([['_id', 'descending']]).skip((page-1)*PerPage).limit(PerPage).exec();
           itemNumbers = await Chat.find(options).countDocuments();
       }

       let hasNextPage = PerPage * page < itemNumbers , hasPrePage = page>1 ;

       return res.status(200).json({
           data: {
               chats: chats ? ChatsResource.collection(chats) : {},
               meta:{
                   currentPage: page,
                   nextPage: hasNextPage ? page + 1 : undefined,
                   prePage: hasPrePage ? page-1 : undefined,
                   lastPage: Math.ceil(itemNumbers/PerPage),
                   hasNextPage,
                   hasPrePage,
               }
           },
           message: 'success'
       });
   } catch (e) {
       const errors = utils.getErrors(e);
       return res.status(errors.status).json({ data: errors.errors, message: 'error' });
   }
}

module.exports.online = async (io , socket , data) => {
    let user = await utils.findUserByToken(data) , status = 200;

    if (! user) {
        status = 401;
    }

    users[socket.id] = {
        socketId: socket.id,
        user: user ? UserResource.make(user , null,['role','status','phone','email']) : null,
    };
    io.emit('online',{
        data:{
            users
        },
        status
    });
}

module.exports.disconnect = async (io , socket  , channel) => {
    console.log(`User disconnected with id: ${socket.id} from ${channel.title} channel.`);
    delete users[socket.id];
    io.emit('online',{
        data: {
            users
        },
        status: 200
    });
}

module.exports.sendMessage = async (io , socket  , channel , data) => {
    let user = users[socket.id].user;
    let chat = null ,  status = 422;

    if (user._id && data.text) {
        try {
            chat = await Chat.create({
                text: data.text,
                user: user._id,
                channel: channel.id,
                reply: data.reply ? data.reply : undefined
            });
            await Chat.populate(chat,['user','reply',{
                path: 'reply',
                populate: {path: 'user' , model: 'User'}
            }]);
            status = 201;
        } catch (e) {
            status = 500;
        }
    }
    io.emit('getMessage',{
        data: {
            chat: chat ? ChatsResource.make(chat) : null
        },
        status
    });
}

module.exports.deleteMessage = async (io , socket  , channel) => {

}

module.exports.typingFeedback = async (io , socket  , channel) => {

}