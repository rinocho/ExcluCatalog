"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { PRODUCTS as INITIAL_PRODUCTS } from "@/lib/data";

export interface Product {
    id: number;
    code: string;
    model: string;
    name: string;
    price: number;
    image: string;
}

interface ProductContextType {
    products: Product[];
    updateProducts: (newProducts: Product[]) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
    const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load products from local storage on mount
    useEffect(() => {
        const savedProducts = localStorage.getItem("catalog_products");
        if (savedProducts) {
            try {
                const parsed = JSON.parse(savedProducts);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setProducts(parsed);
                }
            } catch (e) {
                console.error("Failed to parse products from storage", e);
            }
        }
        setIsLoaded(true);
    }, []);

    // Save products to local storage whenever they change
    useEffect(() => {
        if (isLoaded && products.length > 0) {
            localStorage.setItem("catalog_products", JSON.stringify(products));
        }
    }, [products, isLoaded]);

    const updateProducts = (newProducts: Product[]) => {
        setProducts(newProducts);
        localStorage.setItem("catalog_products", JSON.stringify(newProducts));
    };

    return (
        <ProductContext.Provider value={{ products, updateProducts }}>
            {children}
        </ProductContext.Provider>
    );
}

export function useProducts() {
    const context = useContext(ProductContext);
    if (context === undefined) {
        throw new Error("useProducts must be used within a ProductProvider");
    }
    return context;
}
