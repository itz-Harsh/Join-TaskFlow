import axios from "axios";
// import dotenv from "dotenv";

// dotenv.config();
const API_URL = "https://to-do-list-1d7v.onrender.com/api/auth";
const API = axios.create({
    // baseURL: "http://localhost:5000/api/auth",
    baseURL: API_URL,
    // Backend URL (base for auth endpoints)
    
});

API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export default API;