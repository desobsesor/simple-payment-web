const getEnvVar = (key: string, defaultValue: string = '') => {
    try {
        if (import.meta?.env?.[key]) {
            return import.meta.env[key] || defaultValue;
        }
        return defaultValue;
    } catch (e) {
        const testEnvVars: any = {
            VITE_API_URL: 'http://localhost:3000',
            VITE_API_TIMEOUT: '5000',
            VITE_ENV: 'test'
        };
        return testEnvVars[key] || defaultValue;
    }
};

const config = {
    API_URL: getEnvVar('VITE_API_URL', 'http://localhost:3000') || 'http://localhost:3000',
    API_TIMEOUT: parseInt(getEnvVar('VITE_API_TIMEOUT', '5000')),
    ENV: getEnvVar('VITE_ENV', 'development')
};

export default config;