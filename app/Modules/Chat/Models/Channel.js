const mongoose = require('mongoose');
const Chat = require('./Chat');

const channelSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true,'عنوان الزامی می باشد'],
    },
    image:{
        type: String,
        required: false,
        trim: true,
    },
    status:{
        type: Boolean,
        default: true,
        enum: [true,false]
    },
    created_at: {
        type: Date,
        default: Date.now()
    }
});

const Channel = mongoose.model('Channel', channelSchema);

module.exports = Channel;