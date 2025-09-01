import axios from "axios";

const API = axios.create({
    baseURl: "http://localhost:5000/api/auth",
    // Backend URl
    
});

API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");
    if(token){
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export default API;