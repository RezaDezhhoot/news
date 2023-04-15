const utils = require("../../../../../../utils/helpers");
const UserResource = require("../../../../User/Resources/Api/V1/UserResource");
const Chat = require('../../../Models/Chat');
const Channel = require('../../../Models/Channel');
const ChatsResource = require("../../../Resources/Api/V1/ChatsResource");
const jwt = require("jsonwebtoken");
const User = require("../../../../User/Models/User");
const {ADMIN, ADMINSTRATOR} = require("../../../../../Base/Constants/Role");
let users = {};
let typistUsers = {};

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
               chats: chats ? ChatsResource.collection(chats,req.userId) : {},
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

module.exports.online = async (io , socket , data , channel) => {
    const token = data.token.split(" ")[1];
    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    const user = await User.findOne({$and:[
            {_id:decoded.user._id},
            {status: true}
        ]}).exec();

    let status = 200;

    if (! user) {
        status = 401;
    } else {
        users[socket.id] = {
            socketId: socket.id,
            user:UserResource.make(user , null,['status','phone']),
        };
        console.log('online users :');
        console.log(users);
    }

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
    delete typistUsers[socket.id];
    console.log('online users :');
    console.log(users);
    socket.broadcast.emit('getTypistUsers',{
        data: {
            typistUsers
        },
        status: 200
    })
    io.emit('online',{
        data: {
            users
        },
        status: 200
    });
}

module.exports.sendMessage = async (io , socket  , channel , data) => {
    let chat = null ,  status = 422;
    if (typeof users[socket.id]?.user !== undefined && data.text && await Channel.exists({_id: channel._id}) ) {
        let user = users[socket.id].user;
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
            console.log(`message has been sent by client : ${socket.id} , name : ${user.full_name} , text: ${data.text}`)
            status = 201;
        } catch (e) {
            status = 500;
        }
    }
    io.emit('getMessage',{
        data: {
            chat: chat ? ChatsResource.make(chat,users[socket.id].user._id) : null
        },
        status
    });
}

module.exports.deleteMessage = async (io , socket  , channel , data) => {
    let status = 200;
    try {
        if (data.chat_id && typeof users[socket.id]?.user !== undefined) {
            const chat = await Chat.findOne({_id: data.chat_id});
            if (chat && (users[socket.id].user.role === ADMIN || users[socket.id].user.role === ADMINSTRATOR || users[socket.id].user._id === chat.user) ) {
                await Chat.findByIdAndRemove(chat._id);
                console.log(`chat with id : ${chat._id} has been removed`);
            } else {
                console.log('chat not found !')
                throw 'chat not found !';
            }
        }

    } catch (e) {
        status = 500;
    }
    io.emit('deleteMessage',{
        data:{
            chat_id: data.chat_id,
            status
        }
    })
}

module.exports.getTypistUsers = async (io , socket  , channel) => {
    console.log('typist users :');
    console.log(typistUsers);
    socket.broadcast.emit('getTypistUsers',{
        data:{
            typistUsers
        },
        status: 200
    });
}

module.exports.typingFeedback = async (io , socket  , channel) => {
    typistUsers[socket.id] = users[socket.id];
    console.log('typist users :');
    console.log(typistUsers);
    socket.broadcast.emit('getTypistUsers',{
        data:{
            typistUsers
        },
        status: 200
    });
}

module.exports.finishTypingFeedback = async (io , socket  , channel , data) => {
    delete typistUsers[socket.id];
    console.log('typist users :');
    console.log(typistUsers);
    socket.broadcast.emit('getTypistUsers',{
        data:{
            typistUsers
        },
        status: 200
    });
}