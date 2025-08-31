// import express , dotenv , database

require("dotenv").config();
const express  = require("express");
const mongoose = require("mongoose"); 


// Middleware to handle Json Data
const app = express();

app.use(express.json())


mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err =>  console.error("❌ MongoDB Connection Failed:", err));


// import router
const authRoutes = require("./routes/auth");

app.get("/", (req, res) => {
  res.send("Server is working ✅");
});


app.use("/api/auth" , authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});