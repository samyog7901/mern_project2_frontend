import axios from "axios"

const APIWITHTOKEN = axios.create({
  baseURL: "https://ecommerce-platform-2sjj.onrender.com/",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
    // "Authorization" : `${localStorage.getItem("token")}`,
  },
})
// Add interceptor to dynamically attach token
APIWITHTOKEN.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `${token}`
  }
  return config
});

export default APIWITHTOKEN