"use client";

import { X, Search } from "lucide-react";
import { useState, useMemo } from "react";

interface FilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    categories: string[];
    models: string[];
    selectedFilter: { type: 'category' | 'model'; value: string | null };
    onSelectFilter: (type: 'category' | 'model', value: string | null) => void;
}

export default function FilterModal({
    isOpen,
    onClose,
    categories,
    models,
    selectedFilter,
    onSelectFilter,
}: FilterModalProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState<'category' | 'model'>('category');

    // Determine which items to show based on internal filterType
    const items = filterType === 'category' ? categories : models;

    const filteredItems = useMemo(() => {
        if (!searchTerm) return items;
        return items.filter((item) =>
            item.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [items, searchTerm]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900 flex flex-col animate-in fade-in duration-200">
            <div className="p-4 flex justify-between items-center border-b dark:border-gray-700">
                <button
                    onClick={() => setFilterType(prev => prev === 'category' ? 'model' : 'category')}
                    className="text-2xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2"
                    title="Clic para cambiar modo de filtro"
                >
                    Filtrar por {filterType === 'category' ? 'Categoría' : 'Modelo'}
                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                        (Clic para cambiar)
                    </span>
                </button>
                <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
                >
                    <X size={32} />
                </button>
            </div>

            <div className="p-4 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <div className="relative max-w-md mx-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder={`Buscar ${filterType === 'category' ? 'categoría' : 'modelo'}...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-10 py-3 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                        >
                            <X size={18} />
                        </button>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                    <button
                        onClick={() => {
                            onSelectFilter(filterType, null);
                            onClose();
                        }}
                        className={`p-6 rounded-xl text-lg font-semibold transition-all ${selectedFilter.value === null
                                ? "bg-blue-600 text-white shadow-lg scale-105"
                                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                            }`}
                    >
                        Todas
                    </button>

                    {filteredItems.map((item) => (
                        <button
                            key={item}
                            onClick={() => {
                                onSelectFilter(filterType, item);
                                onClose();
                            }}
                            className={`p-6 rounded-xl text-lg font-semibold transition-all ${selectedFilter.value === item && selectedFilter.type === filterType
                                    ? "bg-blue-600 text-white shadow-lg scale-105"
                                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                                }`}
                        >
                            {item}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
