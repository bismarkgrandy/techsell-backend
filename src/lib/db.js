import mongoose from "mongoose";

export const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log("Mongodb is connected: ", conn.connection.host);
    } catch (error) {
        console.error("There is an error connecting to mongodb: ",error)
    }
}