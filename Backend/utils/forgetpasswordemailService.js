const nodemailer = require("nodemailer");

const sendForgetPasswordEmail = async (to, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail", 
    auth: {
        user: "rajdevchauhan1074@gmail.com",
        pass: "sshb xrvd rnqf ruqy"
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "Password Reset OTP",
    text: `Your OTP for password reset is ${otp}`,
  };

  await transporter.sendMail(mailOptions);
};


module.exports = {sendForgetPasswordEmail};