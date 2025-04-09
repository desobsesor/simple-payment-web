interface ImportMetaEnv {
    readonly VITE_API_URL: string;
    readonly VITE_API_TIMEOUT: string;
    readonly VITE_ENV: 'development' | 'production' | 'staging';
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}