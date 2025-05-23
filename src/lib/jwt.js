import jwt from "jsonwebtoken";

const generateToken = async(userId, res)=>{
 const token = jwt.sign({userId}, process.env.JWT_secret, {
    expiresIn:"7d"
 });

 res.cookie("jwt",token, {
    maxAge:7*24*60*60*1000,
    httpOnly:true,
    sameSite:"none",
    secure:process.env.NODE_ENV === "production"
 });

 return token;
}

export default generateToken;