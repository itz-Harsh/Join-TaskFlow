import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

import User from "../models/User.js";
import Otp from "../models/otp.js";
import auth from "../middleware/auth.js";

dotenv.config();
const router = express.Router();

// ===== Mail Helper =====
const SendMail = async (firstname, email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USER,
      pass: process.env.PASS,
    },
  });

  await transporter.sendMail({
    from: `Verification <${process.env.USER}>`,
    to: email,
    subject: "Your One-Time Password (OTP)",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.5;">
        <h2 style="color: #4a61e2ff;">Verify!</h2>
        <h3>Hello, ${firstname}</h3>
        <p>Your <strong>One-Time Password (OTP)</strong> is:</p>
        <h1 style="color: #e91e40ff;">${otp}</h1>
        <p>This OTP is <strong>valid for 5 minutes</strong>. Please do not share it with anyone.</p>
        <p>If you did not request this OTP, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eee;" />
        <p style="font-size: 12px; color: #999;">
          &copy; ${new Date().getFullYear()} Made with ❤️ by <strong>Harsh</strong>
        </p>
      </div>
    `,
  });
};

// ===== Forgot Password (Send OTP) =====
router.post("/forgot", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const existingUser = await User.findOne({ email });
    if (!existingUser) return res.status(400).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP for password reset
    await Otp.findOneAndUpdate(
      { email },
      { otp, otpExpire: Date.now() + 5 * 60 * 1000 },
      { upsert: true, new: true }
    );

    await SendMail(existingUser.firstname, email, otp);

    res.json({ message: "Password reset OTP sent ✅" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to process request" });
  }
});

// ===== Signup OTP Verification =====
router.post("/verify", async (req, res) => {
  try {
    const { firstname, email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await Otp.findOneAndUpdate(
      { email },
      { otp, otpExpire: Date.now() + 5 * 60 * 1000 },
      { upsert: true, new: true }
    );

    await SendMail(firstname, email, otp);

    res.json({ message: "OTP sent successfully ✅" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send OTP" });
  }
});

// ===== Signup =====
router.post("/signup", async (req, res) => {
  try {
    const { firstname, lastname, username, email, password, otp } = req.body;

    if (!otp || otp.trim() === "")
      return res.status(400).json({ message: "OTP is required" });

    const otpRecord = await Otp.findOne({ email });
    if (!otpRecord) return res.status(400).json({ message: "OTP not found" });
    if (otpRecord.otp !== otp || Date.now() > otpRecord.otpExpire)
      return res.status(400).json({ message: "Invalid or expired OTP" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstname,
      lastname,
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    await Otp.deleteOne({ email });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(201).json({
      message: "User registered successfully ✅",
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Signup failed" });
  }
});

// ===== Login =====
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Wrong password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token, message: "Login successful ✅" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

// ===== Protected Route =====
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

export default router;
