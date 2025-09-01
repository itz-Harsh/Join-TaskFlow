const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/auth");
const dotenv = require("dotenv");

dotenv.config();

const router = express.Router();



router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });



    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    console.log(token);
    res.status(201).json({
      message: "User Registered Successfully ✅",
      token, // ✅ send token so frontend can auto login
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
    await newUser.save();

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User Not Found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Wrong Password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token, message: "Login Successful ✅" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Protected Route (Only accessible with valid JWT)

router.get("/me", auth, async(req , res) => {
  try{
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err){
    res.status(500).json({error: err.message});
  }
});




module.exports = router;
