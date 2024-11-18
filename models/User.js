const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    googleId: {
        type: String,
        unique: true,
        sparse: true,
    },
    name: {
        type: String,

    },
    email: {
        type: String,
        unique: true,
        sparse: true,

    },
    emailOTP: {
        otp: {
            type: String,
        },
        expiry: {
            type: Date,
        },
    },
    mobile: {
        type: String,
        unique: true,
        sparse: true, // This allows the field to be optional
    },
    mobileOTP: {
        otp: {
            type: String,
        },
        expiry: {
            type: Date,
        },
    },
    password: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('User', userSchema);
