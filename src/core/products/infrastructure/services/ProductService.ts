import { Product } from '../../domain/models/Product';
import api from '../../../../shared/infrastructure/api';
import { JwtService } from '../../../../shared/infrastructure/JwtService';

export interface IProductService {
    getProducts(): Promise<Product[]>;
}

export class ProductService implements IProductService {
    private jwtService: JwtService;

    constructor() {
        this.jwtService = new JwtService();
    }

    /**
     * Login
     * @param email
     * @param password
     * @returns token
     */
    async login(): Promise<any> {
        const payload = {
            username: "yosuarezs",
            password: "Maya",
            userId: "1",
            roles: ["customer"]
        };
        try {
            const response = await api.post(`/v1/auth/login`, payload);

            localStorage.setItem('token', response.data.access_token);
            const user = await this.getUser(response.data.access_token);
            localStorage.setItem('user', JSON.stringify(user));

            return { user, token: response.data.access_token };
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

    private async getUser(token: string): Promise<any> {
        return null;//this.jwtService.decode(token);
    }

}