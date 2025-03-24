import nodemailer from "nodemailer";
import Otp from "../../models/otp.model.js";

const  sendEmail = async (email,otpCode) => {
    const transporter = nodemailer.createTransport({
        service: "gmail", 
        auth: {
            user: process.env.EMAIL_USER, 
            pass: process.env.EMAIL_PASS, 
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER, 
        to:email, 
        subject:"Verify Your Email - OTP Code",
        text:`Your OTP is: ${otpCode}. It expires in 5 minutes.`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${email}`);

    

}

export default sendEmail;