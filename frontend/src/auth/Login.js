import React, {  useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import Galaxy from "../components/Galaxy";

const Login = () => {
  const [check , setCheck ] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
  if(check){
    setCheck(false);
    return;
  }
  setCheck(true);
}

return (
    <div className=" flex justify-center items-center overflow-clip w-full h-screen bg-black  ">
      <Galaxy />

        {/* Form Section */}
      <div className="min-h-screen w-full flex items-center justify-center  text-white px-4 absolute">
  <div className="w-full max-w-md flex flex-col items-center">
    <h1 className="text-4xl font-bold mb-6">Login</h1>

    <p className="mb-8 text-gray-400 text-sm">
      Don't have an account?{" "}
      <span
        className="text-red-400 hover:underline cursor-pointer"
        onClick={handleNavigate}
      >
        Sign up
      </span>
    </p>

    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-col gap-4 items-center"
    >
      <input
        name="email"
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        required
        className="w-full p-3 px-4 rounded-full border border-gray-700 bg-transparent text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-400"
      />

      <input
        name="password"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        required
        className="w-full p-3 px-4 rounded-full border border-gray-700 bg-transparent text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-400"
      />

      <div className="flex justify-between items-center w-full text-sm text-gray-400 px-2 mt-1">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="accent-red-400 w-4 h-4 cursor-pointer mb-0 .checkbox "
            onChange={checkBox}
          />
          Remember me
        </label>

        <p
          className="hover:underline decoration-red-500 cursor-pointer"
          onClick={handleforget}
        >
          Forgot Password?
        </p>
      </div>

      {message && (
        <p className="text-red-500 text-sm w-full text-center mt-2">{message}</p>
      )}

      <button
        type="submit"
        className="mt-6 p-3 w-1/2 rounded-full text-lg font-semibold text-black bg-gradient-to-bl from-red-200 to-red-400 hover:opacity-90 transition-opacity"
      >
        Login
      </button>
    </form>
  </div>
</div>


    
    </div>
  );
};

export default Login;
