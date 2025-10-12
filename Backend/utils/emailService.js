const nodemailer = require("nodemailer");
require("dotenv").config();
// console.log("pass",process.env.EMAIL_USER,);
const transporter = nodemailer.createTransport({
    
    service: "gmail",
    auth: {
        user: "akprajapati18800@gmail.com",
        pass: "cpfm cwoh hazp fcjo"
    }
});

const sendOTPEmail = async (email, otp) => {
    const mailOptions = {
        from: "akprajapati18800@gmail.com",
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
