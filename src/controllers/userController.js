const User = require('../models/User');
const emailVerification = require('../utils/emailVerification');
const mobileOTP = require('../utils/mobileOTP');
const validation = require('../utils/validation');
const jwt = require('jsonwebtoken');
const config = require('../config');
const { uploadFile } = require('../utils/aws') 
const otpGenerator = require('otp-generator');


exports.signup = async (req, res) => {
    try {
        let file = req.files
        const { name, email, mobileNumber, password } = req.body;

        if(!name){
            return res.status(400).json({message:"name must be present"})
        }

        // Validate email and mobile number
        if (!validation.isValidEmail(email) || !validation.isValidMobileNumber(mobileNumber)) {
            return res.status(400).json({ message: 'Invalid email or mobile number' });
        }

        //  //__________If ProfileImage is not Given_____________
        //  if (file.length == 0) return res.status(400).send({ status: false, message: "ProfileImage field is Mandatory" });

        //  //_______If wrong key is given incase of ProfileImage_________
        //  if (file[0].fieldname !== "profileImage") {
        //      return res.status(400).send({ status: false, message: "Valid key is ProfileImage. Please provide file with key profileImage" });
        //  }
 
        //  if (file && file.length > 0) {
        //      let uploadImage = await uploadFile(file[0]);
        //      req.body.profileImage = uploadImage
        //      if(!validImage(req.body.profileImage)) return res.status(400).send({ status : false, message : "Invalid format of image"})
        //  }

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets: false });


        // Create new user
        user = new User({
            name,
            email,
            mobileNumber,
            password,
            otp: otp,
            isVerified: false 
        });

        // Save user to database
        const userData = await user.save();

        if(userData){
            await emailVerification.sendVerificationEmail(email, otp); 
        }
        
        res.status(201).json({ message: 'User registered successfully. Please verify your email.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check password
        if (user.password !== password) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        // Check if email is verified
        if (!user.isEmailVerified) {
            return res.status(403).json({ message: 'Email not verified' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, config.jwtSecret);

        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// exports.verifyEmail = async (req, res) => {
//     try {
//         const { email, verificationCode } = req.body;

//         // Verify email
//         const isVerified = await emailVerification.verifyEmail(email, verificationCode);
//         if (!isVerified) {
//             return res.status(400).json({ message: 'Invalid verification code' });
//         }
        
//         await User.findOneAndUpdate({ email }, { $set: { isEmailVerified: true } });

//         res.json({ message: 'Email verified successfully' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };


exports.verifyEmail = async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Get the user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // // Verify email
        // const isVerified = await emailVerification.verifyEmail(email, otp);
        // if (!isVerified) {
        //     return res.status(400).json({ message: 'Invalid verification code' });
        // }
        // console.log("Verification result:", isVerified)

        if (user.otp !== otp) {
            return res.status(400).json({ message: 'Incorrect OTP. Please try again.' });
        }

        user.isEmailVerified = true;
        await user.save();

        res.json({ message: 'Email verified successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};




exports.sendOTP = async (req, res) => {
    try {
        const { mobileNumber } = req.body;

        // Generate and send OTP
        const otp = await mobileOTP.sendOTP(mobileNumber);
        if (!otp) {
            return res.status(500).json({ message: 'Failed to send OTP' });
        }

        // Update user's mobile OTP
        await User.findOneAndUpdate({ mobileNumber }, { $set: { mobileOTP: otp } });

        res.json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.verifyOTP = async (req, res) => {
    try {
        const { mobileNumber, otp } = req.body;

        // Verify OTP
        const isVerified = await mobileOTP.verifyOTP(mobileNumber, otp);
        if (!isVerified) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        // Update user's mobile OTP status
    const otps =await User.findOneAndUpdate({ mobileNumber }, { $set: { mobileOTP: null } });
    console.log(otps)

        res.json({ message: 'Mobile OTP verified successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
