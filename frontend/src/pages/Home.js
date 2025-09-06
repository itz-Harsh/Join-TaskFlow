import React from "react";

import { useNavigate } from "react-router-dom";
const Home = () => {
  const navigate = useNavigate();

  const isAuthenticate = !!localStorage.getItem("token");
  const handleLogin = () => {
    navigate("/login");
  };
  const handleSignup = () => {
    navigate("/signup");
  };

  return (
    <>
      {isAuthenticate ? (
        <>
        
        </>
      ) : (
        <div className="w-full h-[100vh] flex flex-col justify-center items-center font-bold bg-[#131313] gap-5">
          <div className="w-fit text-center space-y-6 px-4">
            <h1 className="text-4xl font-bold mb-4 text-green-400 name">
              Join TaskFlow
            </h1>
            <p className="text-gray-400 mb-6">
              Stay on top of your tasks with our powerful To-Do List app. Easily
              add, prioritize, and track everything in one place — from daily
              reminders to long-term goals.
            </p>

          </div>
          <div className="flex lg:flex-row flex-col gap-5">
            <button
              onClick={handleSignup}
              className="  p-2 w-[9rem] text-2xl h-fit rounded-full bg-green-600 hover:bg-green-500 font-semibold transition"
            >
              Signup
            </button>

            <button
              onClick={handleLogin}
              className="p-2 w-[9rem] text-2xl h-fit rounded-full bg-green-600 hover:bg-green-500 font-semibold transition"
            >
              Login
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
