import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import checkIcon from "../assets/check.png";
import uncheckIcon from "../assets/uncheck.png";
import API from "../api";

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
    <div className="flex overflow-clip w-full h-screen ">
      {/* Left Side - Forget Password Form */}
      <div className="lg:w-1/2 w-full flex flex-col justify-center items-center bg-[#131313] text-white">
        <div className="w-full max-w-md pt-10">
          <h1 className="text-4xl font-bold mb-7">Forget Password</h1>
          <p className="mb-6 text-gray-400">
            Remembered your password?{" "}
            <span
              className="text-green-400 hover:underline cursor-pointer"
              onClick={handleNavigate}
            >
              Login
            </span>
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
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
                  className="p-3 rounded-lg bg-[#1f1f1f] border border-gray-600 
                             focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <h1 className="text-red-500">{message}</h1>
                <button
                  type="submit"
                  className="mt-4 p-3 w-full rounded-full bg-green-600 
                             hover:bg-green-500 font-semibold transition"
                >
                  Send OTP
                </button>
              </>
            )}

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
                  className="p-3 rounded-lg bg-[#1f1f1f] border border-gray-600 
                             focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <h1 className="text-red-500">{message}</h1>
                <button
                  type="submit"
                  className="mt-4 p-3 w-full rounded-full bg-green-600 
                             hover:bg-green-500 font-semibold transition"
                >
                  Verify OTP
                </button>
              </>
            )}

            {step === "reset" && (
              <>
                <div className="w-full flex items-center gap-2">
                  <input
                    name="password"
                    type="password"
                    placeholder="New Password"
                    value={form.password}
                    autoComplete="off"
                    onChange={handleChange}
                    required
                    className="p-3 rounded-lg bg-[#1f1f1f] border border-gray-600 
                             focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  {form.password.trim() !== "" && (
                    <img
                      src={match ? checkIcon : uncheckIcon}
                      alt={match ? "match" : "Not Match"}
                      className="w-4 h-4 absolute ml-[420px] mb-[15px]  "
                    />
                  )}
                </div>

                <div className="w-full flex items-center gap-2">
                  <input
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm Password"
                    value={form.confirmPassword}
                    autoComplete="off"
                    onChange={handleChange}
                    required
                    className="p-3 rounded-lg bg-[#1f1f1f] border border-gray-600 
                             focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  {form.confirmPassword.trim() !== "" && (
                    <img
                      src={match ? checkIcon : uncheckIcon}
                      alt={match ? "match" : "Not Match"}
                      className="w-4 h-4 absolute ml-[420px] mb-[15px] "
                    />
                  )}
                </div>

                <button
                  type="submit"
                  className="mt-4 p-3 w-full rounded-full bg-green-600 
                             hover:bg-green-500 font-semibold transition"
                >
                  Reset Password
                </button>
              </>
            )}
          </form>
        </div>
      </div>

      {/* Right Side - Showcase / Info */}
      <div className="hidden w-1/2 lg:flex flex-col justify-center items-center bg-gradient-to-br from-[#0a0a0a] to-[#1f1f1f] text-white p-12">
        <div className="max-w-md text-center">
          <h1 className="text-4xl font-bold mb-4 text-green-400">
            Secure Reset
          </h1>
          <p className="text-gray-400 mb-6">
            Easily reset your password in three simple steps. Enter your email,
            verify with OTP, and set a new password to regain access safely.
          </p>
          <div className="bg-[#1f1f1f] p-6 rounded-lg shadow-xl border border-gray-800 hover:shadow-gray-800">
            <p className="text-gray-500 mt-2">
              We ensure your account stays safe while making the recovery
              process simple and fast.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forget;
