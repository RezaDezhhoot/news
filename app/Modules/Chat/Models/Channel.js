const mongoose = require('mongoose');
const Chat = require('./Chat');

const channelSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true,'عنوان الزامی می باشد'],
    },
    sub_title:{
        type: String,
        trim: true,
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

channelSchema.statics.factory = async function() {
    return await this.create({
        title: 'title',
        sub_title: 'test'
    });
}


const Channel = mongoose.model('Channel', channelSchema);

module.exports = Channel;