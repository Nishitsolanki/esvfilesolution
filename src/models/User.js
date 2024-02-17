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
        type: String,
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
        type: String,
        default: null
    }
});

module.exports = mongoose.model('User', userSchema);
