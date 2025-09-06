import React, { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { doSignInWithGoogle  } from "../firebase/auth";
import { useAuth } from "../contexts/authContext";

const Login = () => {
  const [ check , setCheck ] = useState(false);
  const { currentUser } = useAuth();
  const [isSignedIn , setIsSignedIn ] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const onGoogleSignIn = async (e) => {
    e.preventDefault();
    if (!isSignedIn) {
      setIsSignedIn(true);
      try {
        await doSignInWithGoogle();
      } catch (err) {
        setIsSignedIn(false);
        console.log("Google sign in error");
      }
    }
  };

  const handleSubmit = async (e) => {
    
    e.preventDefault();
    try {
      const res = await API.post("/login", form );
      localStorage.setItem("token", res.data.token);
      setMessage(res.data.message);

      navigate("/");
      window.location.reload();

    } catch (err) {
      setMessage(err.response?.data?.message || "Error during login");
    }
  };
  const handleNavigate = () => {
    navigate("/signup");
  };
  const handleforget = () => {
    navigate("/forget");
  };

const checkBox = () => {
  setCheck(document.querySelector(".checkbox").checked)
}

return (
    <div className=" flex overflow-clip w-full h-screen  ">
      {/* Left Side - Signup Form */}
      <div className="lg:w-1/2 w-full flex flex-col justify-center items-center bg-[#131313] text-white ">
        {/* Form Section */}
        <div className="w-full max-w-md pt-10">
          <h1 className="text-4xl font-bold mb-7 ">Login</h1>
          <p className="mb-6 text-gray-400">
            Don't have an account?{" "}
            <span
              className="text-green-400 hover:underline cursor-pointer"
              onClick={handleNavigate}
            >
              Sign up
            </span>
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="p-3 rounded-lg bg-[#1f1f1f] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="p-3 rounded-lg bg-[#1f1f1f] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <div className="flex justify-between px-1">
              <span className=" text-sm text-gray-400 w-[13rem] flex gap-2">
                <input type="checkbox" className="w-fit accent-green-500 mt-[-.7rem] outline-none cursor-pointer checkbox" onChange={checkBox}  />
                <p className="">Remember me</p>
              </span>

          
                <p className="text-red-500 text-sm mb-2">{message}</p>
              
              <p
                className="mb-6 text-end text-gray-400 hover:underline decoration-green-500 cursor-pointer "
                onClick={handleforget}
              >
                Forget Password?{" "}
              </p>
            </div>

            <button
              type="submit"
              className="mt-4 p-3 w-full rounded-full bg-green-600 hover:bg-green-500 font-semibold transition"
            >
              Login
            </button>
            <button
            className="mt-4 p-3 w-full rounded-full bg-green-600 hover:bg-green-500 font-semibold transition"

         onClick={(e) => {onGoogleSignIn(e)} }>
          Google
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
};

export default Login;
