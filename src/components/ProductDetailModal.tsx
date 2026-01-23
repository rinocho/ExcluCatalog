"use client";

import { useState } from "react";
import { X, Maximize2 } from "lucide-react";
import { Product } from "@/context/ProductContext";
import ProductImage from "./ProductImage";
import { useCart } from "@/context/CartContext";
import ImageLightbox from "./ImageLightbox";

interface ProductDetailModalProps {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function ProductDetailModal({ product, isOpen, onClose }: ProductDetailModalProps) {
    const { addToCart } = useCart();
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    if (!isOpen || !product) return null;

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Overlay with backdrop blur */}
                <div
                    className="absolute inset-0 bg-black/60 backdrop-blur-[10px] transition-opacity animate-in fade-in duration-300"
                    onClick={onClose}
                />

                {/* Modal Content - Vertical Minimalist Design */}
                <div className="relative w-[80%] h-[80%] sm:w-full sm:max-w-md sm:h-[85vh] bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-300 overscroll-contain">

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-20 p-2 bg-white/50 dark:bg-black/50 backdrop-blur-md rounded-full hover:bg-white dark:hover:bg-black/70 transition-colors text-gray-800 dark:text-white shadow-sm"
                    >
                        <X size={24} />
                    </button>

                    {/* Top: Image (Square, Full Width) */}
                    <div
                        className="w-full aspect-square relative shrink-0 bg-gray-100 dark:bg-gray-700 cursor-zoom-in group"
                        onClick={() => setIsLightboxOpen(true)}
                    >
                        <ProductImage
                            code={product.code}
                            alt={product.name}
                            fill
                            imgClassName="object-cover transition-transform duration-500 group-hover:scale-105"
                            priority={true}
                        />

                        {/* Zoom Hint */}
                        <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <Maximize2 size={20} />
                        </div>
                    </div>

                    {/* Bottom: Info & Action (Scrollable) */}
                    <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center text-center">
                        <div className="flex flex-wrap justify-center gap-2 mb-4">
                            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-sm font-mono">
                                {product.code}
                            </span>
                            <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium">
                                {product.model}
                            </span>
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight mb-8">
                            {product.name}
                        </h2>

                        <div className="mt-auto w-full">
                            <button
                                onClick={() => {
                                    addToCart(product);
                                    onClose();
                                }}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all hover:scale-[1.02] shadow-lg text-2xl"
                            >
                                ${product.price.toFixed(2)}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lightbox */}
            <ImageLightbox
                code={product.code}
                alt={product.name}
                isOpen={isLightboxOpen}
                onClose={() => setIsLightboxOpen(false)}
            />
        </>
    );
}
