import React, { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

function Verify() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();
    const savedForm = JSON.parse(localStorage.getItem("pendingSignup"));

    if (!savedForm) {
      setMessage("No signup data found, please signup again.");
      navigate("/signup");
      return;
    }

    try {
      const res = await API.post("/signup", {
        ...savedForm,
        otp,
      });

      localStorage.removeItem("pendingSignup"); // clear temp data
      localStorage.setItem("token", res.data.token);

      setMessage("Signup successful 🎉");
      navigate("/profile"); // or wherever you want
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Invalid OTP ❌");
    }
  };

  return (
    <div className="w-[90vmin] h-[80vmin] p-4 flex flex-col bg-gray-500">
      <h1 className="text-4xl font-bold">Verify OTP</h1>
      <form onSubmit={handleVerify} className="flex flex-col gap-3">
        <input
          type="text"
          name="otp"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />
        <button type="submit">Verify</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default Verify;
