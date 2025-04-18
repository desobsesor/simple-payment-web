import api from '../../../../shared/infrastructure/api';
import { Product } from '../../domain/models/Product';

export interface IProductService {
    getProducts(): Promise<Product[]>;
}

export class ProductService implements IProductService {
    constructor() {
    }

    /**
     * Login user
     * @param email
     * @param password
     * @returns token
     * @description Login
     * @example
     * ```typescript
     * const token = await userService.login('email', 'password');
     * ```
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

    /**
     * Get products
     * @returns products
     * @description Get products
     * @example
     * ```typescript
     * const products = await productService.getProducts(); 
     * ```
     */
    async getProducts(): Promise<Product[]> {
        try {
            const response = await api.get('/v1/products');
            //console.log('resp: ', response);
            return response.data;
        } catch (error) {
            console.error('Error fetching products:', error);
            throw new Error('Failed to fetch products');
        }
    }

    /**
     * Get product
     * @param id
     * @returns product
     * @description Get product
     * @example
     * ```typescript
     * const product = await productService.getProductById(1);
     * 
     * ```
     */
    async getProductById(id: number): Promise<Product> {
        try {
            const response = await api.get(`/v1/products/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching product:', error);
            throw new Error('Failed to fetch product');
        }
    }

    /**
     * Get user
     * @param token
     * @returns user
     * @description Get user
     * @example
     * ```typescript
     * const user = await userService.getUser('token'); 
     * ```
     */
    private async getUser(token: string): Promise<any> {
        const responseValidateToken = await api.post('/v1/auth/validate-token', {
            token
        });
        if (responseValidateToken.data) {
            return responseValidateToken.data;
        }
        return null;
    }

}