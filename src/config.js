module.exports = {
    emailConfig: {
        // Configuration for sending email verification
    },
    mobileOTPConfig: {
        // Configuration for sending mobile OTP
    },
    jwtSecret: 'your_secret_key'
};

// module.exports = {
//     // Port number
//     port: process.env.PORT || 3000,

//     // MongoDB connection string
//     // mongoURI: process.env.MONGODB_URI || 'mongodb://localhost:27017/mydatabase',

//     // JWT secret key
//     jwtSecret: process.env.JWT_SECRET || 'mysecretkey',

//     // Email configuration
//     emailConfig: {
//         service: process.env.EMAIL_SERVICE || 'gmail',
//         auth: {
//             user: process.env.EMAIL_USER || 'example@gmail.com',
//             pass: process.env.EMAIL_PASS || 'password'
//         }
//     },

//     // Twilio configuration for SMS
//     twilioConfig: {
//         accountSid: process.env.TWILIO_ACCOUNT_SID || 'your_account_sid',
//         authToken: process.env.TWILIO_AUTH_TOKEN || 'your_auth_token',
//         phoneNumber: process.env.TWILIO_PHONE_NUMBER || '+1234567890'
//     }
// };

