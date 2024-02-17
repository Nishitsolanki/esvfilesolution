// models/Verification.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Verification schema
const verificationSchema = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },
    otp: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '5m' // Optional: expire documents after 5 minutes
    }
});

// Create the Verification model
const Verification = mongoose.model('Verification', verificationSchema);

module.exports = Verification;
