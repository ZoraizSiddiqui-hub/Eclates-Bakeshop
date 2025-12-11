import mongoose from "mongoose";




export const connectDB = async () => {
        await mongoose.connect ('mongodb+srv://zoraizsid49:BBBanchoss1122@cluster0.7hn88hg.mongodb.net/Eclates').then(() => {
            console.log("MongoDB connected successfully");
        })
    }                