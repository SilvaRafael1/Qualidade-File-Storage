import axios from "axios"

const client = axios.create({
    baseURL: `https://localhost/api`
    // baseURL: `https://100.0.1.50/api`
});

export default client;