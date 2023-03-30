const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    phone: {
        type: String,
        required: [true,'شماره همراه الزامی می باشد'],
        trim: true,
    },
    value: {
        type: Number,
        required: true,
        trim: true,
    },
    status: {
        type: Boolean,
        default: false,
    },
    expires_at: {
        type: Date,
    },
    created_at: {
        type: Date,
        default: Date.now()
    }
});

tokenSchema.pre("save", function(next) {
    let token = this;
    if (!token.isModified("value")) return next();
    bcrypt.hash(token.value, 10, (err, hash) => {
        if (err) return next();

        token.value = hash;
        next();
    });
});

const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;