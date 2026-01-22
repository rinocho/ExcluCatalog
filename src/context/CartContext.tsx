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

export interface Order {
    id: string;
    date: string;
    total: number;
    items: CartItem[];
}

interface CartContextType {
    items: CartItem[];
    addToCart: (product: Product) => void;
    removeFromCart: (productId: number) => void;
    updateQuantity: (productId: number, newQuantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    orders: Order[];
    saveOrder: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);

    // Load cart and orders from local storage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem("cart_items");
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart));
            } catch (e) {
                console.error("Failed to parse cart items", e);
            }
        }

        const savedOrders = localStorage.getItem("order_history");
        if (savedOrders) {
            try {
                setOrders(JSON.parse(savedOrders));
            } catch (e) {
                console.error("Failed to parse order history", e);
            }
        }
    }, []);

    // Save cart to local storage whenever it changes
    useEffect(() => {
        localStorage.setItem("cart_items", JSON.stringify(items));
    }, [items]);

    // Save orders to local storage whenever it changes
    useEffect(() => {
        localStorage.setItem("order_history", JSON.stringify(orders));
    }, [orders]);

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

    const saveOrder = () => {
        if (items.length === 0) return;

        const newOrder: Order = {
            id: Date.now().toString(), // Simple ID based on timestamp
            date: new Date().toLocaleString(),
            total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
            items: [...items], // Copy items
        };

        setOrders((prevOrders) => [newOrder, ...prevOrders]); // Add new order to the beginning
    };

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, orders, saveOrder }}>
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
