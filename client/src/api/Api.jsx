import axios from "axios"

const client = axios.create({
    // baseURL: `http://localhost/api`
    baseURL: `https://documentos.tacchini.com.br/api`
});

export default client;