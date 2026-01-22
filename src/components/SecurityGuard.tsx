"use client";

import { useEffect, useState } from "react";

export default function SecurityGuard({ children }: { children: React.ReactNode }) {
    const [isObscured, setIsObscured] = useState(false);

    useEffect(() => {
        // 1. Disable Right Click
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
        };

        // 2. Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
        const handleKeyDown = (e: KeyboardEvent) => {
            if (
                e.key === "F12" ||
                (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J")) ||
                (e.ctrlKey && e.key === "U")
            ) {
                e.preventDefault();
            }

            // 3. Detect Screenshot Keys (PrintScreen, Meta+Shift+S, etc)
            if (e.key === "PrintScreen" || (e.metaKey && e.shiftKey && e.key === "4") || (e.metaKey && e.shiftKey && e.key === "S")) {
                setIsObscured(true);
                setTimeout(() => setIsObscured(false), 2000); // Blur for 2 seconds
            }
        };

        // 4. Blur on Window Blur (Focus Loss)
        const handleBlur = () => {
            setIsObscured(true);
        };

        const handleFocus = () => {
            setIsObscured(false);
        };

        // 5. Detect Visibility Change
        const handleVisibilityChange = () => {
            if (document.hidden) {
                setIsObscured(true);
            } else {
                setIsObscured(false);
            }
        };

        window.addEventListener("contextmenu", handleContextMenu);
        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("blur", handleBlur);
        window.addEventListener("focus", handleFocus);
        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            window.removeEventListener("contextmenu", handleContextMenu);
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("blur", handleBlur);
            window.removeEventListener("focus", handleFocus);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, []);

    return (
        <>
            {/* Content */}
            <div className={`transition-all duration-300 ${isObscured ? 'blur-[50px] opacity-10' : 'blur-0 opacity-100'}`}>
                {children}
            </div>

            {/* Black Overlay for extra security */}
            {isObscured && (
                <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center">
                    <div className="text-white text-xl font-mono animate-pulse">
                        Protección de Contenido Activa
                    </div>
                </div>
            )}
        </>
    );
}
