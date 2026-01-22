"use client";

import { Filter, LogOut, Settings, LayoutGrid, Table, ClipboardList } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "@/context/AuthContext";

interface HeaderProps {
    onOpenFilter: () => void;
    onOpenAdmin: () => void;
    onOpenHistory: () => void;
    viewMode: 'grid' | 'table';
    onToggleViewMode: () => void;
}

export default function Header({ onOpenFilter, onOpenAdmin, onOpenHistory, viewMode, onToggleViewMode }: HeaderProps) {
    const { logout } = useAuth();

    return (
        <header className="sticky top-0 z-40 w-full backdrop-blur-lg bg-white/70 dark:bg-gray-900/70 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <button
                            onClick={onOpenFilter}
                            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-800 dark:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                            title="Filtros"
                        >
                            <Filter className="h-5 w-5" />
                        </button>
                        <button
                            onClick={onOpenHistory}
                            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-800 dark:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                            title="Mis Pedidos"
                        >
                            <ClipboardList className="h-5 w-5" />
                        </button>
                        <button
                            onClick={onOpenAdmin}
                            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-800 dark:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                            title="Administración"
                        >
                            <Settings className="h-5 w-5" />
                        </button>
                        <button
                            onClick={onToggleViewMode}
                            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-800 dark:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                            title={viewMode === 'grid' ? "Cambiar a Vista Tabla" : "Cambiar a Vista Cuadrícula"}
                        >
                            {viewMode === 'grid' ? <Table className="h-5 w-5" /> : <LayoutGrid className="h-5 w-5" />}
                        </button>
                    </div>
                    <button
                        onClick={logout}
                        className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                        title="Cerrar Sesión"
                    >
                        <LogOut className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </header>
    );
}
