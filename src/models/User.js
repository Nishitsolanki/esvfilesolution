const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    // profileImage: {
    //     type: String,
    //     required: true
    // },


    mobileNumber: {
        type: Number,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    otp:{
        type:String
    },
    mobileOTP: {
        type: Number,
        default:null
    },
    mobileVerified: {
        type: Boolean,
        default: false,
        required: true
    }
});

module.exports = mongoose.model('User', userSchema);
