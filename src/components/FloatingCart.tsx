"use client";

import { useCart } from "@/context/CartContext";
import { ShoppingCart } from "lucide-react";

interface FloatingCartProps {
    onClick: () => void;
}

export default function FloatingCart({ onClick }: FloatingCartProps) {
    const { totalItems } = useCart();

    if (totalItems === 0) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce-subtle">
            <button
                onClick={onClick}
                className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg flex items-center justify-center relative transition-transform hover:scale-110"
            >
                <ShoppingCart size={28} />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900">
                    {totalItems}
                </span>
            </button>
        </div>
    );
}
