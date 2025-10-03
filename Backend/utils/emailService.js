const nodemailer = require("nodemailer");
require("dotenv").config();
// console.log("pass",process.env.EMAIL_USER,);
const transporter = nodemailer.createTransport({
    
    service: "gmail",
    auth: {
        user: "rajdevchauhan1074@gmail.com",
        pass: "sshb xrvd rnqf ruqy"
    }
});

const sendOTPEmail = async (email, otp) => {
    const mailOptions = {
        from: "rajdevchauhan1074@gmail.com",
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP code is: ${otp}. It will expire in 10 minutes.`
    };

    try {
        await transporter.sendMail(mailOptions);
        // console.log("OTP Email sent successfully");
    } catch (error) {
        console.error("Error sending OTP Email:", error);
    }
};

module.exports = { sendOTPEmail };
