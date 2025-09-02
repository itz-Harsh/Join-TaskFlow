import axios from "axios";

const API = axios.create({
    // baseURL: "http://localhost:5000/api/auth"
    baseURL: "https://to-do-list-1d7v.onrender.com/api/auth",
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