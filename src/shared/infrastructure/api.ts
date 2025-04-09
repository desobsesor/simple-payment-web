import axios from 'axios';
import config from '../../config/app.config';
import { useAuth } from '../../contexts/AuthContext';

const api = axios.create({
    baseURL: config.API_URL,
    timeout: config.API_TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

// Interceptor for JWT

/*
api.interceptors.request.use((cfg) => {
    const token = localStorage.getItem('token');
    console.log('token: ', token);
    if (token) {
        cfg.headers.Authorization = `Bearer ${token}`;
    }
    return cfg;
});
*/

// Interceptor for unauthorized responses
/*
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            const { logout } = useAuth();
            logout();
        }
        return Promise.reject(error);
    }
);
*/

export default api;