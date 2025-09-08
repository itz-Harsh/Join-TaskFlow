import React, { useState } from "react";
import API from "../api";
import {  useNavigate } from "react-router-dom";
import checkIcon from "../assets/check.png";
import uncheckIcon from "../assets/uncheck.png";
import Galaxy from "../components/Galaxy";


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
  <div className="flex justify-center items-center overflow-clip w-full h-screen ">
    <Galaxy />

    {/* Form Section */}
    <div className="absolute min-h-screen w-full flex items-center justify-center text-white px-4">
      <div className="w-full max-w-md flex flex-col items-center">
        <h2 className="text-3xl font-bold mb-2">Create an account</h2>
        <p className="mb-6 text-gray-400">
          Already have an account?{" "}
          <span
            className="text-red-400 hover:underline cursor-pointer"
            onClick={handleNavigate}
          >
            Sign in
          </span>
        </p>

        <form
          onSubmit={handleSignup}
          className="flex flex-col gap-4 items-center w-full"
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
                className="w-full p-3 px-4 rounded-full border border-gray-700 bg-transparent text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-400"
              />

              <input
                name="lastname"
                placeholder="Last Name"
                value={form.lastname}
                onChange={handleChange}
                required
                autoComplete="off"
                className="w-full p-3 px-4 rounded-full border border-gray-700 bg-transparent text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-400"
              />

              <div className="w-full relative">
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  autoComplete="off"
                  className="w-full p-3 px-4 rounded-full border border-gray-700 bg-transparent text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-400"
                />
                {form.email.trim() !== "" && (
                  <img
                    src={!email ? checkIcon : uncheckIcon}
                    alt={!email ? "available" : "taken"}
                    className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2"
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
                className="w-full p-3 px-4 rounded-full border border-gray-700 bg-transparent text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-400"
              />

              <button
                type="submit"
                className="mt-4 p-3 w-[20rem] rounded-full text-lg font-semibold text-black bg-gradient-to-bl from-red-200 to-red-400 hover:opacity-90 transition-opacity"
              >
                Sign Up
              </button>
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
                className="w-full p-3 px-4 rounded-full border border-gray-700 bg-transparent text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-400"
              />

              <h1 className="text-red-500">{message}</h1>

              <button
                type="submit"
                className="mt-4 p-3 w-full rounded-full text-lg font-semibold text-black bg-gradient-to-bl from-red-200 to-red-400 hover:opacity-90 transition-opacity"
              >
                Verify OTP
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  </div>
);
}
export default Signup;
