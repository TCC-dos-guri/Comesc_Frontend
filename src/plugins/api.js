import axios from "axios";

const apiURL = 'http://localhost:8000/api'
//Allows the application to make requisition with the backend
const api = axios.create({
    baseURL: apiURL,
    headers: {
        "Content-Type": "application/json"
    }
})


//Add token automatically to every requisition if it needs a token to request

api.interceptors.request.use(
    (config) => {
        const tokenString = localStorage.getItem('userStorage'); // vem como string
        const token = JSON.parse(tokenString);
        if (token.access) {
            config.headers['Authorization'] = `Bearer ${token.access}`;
        }
        return config;
    },
    (error) => {

        return Promise.reject(error);
    }
);

//Return an response for any requisition made
api.interceptors.response.use(
    (response) => response,
    (error) => {

        return Promise.reject(error);
    }
);

export default api
