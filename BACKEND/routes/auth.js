import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import User from "../models/User.js";
import Otp from "../models/otp.js";
import auth from "../middleware/auth.js";

dotenv.config();
const router = express.Router();


// --- Passport GitHub Strategy ---
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.CALLBACKURL
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({
      $or: [
        { githubId: profile.id },
        { email: profile.emails?.[0]?.value }
      ]
    });
    // console.log(profile);
    if (!user) {
      user = await User.create({
        source: "github",
        githubId: profile.id,
        username: profile.username,
        firstname: profile.displayName ? profile.displayName.split(" ")[0] : username,
        lastname: profile.displayName ? profile.displayName.split(" ")[1] : " " ,
        email: profile.emails?.[0]?.value || null,
        password: "GITHUB_AUTH_NO_PASSWORD",
      });
    } else {
      if (!user.githubId) {
        user.githubId = profile.id;
        await user.save();
      }
    }
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
  User.findById(id).then(user => done(null, user));
});


// --- GitHub Login Routes ---
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

router.get("/github/callback",
  passport.authenticate("github", { failureRedirect: process.env.F_URL , session: false }),
  async (req, res) => {
    try {
      // Create JWT instead of session
      const token = jwt.sign(
        { id: req.user._id, email: req.user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      // Redirect with token (e.g., via query param)
      res.redirect(`${process.env.F_URL}/oauth-success?token=${token}`);
    } catch (err) {
      console.error("JWT creation failed:", err);
      res.redirect(`${process.env.F_URL}`);
    }
  }
);


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
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res
        .status(400)
        .json({ message: "Email and new password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();
    // remove used OTP to prevent reuse
    await Otp.deleteOne({ email });

    // create auth token so user is auto-logged-in after password reset
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      message: "Password updated successfully ✅",
      token,
      user: { id: user._id, email: user.email, username: user.username },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update Password" });
  }
});

// ===== Signup OTP Verification =====
router.post("/verify", async (req, res) => {
  // Mode: true => signup flow, false => forgot-password flow
  try {
    const rawMode = req.body.Mode;
    // Default to signup mode if Mode not provided. Accept boolean or string ('true'/'false').
    const Mode =
      rawMode === undefined ? true : rawMode === true || rawMode === "true";

    const email = req.body.email;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Upsert OTP record
    await Otp.findOneAndUpdate(
      { email },
      { otp, otpExpire: Date.now() + 5 * 60 * 1000 },
      { upsert: true, new: true }
    );

    if (Mode) {
      // Signup
      const firstname = req.body.firstname || "User";
      await SendMail(firstname, email, otp);
      return res.json({ message: "OTP sent for signup" });
    } else {
      // Forget password
      const user = await User.findOne({ email });
      const firstname = req.body.firstname || user?.firstname || "User";
      await SendMail(firstname, email, otp);
      return res.json({ message: "OTP sent for password reset" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to send OTP" });
  }
});

// ===== Check OTP (validate without performing any action) =====
router.post("/check-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp)
      return res.status(400).json({ message: "Email and OTP are required" });

    const otpRecord = await Otp.findOne({ email });
    if (!otpRecord) return res.status(400).json({ message: "OTP not found" });

    if (otpRecord.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });
    if (Date.now() > otpRecord.otpExpire)
      return res.status(400).json({ message: "OTP expired" });

    return res.json({ message: "OTP valid" });
  } catch (err) {
    console.error("Check OTP failed:", err);
    return res.status(500).json({ message: "Failed to verify OTP" });
  }
});

// ===== Signup =====
router.post("/signup", async (req, res) => {
  try {
    const { firstname, lastname, email, password, otp } = req.body;

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

    let baseUsername = firstname.toLowerCase() + lastname.toLowerCase();
    let Username = baseUsername;
    let isUnique = false;

    while (!isUnique) {
      const existingUser = await User.findOne({ username: Username });

      if (!existingUser) {
        isUnique = true; 
      } else {
        Username = baseUsername + Math.floor(Math.random() * 500);
      }
    }

    const newUser = new User({
      source: "email",
      firstname,
      lastname,
      username: Username,
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

    const user = await User.findOne({ email , source: "email" });
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

router.post("/exist", async (req, res) => {
  try {
    const { email } = req.body;

    const emailExists = email ? await User.exists({ email }) : false;

    return res.json({ emailExists: Boolean(emailExists) });
  } catch (e) {
    console.error("Error checking existence:", e);
    return res.status(500).json({ message: "Error checking existence" });
  }
});

router.post("/google-signin" , async (req ,res ) => {
  try {
    const { email , firstname ="" , lastname = "" } = req.body;
    let baseUsername = firstname.toLowerCase() + lastname.toLowerCase();
    let Username = baseUsername;
    let isUnique = false;

    while (!isUnique) {
      const existingUser = await User.findOne({ username: Username });

      if (!existingUser) {
        isUnique = true; 
      } else {
        Username = baseUsername + Math.floor(Math.random() * 500);
      }
    }
    let user = await User.findOne({ email });
    if (!user) {
      const newUser = new User({
        source: "google",
        firstname,
        lastname,
        username: Username,
        email,
        password: "GOOGLE_AUTH_NO_PASSWORD",
      });
      user = await newUser.save();
    }


    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.json({
      message: "Google sign-in successful",
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Google DB register fail" });
  }
}); 


export default router;
