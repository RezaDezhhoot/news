const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
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
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },
    created_at: {
        type: Date,
        default: Date.now()
    }
});


const Gallery = mongoose.model('Gallery', gallerySchema);

module.exports = Gallery;