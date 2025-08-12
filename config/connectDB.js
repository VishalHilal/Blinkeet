import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()

if(!process.env.MONGO_URL){
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