import React, { useState } from "react";
import API from "../api";

function Signup() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("http://localhost:5000/api/auth/signup", form); 
      console.log(res);
      setMessage(res.data.message);

      if(res.data.token){
        localStorage.setItem("token" , res.data.token);
        window.location.reload();
      }

    } catch (err) {
      setMessage(err.response?.data?.message || "Error during signup");
    }
  };

  return (
    <div>
      <h1>Signup</h1>
      <form onSubmit={handleSubmit}>
        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Signup</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default Signup;
