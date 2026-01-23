"use client";

import { useState, useRef, useEffect } from "react";
import { User, Settings, Moon, Sun, LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import { useAuth } from "@/context/AuthContext";

interface UserMenuProps {
    onOpenAdmin: () => void;
}

export default function UserMenu({ onOpenAdmin }: UserMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { theme, setTheme } = useTheme();
    const { logout } = useAuth();
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-800 dark:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                title="Menú de Usuario"
            >
                <User className="h-5 w-5" />
            </button>

            {isOpen && (
                <div className="absolute left-0 mt-2 w-56 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-left">

                    <button
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-3 transition-colors"
                    >
                        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                        <span>{theme === "dark" ? "Modo Claro" : "Modo Oscuro"}</span>
                    </button>

                    <button
                        onClick={() => {
                            onOpenAdmin();
                            setIsOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-3 transition-colors"
                    >
                        <Settings size={18} />
                        <span>Administración</span>
                    </button>

                    <div className="my-2 border-t border-gray-200 dark:border-gray-700"></div>

                    <button
                        onClick={logout}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3 transition-colors"
                    >
                        <LogOut size={18} />
                        <span>Cerrar Sesión</span>
                    </button>
                </div>
            )}
        </div>
    );
}
