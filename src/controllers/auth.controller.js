import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import User from "../models/user.model.js";
import Otp from "../models/otp.model.js";
import { generateOtpAndSendEmail, verifyAndDeleteOtp } from "../lib/otpService/generateOtpAndSendEmail.js";
import generateToken from "../lib/jwt.js";





export const signup = async (req, res) => {
    try{
       const {username, studentEmail , password, residence} = req.body;
       if(!username || !studentEmail || !password) return res.status(400).json({message:"All fields are required"}) ;

       const emailRegex = /^[a-zA-Z0-9._%+-]+@st\.knust\.edu\.gh$/;

       if(!emailRegex) return res.status(400).json({error: "Must be @st.knust.edu.gh"});

       if(password.length < 6) return res.status(400).json({message:"Password should be at least six characters"});

       const user = await User.findOne({studentEmail});
       if(user) return res.status(409).json({message:"Email already exists"});

       const otpResponse = await generateOtpAndSendEmail(studentEmail);
        if (!otpResponse.success) {
            return res.status(500).json({ message: "Error sending OTP" });
        }
        

        return res.status(200).json({
            message: "OTP sent to your email. Please verify to complete registration.",
        
        });

    } catch (error) {
        res.status(500).json({message: "Internal server error"})
        console.error("Error in signup controller: ", error.message)

    }
    ;
}

export const verifyOtpAndRegister = async (req, res)=>{
    try{
        // The frontend saves the username,password, studentEmail,residence after the signup page in local storage and sends it with enteredOtp
        const {username,studentEmail,password,residence,enteredOtp} = req.body;

        const otpResponse = await verifyAndDeleteOtp(studentEmail, enteredOtp);
        if (!otpResponse.success) {
            return res.status(400).json({ message: otpResponse.message });
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const newUser = new User({
            username,
            studentEmail,
            residence,
            password: hashedPassword,
        });

        generateToken(newUser._id, res);

        await newUser.save();

        res.status(201).json({_id:newUser._id, username:newUser.username, studentEmail:newUser.studentEmail,residence:newUser.residence});

    } catch(error){
        console.error("Error in verifyOtpAndRegister:", error.message);
        res.status(500).json({ message: "Internal server error" });

    }

}

export const resendOtp = async (req, res)=>{
    try {
        const { email } = req.body;

        // Check if an OTP exists for the email
        const otpRecord = await Otp.findOne({ email });

        if (!otpRecord) {
            return res.status(400).json({ message: "No previous OTP request found. Please sign up first." });
        }

        // Check if user is requesting OTP too frequently (e.g., within 1 minute)
        const timeSinceLastOtp = Date.now() - otpRecord.createdAt;
        if (timeSinceLastOtp < 60 * 1000) {
            return res.status(429).json({ message: "Please wait a minute before requesting another OTP." });
        }

        // Generate and send new OTP
        await generateOtpAndSendEmail(email);

        return res.status(200).json({ message: "New OTP sent successfully." });
    } catch (error) {
        console.error("Error in resending OTP:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const login = async (req, res) => {
    const {studentEmail,password} = req.body;
    try{
       const user = await User.findOne({studentEmail});
       if(!user){
        return res.status(401).json({message: "User not found"});
       }
       
       const isPassword = await bcrypt.compare(password, user.password);

        if(!isPassword){
            return res.status(401).json({message:"Invalid credentials"})
        }

        generateToken(user._id, res);

        res.status(200).json({_id:user._id,username:user.username,studentEmail:user.studentEmail,residence:user.residence})
     
    } catch(error){
        console.error("Error in login route:" , error.message);
        res.status(500).json({message:"Internal server error"});

    }
}

export const logout = async (req, res) => {
    try{
        res.cookie("jwt","" , {maxAge:0});
        res.status(200).json({message:"Logged out succesfully"})

    } catch(error){
        console.error("Error in logout controller: ", error.message )
        res.status(500).json({message:"Internal server error"});
    }
}

export const getUserInfo = async (req, res) => {
    try{
        res.status(200).json(req.user)

    } catch (error){
        console.error("Error in get user info controller: ", error.message);
        res.status(500).json({message:"internal server error"});

    }
}

export const requestSellerRole = async (req, res) => {
    try {
      const userId = req.user._id;
      const { storeName, sellerPhone, idNumber } = req.body;
  
      // Validate input
      if (!storeName || !sellerPhone || !idNumber) {
        return res.status(400).json({ error: "All fields are required." });
      }

      if(sellerPhone.length!=10){
        return res.status(400).json({error: "The length of the phone should be 10"})
      }
  
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ error: "User not found." });
  
      // Check if already a seller
      if (user.roles.includes("seller")) {
        return res.status(400).json({ error: "You are already a seller." });
      }
  
      // Update user role
      
      user.sellerStatus = "pending"; // Will be approved by admin
      user.storeName = storeName;
      user.sellerPhone = sellerPhone;
      user.idNumber = idNumber;
  
      await user.save();
  
      res.status(200).json({ 
        message: "Request submitted. Please visit the office for verification.",
        user
      });
    } catch (error) {
      console.error("Error requesting seller role:", error);
      res.status(500).json({ error: "Internal server error." });
    }
  };

  export const requestDeliveryRole = async (req, res) => {
    try {
      const userId = req.user._id;
      const {deliveryPhone} = req.body;

      if (!deliveryPhone) {
        return res.status(400).json({ error: "Phone is required for later momo transactions." });
      }

      if(deliveryPhone.length!=10){
        return res.status(400).json({error: "The length of the phone should be 10"})
      }
  
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ error: "User not found." });
  
      // Check if already a delivery personnel
      if (user.roles.includes("delivery")) {
        return res.status(400).json({ error: "You are already a delivery personnel." });
      }
 

  
      // Update user role
      
      user.deliveryStatus = "pending"; // Will be approved by admin
      user.deliveryPhone = deliveryPhone;
  
      await user.save();
  
      res.status(200).json({ 
        message: "Request submitted. Please visit the office with student ID and admission letter.",
        user
      });
    } catch (error) {
      console.error("Error requesting delivery role:", error);
      res.status(500).json({ error: "Internal server error." });
    }
  };

  
  