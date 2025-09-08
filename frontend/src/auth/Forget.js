import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import checkIcon from "../assets/check.png";
import uncheckIcon from "../assets/uncheck.png";
import API from "../api";
import Galaxy from "../components/Galaxy";

const Forget = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState(false);
  const [match, setMatch] = useState(false);
  const [message, setMessage] = useState("");
  const [step, setStep] = useState("email");
  const [form, setForm] = useState({
    email: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = async (e) => {
    const { name, value } = e.target;

    // live existence check only for email/username
    if (name === "email" || name === "username") {
      try {
        const payload =
          name === "email" ? { email: value } : { username: value };
        const res = await API.post("/exist", payload);
        if (name === "email") setEmail(Boolean(res.data.emailExists));
      } catch (err) {
        console.error("Exist check failed", err);
      }
    }

    // update form with new value first, then compute match against updated values
    const newForm = { ...form, [name]: value };
    setForm(newForm);

    if (newForm.password && newForm.confirmPassword && newForm.password === newForm.confirmPassword) {
      setMatch(true);
    } else {
      setMatch(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (step === "email") {
        if (!email) {
          console.log("Email is not exist");
          setMessage("Email is not exist");
          return;
        }
        await API.post("/verify", {
          email: form.email,
          Mode: false,
        });

        setStep("otp");
      } else if (step === "otp") {
        // verify otp with backend
        try {
          const res = await API.post("/check-otp", {
            email: form.email,
            otp: form.otp,
          });
          console.log(res.data.message);
          setStep("reset");
        } catch (err) {
          console.error(err);
          setMessage(err.response?.data?.message || "Invalid OTP");
          return;
        }
      } else if (step === "reset") {
        if (form.password !== form.confirmPassword) {
          setMessage("Passwords do not match!");
          return;
        }
        const res = await API.post("/forgot", {
          email: form.email,
          newPassword: form.confirmPassword,
        });
        setMessage(res.data.message);
        if (res.data.token) {
          localStorage.setItem("token", res.data.token);
          navigate("/");
          window.location.reload();
        } else {
          navigate("/login");
        }
      }
    } catch (err) {
      console.error(err);
      return;
    }
  };

  const handleNavigate = () => {
    navigate("/login");
  };
return (
  <div className="flex justify-center items-center overflow-clip w-full h-screen bg-black">
    <Galaxy />

    {/* Form Section */}
    <div className="absolute min-h-screen w-full flex items-center justify-center text-white px-4">
      <div className="w-full max-w-md flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-6">Forget Password</h1>

        <p className="mb-6 text-gray-400 text-sm">
          Remembered your password?{" "}
          <span
            className="text-red-400 hover:underline cursor-pointer"
            onClick={handleNavigate}
          >
            Login
          </span>
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          {/* Step 1: Email */}
          {step === "email" && (
            <>
              <input
                name="email"
                type="email"
                placeholder="Enter your email"
                value={form.email}
                autoComplete="off"
                onChange={handleChange}
                required
                className="w-full p-3 px-4 rounded-full border border-gray-700 bg-transparent text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-400"
              />
              {message && <p className="text-red-500 text-sm">{message}</p>}
              <button
                type="submit"
                className="mt-4 p-3 w-full rounded-full text-lg font-semibold text-black bg-gradient-to-bl from-red-200 to-red-400 hover:opacity-90 transition-opacity"
              >
                Send OTP
              </button>
            </>
          )}

          {/* Step 2: OTP */}
          {step === "otp" && (
            <>
              <input
                name="otp"
                type="text"
                placeholder="Enter OTP"
                value={form.otp}
                autoComplete="off"
                onChange={handleChange}
                required
                className="w-full p-3 px-4 rounded-full border border-gray-700 bg-transparent text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-400"
              />
              {message && <p className="text-red-500 text-sm">{message}</p>}
              <button
                type="submit"
                className="mt-4 p-3 w-full rounded-full text-lg font-semibold text-black bg-gradient-to-bl from-red-200 to-red-400 hover:opacity-90 transition-opacity"
              >
                Verify OTP
              </button>
            </>
          )}

          {/* Step 3: Reset Password */}
          {step === "reset" && (
            <>
              <div className="relative w-full">
                <input
                  name="password"
                  type="password"
                  placeholder="New Password"
                  value={form.password}
                  autoComplete="off"
                  onChange={handleChange}
                  required
                  className="w-full p-3 px-4 rounded-full border border-gray-700 bg-transparent text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-400"
                />
                {form.password.trim() !== "" && (
                  <img
                    src={match ? checkIcon : uncheckIcon}
                    alt={match ? "match" : "not match"}
                    className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2"
                  />
                )}
              </div>

              <div className="relative w-full">
                <input
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  value={form.confirmPassword}
                  autoComplete="off"
                  onChange={handleChange}
                  required
                  className="w-full p-3 px-4 rounded-full border border-gray-700 bg-transparent text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-400"
                />
                {form.confirmPassword.trim() !== "" && (
                  <img
                    src={match ? checkIcon : uncheckIcon}
                    alt={match ? "match" : "not match"}
                    className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2"
                  />
                )}
              </div>

              <button
                type="submit"
                className="mt-4 p-3 w-full rounded-full text-lg font-semibold text-black bg-gradient-to-bl from-red-200 to-red-400 hover:opacity-90 transition-opacity"
              >
                Reset Password
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  </div>
);

};

export default Forget;
