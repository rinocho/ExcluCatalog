"use client";

import { useEffect } from "react";

export default function SecurityProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            // Prevent Print Screen (PrtScn) - Note: This is limited in browsers
            if (e.key === "PrintScreen") {
                document.body.style.display = "none";
                setTimeout(() => {
                    document.body.style.display = "block";
                }, 1000);
            }

            // Prevent Ctrl+P (Print)
            if (e.ctrlKey && e.key === "p") {
                e.preventDefault();
            }

            // Prevent Ctrl+S (Save)
            if (e.ctrlKey && e.key === "s") {
                e.preventDefault();
            }

            // Prevent Ctrl+U (View Source)
            if (e.ctrlKey && e.key === "u") {
                e.preventDefault();
            }
        };

        document.addEventListener("contextmenu", handleContextMenu);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("contextmenu", handleContextMenu);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return (
        <div className="select-none print:hidden">
            {children}
        </div>
    );
}
