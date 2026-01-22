"use client";

import { useCart } from "@/context/CartContext";
import { Trash2, X } from "lucide-react";
import { useState } from "react";

import ProductImage from "./ProductImage";

interface CartModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CartModal({ isOpen, onClose }: CartModalProps) {
    const { items, removeFromCart, updateQuantity } = useCart();
    const [showCode, setShowCode] = useState(false);

    if (!isOpen) return null;

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900 flex flex-col animate-in fade-in duration-200">
            <div className="p-4 flex justify-between items-center border-b dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Tu Carrito</h2>
                <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
                >
                    <X size={32} />
                </button>
            </div>

            <div className="flex-1 overflow-auto p-4 sm:p-8">
                <div className="max-w-5xl mx-auto">
                    {items.length === 0 ? (
                        <div className="text-center text-gray-500 dark:text-gray-400 mt-20">
                            <p className="text-xl">Tu carrito está vacío</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse border border-gray-300 dark:border-gray-700 text-left">
                                <thead className="sticky top-0 z-10 shadow-sm">
                                    <tr className="bg-gray-100 dark:bg-gray-800">
                                        <th
                                            className="border border-gray-300 dark:border-gray-700 p-3 font-semibold text-gray-900 dark:text-white cursor-pointer select-none hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                            onClick={() => setShowCode(!showCode)}
                                            title="Clic para alternar entre Nombre y Código"
                                        >
                                            {showCode ? "Código" : "Producto"}
                                        </th>
                                        <th className="border border-gray-300 dark:border-gray-700 p-3 font-semibold text-gray-900 dark:text-white w-32 text-center">Cant.</th>
                                        <th className="border border-gray-300 dark:border-gray-700 p-3 font-semibold text-gray-900 dark:text-white w-24 text-right">Precio</th>
                                        <th className="border border-gray-300 dark:border-gray-700 p-3 font-semibold text-gray-900 dark:text-white w-24 text-right">Subtotal</th>
                                        <th className="border border-gray-300 dark:border-gray-700 p-3 font-semibold text-gray-900 dark:text-white w-16 text-center">Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                            <td className="border border-gray-300 dark:border-gray-700 p-3 text-gray-800 dark:text-gray-200">
                                                <div className="flex items-center gap-3">
                                                    <div className="relative w-12 h-12 rounded overflow-hidden shrink-0 border border-gray-200 dark:border-gray-700">
                                                        <ProductImage
                                                            code={item.code}
                                                            alt={item.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    <span className="font-medium">{showCode ? item.code : item.name}</span>
                                                </div>
                                            </td>
                                            <td className="border border-gray-300 dark:border-gray-700 p-3 text-gray-800 dark:text-gray-200 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 transition-colors"
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        -
                                                    </button>
                                                    <div className="relative">
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            value={item.quantity}
                                                            onChange={(e) => {
                                                                const val = parseInt(e.target.value);
                                                                if (!isNaN(val) && val >= 1) updateQuantity(item.id, val);
                                                            }}
                                                            onBlur={(e) => {
                                                                const val = parseInt(e.target.value);
                                                                if (isNaN(val) || val < 1) updateQuantity(item.id, 1);
                                                            }}
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter') {
                                                                    e.currentTarget.blur();
                                                                }
                                                            }}
                                                            onFocus={(e) => e.target.select()}
                                                            className="w-12 py-1 text-center bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                                                        />
                                                    </div>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 transition-colors"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="border border-gray-300 dark:border-gray-700 p-3 text-gray-800 dark:text-gray-200 text-right">${item.price.toFixed(2)}</td>
                                            <td className="border border-gray-300 dark:border-gray-700 p-3 text-gray-800 dark:text-gray-200 text-right font-medium">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </td>
                                            <td className="border border-gray-300 dark:border-gray-700 p-3 text-center">
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/30 p-2 rounded transition-colors"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {items.length > 0 && (
                <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t dark:border-gray-700 p-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                    <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            Total: <span className="text-blue-600 dark:text-blue-400">${total.toFixed(2)}</span>
                        </div>
                        <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold py-3 px-8 rounded-lg shadow-lg transition-transform hover:scale-105">
                            Finalizar Compra
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
