import axios from "axios";

const apiURL = 'http://localhost:8000/api'
//Allows the application to make requisition with the backend
const api = axios.create({
    baseURL: apiURL,
    headers: {
        "Content-Type": "application/json"
    }
})

api.interceptors.request.use(
    (config) => {
        const storage = localStorage.getItem('userStorage');

        if (storage) {
            const user = JSON.parse(storage);
            const token = user.access;

            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
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
