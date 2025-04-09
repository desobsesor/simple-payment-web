import { Product } from '../../domain/models/Product';
import api from '../../../../shared/infrastructure/api';

export interface IProductService {
    getProducts(): Promise<Product[]>;
}

export class ProductService implements IProductService {
    constructor() {
    }

    /**
     * Login
     * @param email
     * @param password
     * @returns token
     */
    async login(): Promise<string> {
        const payload = {
            username: "yosuarezs",
            password: "Maya",
            userId: "1",
            roles: ["customer"]
        };
        try {
            const response = await api.post(`/v1/auth/login`, payload);

            //Enter the token in the localstorage
            localStorage.setItem('token', response.data.access_token);
            return response.data.access_token;
        } catch (error) {
            console.error('Login error:', error);
            throw new Error('Failed to login');
        }
    }

    async getProducts(): Promise<Product[]> {
        try {
            const response = await api.get('/v1/products');
            console.log('resp: ', response);
            return response.data;
        } catch (error) {
            console.error('Error fetching products:', error);
            throw new Error('Failed to fetch products');
        }
    }
}