const utils = require("../../../../../../utils/helpers");
const UserResource = require("../../../../User/Resources/Api/V1/UserResource");
const Chat = require('../../../Models/Chat');
const Channel = require('../../../Models/Channel');
const ChatsResource = require("../../../Resources/Api/V1/ChatsResource");
const jwt = require("jsonwebtoken");
const User = require("../../../../User/Models/User");
const {ADMIN, ADMINSTRATOR} = require("../../../../../Base/Constants/Role");
let users = [];
let typistUsers = [];

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

       console.log(e);
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
        users.push({
            socketId: socket.id,
            user:UserResource.make(user , null,['status','phone']),
        });
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

    users = users.filter((v) => {
        return v.socketId !== socket.id
    });

    typistUsers = typistUsers.filter((v) => {
        return v?.socketId !== socket.id
    });

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

    let user = users.filter((v) => {return v.socketId === socket.id})[0].user;

    if (typeof user._id !== undefined && data.text && await Channel.exists({_id: channel._id}) ) {

        try {
            chat = await Chat.create({
                text: data.text,
                user: user._id,
                channel: channel.id,
                reply: data.reply ? data.reply : undefined,
                created_at: Date.now()
            });
            await Chat.populate(chat,['user','reply',{
                path: 'reply',
                populate: {path: 'user' , model: 'User'}
            }]);
            console.log(`message has been sent by client : ${socket.id} , name : ${user.full_name} , text: ${data.text} , date : ${chat.created_at}`)
            status = 201;
        } catch (e) {
            status = 500;
        }
    }


    users.forEach(v => {
        io.to(v.socketId).emit('getMessage',{
            data: {
                chat: (chat && user._id) ? ChatsResource.make(chat,v.user._id) : null
            },
            status
        });
    });
}

module.exports.deleteMessage = async (io , socket  , channel , data) => {
    let status = 200;
    let message;
    let user = users.filter((v) => {return v.socketId === socket.id})[0].user;
    try {
        if (data.chat_id && typeof user !== undefined) {
            const chat = await Chat.findOne({_id: data.chat_id});
            console.log(user._id.toString() , chat.user.toString() );
            console.log(user._id.toString() === chat.user.toString() );
            if (chat && (user._id.toString() === chat.user.toString() || user.role === ADMIN || user.role === ADMINSTRATOR) ) {
                await Chat.findByIdAndRemove(chat._id);
                message = 'پیام مورد نظر با موفقیت حذف شد';
                console.log(message);
            } else {
                message = 'پیام مورد نظر پیدا نشد';
                console.log(message)
                status = 404;
            }
        }

    } catch (e) {
        status = 500;
        message = e;
    }
    console.log(status);
    io.emit('deleteMessage',{
        data:{
            chat_id: data.chat_id,
            status,
            message
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
    let status;
   try {
       if (! typistUsers.filter((v) => {
           return socket.id === v.socketId;
       })[0]) {
           typistUsers.push(users.filter((v) => {
               return v.socketId === socket.id
           })[0]);
       }

       console.log('typist users :');
       console.log(typistUsers);
       status = 200;
   } catch (e) {
       status = 500;
   }
    socket.broadcast.emit('getTypistUsers',{
        data:{
            typistUsers
        },
        status
    });
}

module.exports.finishTypingFeedback = async (io , socket  , channel , data) => {
    typistUsers = typistUsers.filter((v) => {
        return v.socketId !== socket.id
    });
    console.log('typist users :');
    console.log(typistUsers);
    socket.broadcast.emit('getTypistUsers',{
        data:{
            typistUsers
        },
        status: 200
    });
}