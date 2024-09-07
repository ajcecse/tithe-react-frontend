import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://tithe-backend.onrender.com", // Your backend URL
  withCredentials: true, // Include cookies in requests
});

export default axiosInstance;
