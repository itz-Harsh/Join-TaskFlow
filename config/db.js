const mongoose = require('mongoose');

const connectDB = async () => {
    try{
        await mongoose.connect("mongodb://Localhost:27017/todoApp");
        console.log("✅ MongoDB Connected...")
    } catch {
        console.error("❌ MongoDB Connection Failed:");
        process.exit(1);
    }
};


module.exports = connectDB;