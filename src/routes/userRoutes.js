const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Signup route
router.post('/signup', userController.signup);

// Login route
router.post('/login', userController.login);

// Verify email route
router.post('/verifyemail', userController.verifyEmail);

// Verify mobile OTP route
router.post('/verifyotp', userController.verifyOTP);

//sendotp
router.post("/sendotp",userController.sendOTP)

module.exports = router;
