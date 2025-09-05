import mongoose from "mongoose";

const OtpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  otpExpire: { type: Date, required: true },
});

export default mongoose.model("Otp", OtpSchema);
