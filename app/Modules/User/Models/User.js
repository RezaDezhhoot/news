const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    full_name: {
        type: String,
        trim: true,
    },
    phone: {
        type: String,
        required: [true,'شماره همراه الزامی می باشد'],
        trim: true,
        unique: [true,'این شماره همراه قبلا ثبت شده است'],
    },
    email: {
        type: String,
        required: false,
        trim: true,
        unique: [true,'این ادرس ایمیل قبلا ثبت شده است'],
    },
    image:{
        type: String,
        required: false,
        trim: true,
    },
    password: {
        type: String,
        required: [true,'رمزعبور الزامی می باشد'],
        minLength: 4,
        maxLength: 255,
    },
    role:{
        type: String,
        required: true,
        default: "user",
        enum: ["admin","administrator","user"]
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

userSchema.index({'$**': 'text'});

userSchema.pre("save", function(next) {
    let user = this;
    if (!user.isModified("password")) return next();
    bcrypt.hash(user.password, 10, (err, hash) => {
        if (err) return next();

        user.password = hash;
        next();
    });
});

const User = mongoose.model('User', userSchema);

module.exports = User;