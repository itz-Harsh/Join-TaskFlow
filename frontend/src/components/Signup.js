import React, { useState } from "react";
import API from "../api"; // make sure API is axios instance or import axios

function Signup() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    otp: "",
  });
  const [message, setMessage] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendOtp = async () => {
    if (!form.email) {
      setMessage("Enter email first");
      return;
    }
    try {
      await API.post("/send-otp", {
        email: form.email,
        username: form.username,
      });
      setOtpSent(true);
      setMessage("OTP sent successfully ✅");
    } catch (err) {
      console.error(err);
      setMessage("Failed to send OTP ❌");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.otp) {
      setMessage("Please enter OTP");
      return;
    }

    try {
      const res = await API.post("/signup", form);
      setMessage(res.data.message);

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Error during signup");
    }
  };

  return (
    <div>
      <h1>Signup</h1>
      <form onSubmit={handleSubmit}>
        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        {otpSent && (
          <input
            type="text"
            name="otp"
            placeholder="Enter OTP"
            value={form.otp}
            onChange={handleChange}
            required
          />
        )}

        {!otpSent ? (
          <button type="button" onClick={sendOtp}>
            Send OTP
          </button>
        ) : (
          <button type="submit">Signup</button>
        )}
      </form>

      <p>{message}</p>
    </div>
  );
}

export default Signup;
