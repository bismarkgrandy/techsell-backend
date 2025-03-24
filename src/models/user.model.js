import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
    },
    studentEmail:{
        type:String,
        required:true,
        match: /^[a-zA-Z0-9._%+-]+@st\.knust\.edu\.gh$/,
    },
    password:{
        type:String,
        required:true,
        minlenght:6,
    },
    residence:{
        type:String,
        required:true,
    },
    roles:{ 
    type:[String], 
    enum:["buyer", "seller" , "delivery" , "admin"], 
    default:"buyer"  // Default role is "buyer"
  },

  // Seller Fields
  storeName: { type: String , default: "none"},
  sellerPhone: { type: String , default: "none" }, // Mobile Money Number
  idNumber: { type: String , default : "none" },
  sellerStatus: { type: String, enum: ["not applied","pending", "approved", "rejected"], default: "not applied" },

  // Delivery Personnel Fields
  deliveryStatus: { type: String, enum: ["not applied","pending", "approved", "rejected"], default: "not applied" },
  deliveryPhone: {type:String, default: "none"}
}, {timestamps:true});

const User = new mongoose.model("User",userSchema);

export default User;