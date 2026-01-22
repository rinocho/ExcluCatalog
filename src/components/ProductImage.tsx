"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Camera } from "lucide-react";

interface ProductImageProps {
    code: string;
    alt: string;
    className?: string;
    fill?: boolean;
    width?: number;
    height?: number;
    priority?: boolean;
}

export default function ProductImage({ code, alt, className, fill, width, height, priority = false }: ProductImageProps) {
    const [src, setSrc] = useState<string>(`/product-image/${code}.webp`);
    const [error, setError] = useState(false);
    const [attempt, setAttempt] = useState(0); // 0: webp, 1: jpg, 2: png, 3: fallback

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Reset state when code changes
        setSrc(`/product-image/${code}.webp`);
        setError(false);
        setAttempt(0);
        setIsLoading(true);
    }, [code]);

    const handleError = () => {
        if (attempt === 0) {
            setSrc(`/product-image/${code}.jpg`);
            setAttempt(1);
        } else if (attempt === 1) {
            setSrc(`/product-image/${code}.png`);
            setAttempt(2);
        } else {
            setError(true);
            setIsLoading(false);
        }
    };

    if (error) {
        return (
            <div className={`flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 ${className}`} style={{ width: width || '100%', height: height || '100%' }}>
                <Camera size={32} />
            </div>
        );
    }

    return (
        <div className={`relative overflow-hidden ${className}`} style={{ width: width || '100%', height: height || '100%' }}>
            {isLoading && (
                <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse z-10" />
            )}
            <Image
                src={src}
                alt={alt}
                className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                fill={fill}
                width={!fill ? width : undefined}
                height={!fill ? height : undefined}
                onError={handleError}
                onLoad={() => setIsLoading(false)}
                loading={priority ? "eager" : "lazy"}
                priority={priority}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
        </div>
    );
}
