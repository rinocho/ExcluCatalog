"use client";

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface FloatingPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function FloatingPagination({ currentPage, totalPages, onPageChange }: FloatingPaginationProps) {
    if (totalPages <= 1) return null;

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            onPageChange(page);
        }
    };

    return (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 animate-in slide-in-from-bottom-4 fade-in duration-300">
            <div className="flex items-center gap-2 p-2 rounded-full bg-white/30 dark:bg-black/30 backdrop-blur-md shadow-lg border border-white/20 dark:border-white/10">
                <button
                    onClick={() => handlePageChange(Math.max(1, currentPage - 5))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-full hover:bg-white/50 dark:hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-gray-800 dark:text-white"
                    title="Retroceder 5 páginas"
                >
                    <ChevronsLeft size={20} />
                </button>
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-full hover:bg-white/50 dark:hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-gray-800 dark:text-white"
                    title="Página anterior"
                >
                    <ChevronLeft size={20} />
                </button>

                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold shadow-md">
                    {currentPage}
                </div>

                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-full hover:bg-white/50 dark:hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-gray-800 dark:text-white"
                    title="Página siguiente"
                >
                    <ChevronRight size={20} />
                </button>
                <button
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 5))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-full hover:bg-white/50 dark:hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-gray-800 dark:text-white"
                    title="Avanzar 5 páginas"
                >
                    <ChevronsRight size={20} />
                </button>
            </div>
        </div>
    );
}
