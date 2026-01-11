import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:5001/api"
      : "api",
  withCredentials: true, // Để cookie có thể gửi lên server
});

export default api;
