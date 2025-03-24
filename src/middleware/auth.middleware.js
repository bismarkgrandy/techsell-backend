import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async(req, res, next) => {
    try{
        const token = req.cookies.jwt;

        if(!token){
            return res.status(401).json({message:"Unauthorized - no token available"});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(!decoded){
            return res.status(401).json({message:"Unauthorized - invalid token"});
        }

        const user = await User.findById(decoded.userId).select("-password");

        req.user = user;

        next();

    } catch(error){
        console.error("Error in the protectRoute middleware: ", error.message);
        res.status(500).json({message:"Internal server error"});
    }
}


export const protectAdminRoute = async (req, res, next) => {
  try {
    // 1️⃣ Extract token from headers
    const token = req.cookies.jwt || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Access denied. No token provided." });
    }

    // 2️⃣ Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3️⃣ Find the user in the database
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // 4️⃣ Check if the user has the admin role
    if (!user.roles.includes("admin")) {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }

    req.user = user; // Store user data in request
    next(); // Proceed to the next middleware or controller
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token." });
  }
};
