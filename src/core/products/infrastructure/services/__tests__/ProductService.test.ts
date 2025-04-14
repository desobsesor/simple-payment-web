import { ProductService } from '../ProductService';
import api from '../../../../../shared/infrastructure/api';

jest.mock('../../../../../shared/infrastructure/api');
jest.mock('../../../../../config/app.config', () => ({
    __esModule: true,
    default: {
        getEnvVar: jest.fn((key) => {
            const testEnvVars: any = {
                VITE_API_URL: 'http://localhost:3000',
                VITE_API_TIMEOUT: '5000',
                VITE_ENV: 'test'
            };
            return testEnvVars[key];
        })
    }
}));

describe('ProductService', () => {
    let productService: ProductService;

    beforeEach(() => {
        productService = new ProductService();
        Object.defineProperty(window, 'localStorage', {
            value: {
                setItem: jest.fn(),
                getItem: jest.fn(),
                removeItem: jest.fn(),
                clear: jest.fn()
            },
            writable: true
        });
    });

    describe('login', () => {
        it('should store token and user in localStorage on successful login', async () => {
            const mockResponse = {
                data: {
                    access_token: 'mock_token',
                    user: { id: '1', username: 'yosuarezs' },
                },
                dataResponse: {
                    token: "mock_token",
                    user: '{"access_token":"mock_token","user":{"id":"1","username":"yosuarezs"}}'
                }
            };
            (api.post as jest.Mock).mockResolvedValue(mockResponse);

            const result = await productService.login();

            expect(localStorage.setItem).toHaveBeenCalledWith('token', 'mock_token');
            expect(localStorage.setItem).toHaveBeenCalledWith('user', mockResponse.dataResponse.user);
            expect(JSON.stringify(result.user)).toEqual(mockResponse.dataResponse.user);

        });

        it('should throw an error if login fails', async () => {
            (api.post as jest.Mock).mockRejectedValue(new Error('Failed to login'));

            await expect(productService.login()).rejects.toThrow('Failed to login');
        });
    });

    describe('getProducts', () => {
        it('should return products on successful API call', async () => {
            const mockProducts = [{ id: 1, name: 'Product 1' }, { id: 2, name: 'Product 2' }];
            (api.get as jest.Mock).mockResolvedValue({ data: mockProducts });

            const products = await productService.getProducts();

            expect(products).toEqual(mockProducts);
        });

        it('should throw an error if fetching products fails', async () => {
            (api.get as jest.Mock).mockRejectedValue(new Error('Failed to fetch products'));

            await expect(productService.getProducts()).rejects.toThrow('Failed to fetch products');
        });
    });

    describe('getUser', () => {
        it('should return null if token validation fails', async () => {
            (api.post as jest.Mock).mockResolvedValue({ data: null });

            const user = await productService['getUser']('invalid_token');

            expect(user).toBeNull();
        });
    });
});