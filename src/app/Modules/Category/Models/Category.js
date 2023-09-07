const mongoose = require('mongoose');
const {clearCache} = require("../../../../utils/helpers");

const categorySchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true,'عنوان الزامی می باشد'],
    },
    description: {
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

categorySchema.statics.factory = async function() {
    return await this.create({
        title: 'title',
        description: 'description',
    });
}

categorySchema.pre('findOneAndDelete', async function(next) {
    await clearCache('categories*');
    next();
});

categorySchema.pre('save', async function(next) {
    await clearCache('categories*');
    next();
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;