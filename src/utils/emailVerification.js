const nodemailer = require('nodemailer');
// const config = require('../config');


exports.sendVerificationEmail = async ( email, otp) => {
    try {
        // const verificationCode = Math.floor(100000 + Math.random() * 900000); // Generate random 6-digit code

        const transporter = nodemailer.createTransport({
            host:'smtp.gmail.com',
            port:465,
            secure:true,
            auth:{
                user:'nishitsolanki999@gmail.com',
                pass:'efpsiwuvsbskjdhg'
            }
        
        })

        const mailOptions = {
            from: 'solankinisitgujarat@gmail.com',
            to: email,
            subject: 'Email Verification',
            text: `Your verification code is  ${otp} `
        };

       
       const result = await transporter.sendMail(mailOptions);
       console.log("sent successfully", result)
        
    } catch (error) {
        console.error('Error sending verification email:', error);
        return null;
    }
};

