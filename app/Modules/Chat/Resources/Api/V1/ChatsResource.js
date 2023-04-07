const UserResource = require('../../../../User/Resources/Api/V1/UserResource');

module.exports.make = (chat) => {
    return {
        '_id': chat._id,
        'text': chat.text,
        'reply': chat.reply ? {
            '_id': chat.reply._id,
            'text': chat.reply.text,
            'user':  UserResource.make(chat.reply.user,undefined,['role','status','phone'])
        } : undefined,
        'user': chat.user ? UserResource.make(chat.user,undefined,['role','status','phone']) : undefined,
        'created_at': chat.created_at,
    }
}

module.exports.collection = (chats) => {
    let res = [];
    chats.forEach( (v , k) => {
        res[k] = this.make(v)
    } );

    return res;
}