"use client";

import { useState, useEffect } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { X, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import ProductImage from "./ProductImage";

interface ImageLightboxProps {
    code: string;
    alt: string;
    isOpen: boolean;
    onClose: () => void;
}

export default function ImageLightbox({ code, alt, isOpen, onClose }: ImageLightboxProps) {
    const [isMounted, setIsMounted] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsMounted(true);
            // Small timeout to ensure DOM is ready before starting animation
            requestAnimationFrame(() => {
                setIsVisible(true);
            });
        } else {
            setIsVisible(false);
            const timer = setTimeout(() => {
                setIsMounted(false);
            }, 300); // Match duration-300
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isMounted) return null;

    return (
        <div
            className={`fixed inset-0 z-[60] flex items-center justify-center bg-black/95 backdrop-blur-md transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"
                }`}
        >
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 z-50 p-3 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors"
            >
                <X size={24} />
            </button>

            <TransformWrapper
                initialScale={1}
                minScale={1}
                maxScale={4}
                centerOnInit
                doubleClick={{ disabled: true }}
            >
                {({ zoomIn, zoomOut, resetTransform }) => (
                    <>
                        {/* Controls */}
                        <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-black/50 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 transition-transform duration-300 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                            }`}>
                            <button onClick={() => zoomOut()} className="text-white hover:text-blue-400 transition-colors">
                                <ZoomOut size={24} />
                            </button>
                            <button onClick={() => resetTransform()} className="text-white hover:text-blue-400 transition-colors">
                                <RotateCcw size={20} />
                            </button>
                            <button onClick={() => zoomIn()} className="text-white hover:text-blue-400 transition-colors">
                                <ZoomIn size={24} />
                            </button>
                        </div>

                        {/* Image */}
                        <TransformComponent
                            wrapperClass="w-full h-full flex items-center justify-center"
                            contentClass="w-full h-full flex items-center justify-center !w-full !h-full"
                            wrapperStyle={{ width: "100%", height: "100%" }}
                            contentStyle={{ width: "100%", height: "100%" }}
                        >
                            <div
                                className={`relative w-[90vw] h-[80vh] cursor-zoom-out transition-transform duration-300 ${isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
                                    }`}
                                onDoubleClick={onClose}
                            >
                                <ProductImage
                                    code={code}
                                    alt={alt}
                                    fill
                                    className="w-full h-full"
                                    imgClassName="object-contain"
                                    priority={true}
                                />
                            </div>
                        </TransformComponent>
                    </>
                )}
            </TransformWrapper>
        </div>
    );
}
