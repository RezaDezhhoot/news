const mongoose = require('mongoose');

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

// categorySchema.pre("findOneAndDelete", function() {
//     console.log("called!!!");
// });

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;