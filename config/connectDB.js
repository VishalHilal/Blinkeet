import mongoose from "mongoose";
import dotenv from 'dotenv'
import dns from "dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

dotenv.config();

const MONGO_URL =
  process.env.NODE_ENV === "production"
    ? process.env.MONGO_URL
    : "mongodb://127.0.0.1:27017/blinkeet";

if(!MONGO_URL){
    throw new Error(
        "Please provide MONGODB_URL in the .env file"
    )
}

async function connectDB(){
    try {
       const database = await mongoose.connect(process.env.MONGO_URL);
        console.log("database connected successfully")
    } catch (error) {
        console.log("Mongodb connect error",error)
        process.exit(1)
    }
}

export default connectDB