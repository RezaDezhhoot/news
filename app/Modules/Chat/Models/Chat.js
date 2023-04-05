const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    text: {
        type: String,
        trim: true,
        required: [true,'عنوان الزامی می باشد'],
    },
    channel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Channel"
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    reply: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat"
    },
    created_at: {
        type: Date,
        default: Date.now()
    }
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;