"use client";

import { useState, useMemo, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import FloatingCart from "@/components/FloatingCart";
import Header from "@/components/Header";
import FilterModal from "@/components/FilterModal";
import CartModal from "@/components/CartModal";
import AdminModal from "@/components/AdminModal";
import FloatingPagination from "@/components/FloatingPagination";
import ProductDetailModal from "@/components/ProductDetailModal";
import { useCart } from "@/context/CartContext";
import { useProducts, Product } from "@/context/ProductContext";

const ITEMS_PER_PAGE = 50;

export default function CatalogoPage() {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isAdminOpen, setIsAdminOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
    const [selectedFilter, setSelectedFilter] = useState<{ type: 'category' | 'model'; value: string | null }>({ type: 'category', value: null });
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const { addToCart } = useCart();
    const { products } = useProducts();

    // Extract categories automatically from first word of product name
    const categories = useMemo(() => {
        const uniqueCategories = new Set(products.map(p => p.name.split(' ')[0]));
        return Array.from(uniqueCategories);
    }, [products]);

    // Extract models
    const models = useMemo(() => {
        const uniqueModels = new Set(products.map(p => p.model));
        return Array.from(uniqueModels);
    }, [products]);

    const filteredProducts = useMemo(() => {
        if (!selectedFilter.value) return products;
        if (selectedFilter.type === 'category') {
            return products.filter(p => p.name.split(' ')[0] === selectedFilter.value);
        } else {
            return products.filter(p => p.model === selectedFilter.value);
        }
    }, [selectedFilter, products]);

    // Reset pagination when filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedFilter]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const currentProducts = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
    }, [currentPage, filteredProducts]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 pb-20 transition-colors duration-300">
            <Header
                onOpenFilter={() => setIsFilterOpen(true)}
                onOpenAdmin={() => setIsAdminOpen(true)}
                viewMode={viewMode}
                onToggleViewMode={() => setViewMode(prev => prev === 'grid' ? 'table' : 'grid')}
            />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {selectedFilter.value && (
                    <div className="mb-6 flex items-center gap-2 animate-in fade-in slide-in-from-left-4">
                        <span className="text-gray-500 dark:text-gray-400">
                            Filtrado por {selectedFilter.type === 'category' ? 'Categoría' : 'Modelo'}:
                        </span>
                        <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
                            {selectedFilter.value}
                        </span>
                        <button
                            onClick={() => setSelectedFilter({ ...selectedFilter, value: null })}
                            className="text-sm text-red-500 hover:underline ml-2"
                        >
                            Limpiar
                        </button>
                    </div>
                )}

                {viewMode === 'grid' ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6">
                        {currentProducts.map((product, index) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                priority={index < 6}
                                onClick={() => setSelectedProduct(product)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-50 dark:bg-gray-700/50 text-xs sm:text-base">
                                    <tr>
                                        <th className="p-2 sm:p-4 font-semibold text-gray-900 dark:text-white border-b dark:border-gray-700">Código</th>
                                        <th className="p-2 sm:p-4 font-semibold text-gray-900 dark:text-white border-b dark:border-gray-700">Producto</th>
                                        <th className="p-2 sm:p-4 font-semibold text-gray-900 dark:text-white border-b dark:border-gray-700">Modelo</th>
                                        <th className="p-2 sm:p-4 font-semibold text-gray-900 dark:text-white border-b dark:border-gray-700 text-right">Precio</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 text-xs sm:text-base">
                                    {currentProducts.map((product) => (
                                        <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                            <td className="p-2 sm:p-4 text-gray-600 dark:text-gray-300 font-mono">{product.code}</td>
                                            <td className="p-2 sm:p-4 text-gray-900 dark:text-white font-medium whitespace-normal break-words min-w-[120px]">{product.name}</td>
                                            <td className="p-2 sm:p-4 text-gray-600 dark:text-gray-300">{product.model}</td>
                                            <td className="p-2 sm:p-4 text-right">
                                                <button
                                                    onClick={() => addToCart(product)}
                                                    className="w-full sm:w-32 bg-blue-600 hover:bg-blue-700 text-white font-bold py-1.5 px-2 sm:px-4 rounded transition-colors text-xs sm:text-sm"
                                                >
                                                    ${product.price.toFixed(2)}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>

            <FloatingPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />

            <FloatingCart onClick={() => setIsCartOpen(true)} />

            <FilterModal
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                categories={categories}
                models={models}
                selectedFilter={selectedFilter}
                onSelectFilter={(type, value) => setSelectedFilter({ type, value })}
            />

            <CartModal
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
            />

            <AdminModal
                isOpen={isAdminOpen}
                onClose={() => setIsAdminOpen(false)}
            />

            <ProductDetailModal
                product={selectedProduct}
                isOpen={!!selectedProduct}
                onClose={() => setSelectedProduct(null)}
            />
        </div>
    );
}
