const User = require('../models/User');
const emailVerification = require('../utils/emailVerification');
const validation = require('../utils/validation');
const jwt = require('jsonwebtoken');
// const config = require('../config');
const { uploadFile } = require('../utils/aws') 
const otpGenerator = require('otp-generator');
const twilio = require('twilio');
// TWILIO_PHONE_NUMBER
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)


exports.signup = async (req, res) => {
    try {

        const data = req.body
        let file = req.files
    
        const { name, email, mobileNumber, password } = data
        const formattedMobileNumber = mobileNumber.startsWith('+') ? mobileNumber : `+91${mobileNumber}`;

        if(!name){
            return res.status(400).json({message:"name must be present"})
        }

        // Validate email and mobile number
        if (!validation.isValidEmail(email) || !validation.isValidMobileNumber(mobileNumber)) {
            return res.status(400).json({ message: 'Invalid email or mobile number' });

        //__________If ProfileImage is not Given_____________
        }
        // if (file.length == 0) return res.status(400).send({ status: false, message: "ProfileImage field is Mandatory" });

        // //_______If wrong key is given incase of ProfileImage_________

        // if (file && file.length > 0) {
        //     let uploadImage = await uploadFile(file[0]);
        //     data.profileImage = uploadImage
        //     if(!validImage(data.profileImage)) return res.status(400).send({ status : false, message : "Invalid format of image"})
        // }
        

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
            mobileNumber:formattedMobileNumber,
            password,
            otp: otp,
            mobileOTP: null, 
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
        const token = jwt.sign({ userId: user._id }, "secreteKey");

        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


exports.verifyEmail = async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Get the user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

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

        // Add country code if not provided
        const formattedMobileNumber = mobileNumber.startsWith('+') ? mobileNumber : `+91${mobileNumber}`;

        const mobileOTP = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });

        // Log generated OTP for debugging
        console.log("Generated OTP:", mobileOTP);

        // Update mobileOTP field for the user
        const updatedUser = await User.findOneAndUpdate(
            { mobileNumber: formattedMobileNumber },
            { mobileOTP: mobileOTP },
            { new: true } // Return the updated document
        );

        if (!updatedUser) {
            // If user not found, handle it
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Send SMS using Twilio
        await client.messages.create({
            body: `Your OTP is: ${mobileOTP}`,
            to: formattedMobileNumber,
            from: process.env.TWILIO_PHONE_NUMBER
        });

        return res.status(200).json({ success: true, msg: "OTP sent successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};



exports.verifyOTP = async (req, res) => {
    try {
        const { mobileNumber, mobileOTP } = req.body;

        const formattedMobileNumber = mobileNumber.startsWith('+') ? mobileNumber : `+91${mobileNumber}`;

        // Verify OTP
        const otpData = await User.findOne({
            mobileNumber :formattedMobileNumber,
            mobileOTP
        })
        
        if(!otpData){
            return res.status(400).json({
                success:false,msg:'you enterted wrong otp'
            })
        }

        otpData.mobileVerified = true;
        await otpData.save();
        
        return res.status(200).json({ success: true, message: 'Mobile OTP verified successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
