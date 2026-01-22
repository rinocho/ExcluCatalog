"use client";

import { Product, useCart } from "@/context/CartContext";
import { ShoppingCart } from "lucide-react";

import ProductImage from "./ProductImage";

interface ProductCardProps {
    product: Product;
    priority?: boolean;
    onClick?: () => void;
}

export default function ProductCard({ product, priority = false, onClick }: ProductCardProps) {
    const { addToCart } = useCart();

    return (
        <div
            onClick={onClick}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl active:scale-98 transition-all duration-200 flex flex-col cursor-pointer group snap-start"
        >
            <div className="relative aspect-square w-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                <ProductImage
                    code={product.code}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    priority={priority}
                />
            </div>
            <div className="p-4 flex-grow flex flex-col justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{product.name}</h3>
                    <div className="flex flex-col mb-4">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="text-xs text-gray-500 dark:text-gray-400 font-mono bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                                {product.code}
                            </span>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                            {product.model}
                        </span>
                    </div>
                </div>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center gap-2 transition-colors z-10 relative"
                >
                    <ShoppingCart size={20} />
                    ${product.price.toFixed(2)}
                </button>
            </div>
        </div>
    );
}
