import axios from "axios"

const API = axios.create({
    baseURL: "https://ecommerce-platform-2sjj.onrender.com/",
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"    
    }
})



export default API