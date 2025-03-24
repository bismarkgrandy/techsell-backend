import crypto from "crypto";
import sendEmail from "./sendEmail.js";
import Otp from "../../models/otp.model.js";


const OTP_EXPIRATION_TIME = 5 * 60 * 1000; // 5 minutes

export const generateOtpAndSendEmail = async (email) => {
    try{
        const otpCode = crypto.randomInt(100000,999999).toString();
        await Otp.findOneAndUpdate(
        { email },
        { otp: otpCode, createdAt: Date.now() },
        { upsert: true, new: true }
    );


       try{
        await sendEmail(email,otpCode)
       } catch (emailerror){
        console.error("Error sending email:", emailError);
        return { success: false, message: "Failed to send OTP email" };
       }
    

    return { success: true, message: "OTP sent successfully" };


    } catch(error){
        console.error("Error in generating OTP and send email controller:", error);
        return { success: false, message: "Error generating OTP" };
    }
    
}



// export const verifyAndDeleteOtp = async (email, enteredOtp) => {
//     try {
//         const otpRecord = await Otp.findOne({ email });

//         if (!otpRecord) {
//             return { success: false, message: "No OTP found for this email" };
//         }

//         const isExpired = Date.now() - otpRecord.createdAt > OTP_EXPIRATION_TIME;
//         if (isExpired) {
//             await Otp.deleteOne({email})
//             return { success: false, message: "OTP expired" };
//         }

//         if (otpRecord.otp !== enteredOtp) {
//             return { success: false, message: "Invalid OTP" };
//         }

//         // OTP verified, delete it from DB
//         await Otp.deleteOne({ email });

//         return { success: true, message: "OTP verified successfully" };
//     } catch (error) {
//         console.error("Error verifying OTP:", error);
//         return { success: false, message: "Error verifying OTP" };
//     }
// };
    
export const verifyAndDeleteOtp = async (email, enteredOtp) => {
    try {
        const otpRecord = await Otp.findOne({ email });

        if (!otpRecord) {
            return { success: false, message: "No OTP found for this email. Please request a new one." };
        }

        const isExpired = Date.now() - otpRecord.createdAt > OTP_EXPIRATION_TIME;
        if (isExpired) {
            await Otp.deleteOne({ email }); // Delete expired OTP
            return { success: false, message: "OTP expired. Please request a new one." };
        }

        if (otpRecord.otp !== enteredOtp) {
            return { success: false, message: "Invalid OTP. Please try again." }; // ❌ Do NOT delete OTP, let the user retry
        }

        // ✅ OTP verified → delete it
        await Otp.deleteOne({ email });

        return { success: true, message: "OTP verified successfully" };
    } catch (error) {
        console.error("Error verifying OTP:", error);
        return { success: false, message: "Error verifying OTP" };
    }
};



