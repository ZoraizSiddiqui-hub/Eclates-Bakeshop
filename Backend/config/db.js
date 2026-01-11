import mongoose from "mongoose";




export const connectDB = async () => {
        await mongoose.connect ('mongodb+srv://zoraizsiddiqui:zoraizsiddiqui@cluster0.7hn88hg.mongodb.net/Eclates').then(() => {
            console.log("MongoDB connected successfully");
        })
    }                
