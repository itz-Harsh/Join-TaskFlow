import React, {  useState } from "react";

import { useNavigate } from "react-router-dom";
import Galaxy from "../components/Galaxy";
import {

  doSignInWithGoogle,
  // SignInWithGoogle,

} from "../firebase/auth";
// import { getRedirectResult } from "firebase/auth";
// import { auth } from "../firebase/firebase";

const Home = () => {
  const navigate = useNavigate();
  const [isSignedIn, setIsSignedIn] = useState(false);

  const isAuthenticate = !!localStorage.getItem("token");
  const handleLogin = () => {
    navigate("/login");
  };
  const handleSignup = () => {
    navigate("/signup");
  };

const onGoogleSignIn = async (e) => {
    e.preventDefault();
    if (!isSignedIn) {
      setIsSignedIn(true);
      try {
        await doSignInWithGoogle();
        window.location.reload();
      } catch (err) {
        setIsSignedIn(false);
        console.log("Google sign in error");
      }
    }
  };


  return (
    <>
      {isAuthenticate ? (
        <>
          <div className="w-full h-[100vh] flex flex-col justify-center items-center font-bold bg-black gap-5">
            <Galaxy />
            <h1 className="absolute">Welcome</h1>
          </div>
        </>
      ) : (
        <div className="w-full h-[100vh] flex flex-col justify-center items-center font-bold bg-black">
          <Galaxy />
          <div className="flex  flex-col gap-3 bg-transparent absolute z-2 ">
            <div className="flex gap-2 ">
              <button
                onClick={handleSignup}
                className="  p-2 w-[9rem] text-[15px] h-fit rounded-full bg-white hover:bg-[#e7e7e7] active:scale-95 text-black  font-semibold transition"
              >
                Signup
              </button>

              <button
                onClick={handleLogin}
                className="p-2 w-[9rem] text-black text-[15px] h-fit rounded-full bg-white hover:bg-[#e7e7e7] active:scale-95 font-semibold transition"
              >
                Login
              </button>
            </div>
            <button
              className="gap-3 flex justify-center items-center p-2 w-full h-10 text-black text-[15px]  rounded-full bg-white hover:bg-[#e7e7e7] active:scale-95  transition"
              onClick={(e) => {
                onGoogleSignIn(e);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                className=""
                viewBox="0 0 261 261"
                preserveAspectRatio="xMidYMid meet"
              >
                <path
                  d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                  fill="#4285F4"
                />
                <path
                  d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                  fill="#34A853"
                />
                <path
                  d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
                  fill="#FBBC05"
                />
                <path
                  d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                  fill="#EB4335"
                />
              </svg>
              <p className="w-fit font-semibold ">Continue with Google</p>
            </button>
            <button
              onClick={() =>
                (window.location.href = `https://to-do-list-1d7v.onrender.com/auth/github`)
              }
              className="w-full p-2 flex items-center justify-center h-10 text-black text-[15px]  rounded-full bg-white hover:bg-[#e7e7e7] active:scale-95"
            >
              <img
                src="https://assets.streamlinehq.com/image/private/w_300,h_300,ar_1/f_auto/v1/icons/vector-icons/github-fill-qf4esp67hgil1yb2t4kbh.png/github-fill-vuouq0ozezpemvb5gwnatr.png?_a=DATAg1AAZAA0"
                alt=""
                className="w-6 h-6 mr-2"
              />
              <p className="w-fit font-semibold ">Continue with GitHub</p>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
