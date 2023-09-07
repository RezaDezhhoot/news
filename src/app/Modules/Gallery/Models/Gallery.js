const mongoose = require('mongoose');
const {clearCache} = require("../../../../utils/helpers");
const {VIDEO, IMAGE} = require("../Enums/Priority");

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
    video:{
        type: String,
        required: false,
        trim: true,
    },
    priority:{
        type: String,
        default: IMAGE,
        enum: [VIDEO,IMAGE],
        required: false,
    },
    created_at: {
        type: Date,
        default: Date.now()
    }
});


gallerySchema.statics.factory = async function(category) {
    return await this.create({
        title: 'title',
        priority: VIDEO,
        category
    });
}

gallerySchema.pre('findOneAndDelete', async function(next) {
    await clearCache('galleries*');
    next();
});

gallerySchema.pre('save', async function(next) {
    await clearCache('galleries*');
    next();
});

const Gallery = mongoose.model('Gallery', gallerySchema);

module.exports = Gallery;