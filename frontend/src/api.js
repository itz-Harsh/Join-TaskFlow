import axios from "axios";

const API_URL = process.env.REACT_APP_B_URL;
// console.log("API URL:", API_URL);
const API = axios.create({
    // baseURL: "http://localhost:5000/api/auth",
    baseURL: API_URL,    
});

API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export default API;