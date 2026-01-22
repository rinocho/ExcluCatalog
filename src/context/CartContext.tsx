"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Product {
    id: number;
    code: string;
    model: string;
    name: string;
    price: number;
    image: string;
    discount?: string;
}

export interface CartItem extends Product {
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (product: Product) => void;
    removeFromCart: (productId: number) => void;
    updateQuantity: (productId: number, newQuantity: number) => void;
    clearCart: () => void;
    totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);

    // Load cart from local storage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem("cart_items");
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart));
            } catch (e) {
                console.error("Failed to parse cart items", e);
            }
        }
    }, []);

    // Save cart to local storage whenever it changes
    useEffect(() => {
        localStorage.setItem("cart_items", JSON.stringify(items));
    }, [items]);

    const addToCart = (product: Product) => {
        setItems((prevItems) => {
            const existingItem = prevItems.find((item) => item.id === product.id);
            if (existingItem) {
                return prevItems.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prevItems, { ...product, quantity: 1 }];
        });
    };

    const updateQuantity = (productId: number, newQuantity: number) => {
        if (newQuantity < 1) return;
        setItems((prevItems) =>
            prevItems.map((item) =>
                item.id === productId ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    const removeFromCart = (productId: number) => {
        setItems((prevItems) => prevItems.filter((item) => item.id !== productId));
    };

    const clearCart = () => {
        setItems([]);
    };

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
