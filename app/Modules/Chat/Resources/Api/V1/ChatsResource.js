const UserResource = require('../../../../User/Resources/Api/V1/UserResource');
const utils = require("../../../../../../utils/helpers");

module.exports.make = (chat , userId) => {
    return {
        '_id': chat._id,
        'text': chat.text,
        'my_chat': chat.user._id.toString() === userId.toString(),
        'reply': chat.reply ? {
            '_id': chat.reply._id,
            'text': chat.reply.text,
            'user':  UserResource.make(chat.reply.user,undefined,['role','status','phone'])
        } : undefined,
        'user': chat.user ? UserResource.make(chat.user,undefined,['role','status','phone']) : undefined,
        'created_at': Math.ceil(chat.created_at.getTime() / 1000),
    }
}

module.exports.collection = (chats , userId) => {
    let res = [];
    chats.forEach( (v , k) => {
        if (v.user) {
            res[k] = this.make(v , userId)
        }
    } );

    return res;
}