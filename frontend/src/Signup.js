import React , { useState } from "react";
import API from "./api";

function Signup(){
    const [form , setFrom] = useState({
        username: "",
        email: "",
        password: ""
    });
    const [message , setMessage] = useState("");


    const handleChange = (e) => {
        setFrom({...form, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const res = await API.post("/signup", form);
            setMessage(res.data.message);
        } catch(err){
            setMessage(err.response?.data?.message || "Error");
        }
    };

    return(
        <>
            <div>
                <h1>Signup</h1>
                <form onSubmit={handleSubmit}>
                    <input name="username" placeholder="Username" onChange={handleChange}/>
                    <input name="email" placeholder="Email" onChange={handleChange}/>
                    <input name="password" placeholder="Password" onChange={handleChange}/>
                    <button type="submit" >Signup</button>
                </form>
                <p>{message}</p>
            </div>
        </>
    );
}


export default Signup;