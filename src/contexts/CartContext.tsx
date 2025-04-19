import React, { createContext, ReactNode, useContext, useState } from 'react';
import { Product } from '../core/products/domain/models/Product';

interface CartItem {
    product: Product;
    quantity: number;
}

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (product: Product, quantity: number) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    getTotalItems: () => number;
    getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

/**
 * Provider for the shopping cart context.
 */
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    const addToCart = (product: Product, quantity: number) => {
        setCartItems(prevItems => {
            // Check if product already exists in cart
            const existingItemIndex = prevItems.findIndex(item => item.product.productId === product.productId);

            if (existingItemIndex >= 0) {
                // Update quantity if product already in cart
                const updatedItems = [...prevItems];
                const newQuantity = updatedItems[existingItemIndex].quantity + quantity;

                // Ensure quantity doesn't exceed stock
                updatedItems[existingItemIndex].quantity = Math.min(newQuantity, product.stock);
                return updatedItems;
            } else {
                // Add new item to cart
                return [...prevItems, { product, quantity: Math.min(quantity, product.stock) }];
            }
        });
    };

    const removeFromCart = (productId: string) => {
        setCartItems(prevItems => prevItems.filter(item => item.product.productId !== productId));
    };

    const updateQuantity = (productId: string, quantity: number) => {
        setCartItems(prevItems => {
            return prevItems.map(item => {
                if (item.product.productId === productId) {
                    // Ensure quantity doesn't exceed stock or go below 1
                    const newQuantity = Math.max(1, Math.min(quantity, item.product.stock));
                    return { ...item, quantity: newQuantity };
                }
                return item;
            });
        });
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const getTotalItems = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    const getTotalPrice = () => {
        return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    };

    const value = React.useMemo(
        () => ({
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            getTotalItems,
            getTotalPrice
        }),
        [cartItems]
    );

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

/**
 * Hook for accessing the cart context.
 */
const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export default useCart;