import React, {useState} from 'react';
import API from "./api";


const Login = () => {
    const [form , setForm] = useState({
        email: "",
        password: ""
    });
    const [message , setMessage] = useState("");

    const handleChange = (e) => {
        setForm({...form,[e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const res = await API.post('/login', form);
            localStorage.setItem("token", res.data.token);
            setMessage(res.data.message);
        } catch(err) {
            setMessage(err.response?.data?.message || "Error");
        }
    };
    
  return (
    <>
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <input name='email' placeholder='Email' onChange={handleChange}/>
                <input name='password' placeholder='Password' onChange={handleChange} />
                <button type="submit">Login</button>
            </form>
             <p>{message}</p>
        </div>
    </>
  )
}

export default Login