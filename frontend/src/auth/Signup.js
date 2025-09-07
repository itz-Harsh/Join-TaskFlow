import React, { useState } from "react";
import API from "../api";
import {  useNavigate } from "react-router-dom";
import checkIcon from "../assets/check.png";
import uncheckIcon from "../assets/uncheck.png";


function Signup() {
  const navigate = useNavigate();

  const [email, setEmail] = useState(false);

  const [step, setStep] = useState("email");

  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    otp: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = async (e) => {
    const { name, value } = e.target;

    // live existence check only for email/username
    if (name === "email" || name === "username") {
      if (!value.trim()) {
        if (name === "email") setEmail(false);
      } else {
        try {
          const payload = { email: value };
          const res = await API.post("/exist", payload);
          if (name === "email") setEmail(Boolean(res.data.emailExists));
        } catch (err) {
          console.error("Exist check failed", err);
        }
      }
    }

    setForm({ ...form, [name]: value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      if (step === "email") {
        try {
          await API.post("/verify", {
            Mode: true, // signup mode
            firstname: form.firstname,
            email: form.email,
          });
          setStep("signup");
        } catch (err) {
          console.log("otp sent fail");
        }
      } else if (step === "signup") {
        try {
          const res = await API.post("/signup", {
            firstname: form.firstname,
            lastname: form.lastname,
            email: form.email,
            password: form.password,
            otp: form.otp,
          });

          if (res.data.token) {
            localStorage.setItem("token", res.data.token);
            API.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${res.data.token}`;
            navigate("/");
            window.location.reload();
          }
        } catch (err) {
          console.log(err);
          setMessage(err.response?.data?.message || "Signup failed");
        }
      }
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Error during signup");
    }
  };


  const handleNavigate = () => {
    navigate("/login");
  };

  return (
    <div className=" flex w-full lg:h-screen h-fit ">
      <div className="lg:w-1/2 w-full flex flex-col justify-center items-center bg-[#131313] text-white ">
        {/* Form Section */}
        <div className="w-full max-w-md pt-10">
          <h2 className="text-3xl font-bold mb-2">Create an account</h2>
          <p className="mb-6 text-gray-400">
            Already have an account?{" "}
            <span
              className="text-green-400 hover:underline cursor-pointer"
              onClick={handleNavigate}
            >
              Sign in
            </span>
          </p>

          <form
            onSubmit={handleSignup}
            className="flex flex-col gap-2 items-center w-[95vmin] lg:w-auto"
          >
            {step === "email" && (
              <>
                <input
                  name="firstname"
                  placeholder="First Name"
                  value={form.firstname}
                  onChange={handleChange}
                  required
                  autoComplete="off"
                  className="p-3 rounded-md bg-[#1f1f1f] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                  name="lastname"
                  placeholder="Last Name"
                  value={form.lastname}
                  onChange={handleChange}
                  required
                  autoComplete="off"
                  className="p-3 rounded-md bg-[#1f1f1f] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />

                <div className="w-full flex items-center gap-2">
                  <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    autoComplete="off"
                    className="flex-1 p-3 rounded-md bg-[#1f1f1f] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  {form.email.trim() !== "" && (
                    <img
                      src={!email ? checkIcon : uncheckIcon}
                      alt={!email ? "available" : "taken"}
                      className="w-4 h-4 absolute  ml-[420px] mb-[15px] "
                    />
                  )}
                </div>
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  autoComplete="off"
                  className="p-3 rounded-md bg-[#1f1f1f] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />

                <button
                  type="submit"
                  className="mt-4 p-3 w-full rounded-full bg-green-600 hover:bg-green-500 font-semibold transition"
                >
                  Sign Up
                </button>
                <button
                  className="mt-4 p-3 w-full rounded-full bg-green-600 hover:bg-green-500 font-semibold transition"
                  
                >
                  Google
                </button>
                {message && (
                  <p className="mt-2 text-sm text-red-400">{message}</p>
                )}
              </>
            )}
            {step === "signup" && (
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
          </form>
        </div>
      </div>

      {/* Right Side - Showcase / Info */}
      <div className="hidden  w-1/2 lg:flex flex-col justify-center items-center bg-gradient-to-br from-[#0a0a0a] to-[#1f1f1f] text-white p-12">
        <div className="max-w-md text-center">
          <h1 className="text-4xl font-bold mb-4 text-green-400 name">
            Join TaskFlow
          </h1>
          <p className="text-gray-400 mb-6">
            Stay on top of your tasks with our powerful To-Do List app. Easily
            add, prioritize, and track everything in one place — from daily
            reminders to long-term goals.
          </p>
          <div className="bg-[#1f1f1f] p-6 rounded-lg shadow-xl border border-gray-800  hover:shadow-gray-800 ">
            <p className="text-gray-500 mt-2 ">
              With a clean interface and smart features, managing your time has
              never been this simple. Focus on what truly matters while we
              handle the rest
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
