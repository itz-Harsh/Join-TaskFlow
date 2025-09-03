import React, { useState } from "react";
import API from "../api";
import {  useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      // Call backend to send OTP
      await API.post("/verify", {
        firstname: form.firstname,
        email: form.email,
      });

      // Save user details temporarily (so verify page can access them)
      localStorage.setItem("pendingSignup", JSON.stringify(form));

      setMessage("OTP sent successfully ✅");
      navigate("/verify"); // go to verification page
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Error during signup");
    }
  };
  const handleNavigate = () => {
    navigate("/login");
  }


return (
  <div className=" flex overflow-clip w-full h-screen  lg:p-0 p-2">
    {/* Left Side - Signup Form */}
    <div className="lg:w-1/2 w-full flex flex-col justify-center items-center bg-[#131313] text-white ">

      {/* Form Section */}
      <div className="w-full max-w-md pt-10">
        <h2 className="text-3xl font-bold mb-2">Create Account</h2>
        <p className="mb-6 text-gray-400">
          Already have an account?{" "}
          <span
            className="text-green-400 hover:underline cursor-pointer"
            onClick={handleNavigate}
          >
            Sign in
          </span>
        </p>

        <form onSubmit={handleSignup} className="flex flex-col gap-2 items-center w-[95vmin] lg:w-auto">
          <input
            name="firstname"
            placeholder="First Name"
            value={form.firstname}
            onChange={handleChange}
            required
            className="p-3 rounded-md bg-[#1f1f1f] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            name="lastname"
            placeholder="Last Name"
            value={form.lastname}
            onChange={handleChange}
            required
            className="p-3 rounded-md bg-[#1f1f1f] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
            className="p-3 rounded-md bg-[#1f1f1f] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="p-3 rounded-md bg-[#1f1f1f] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="p-3 rounded-md bg-[#1f1f1f] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <button
            type="submit"
            className="mt-4 p-3 w-full rounded-full bg-green-600 hover:bg-green-500 font-semibold transition"
          >
            Sign Up
          </button>
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
          Stay on top of your tasks with our powerful To-Do List app. Easily add, prioritize, and track everything in one place — from daily reminders to long-term goals.
        </p>
        <div className="bg-[#1f1f1f] p-6 rounded-lg shadow-xl border border-gray-800  hover:shadow-gray-800 ">
          <p className="text-gray-500 mt-2 ">With a clean interface and smart features, managing your time has never been this simple. Focus on what truly matters while we handle the rest</p>
        </div>
      </div>
    </div>
  </div>
);

}

export default Signup;
