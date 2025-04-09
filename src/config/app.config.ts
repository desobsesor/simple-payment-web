const config = {
    API_URL: import.meta.env.VITE_API_URL,
    API_TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT || '5000'),
    ENV: import.meta.env.VITE_ENV || 'development'
};

export default config;