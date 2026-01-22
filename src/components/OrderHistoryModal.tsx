"use client";

import { useCart, Order } from "@/context/CartContext";
import { X, ChevronDown, ChevronUp, Clock, Package } from "lucide-react";
import { useState } from "react";
import ProductImage from "./ProductImage";

interface OrderHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function OrderHistoryModal({ isOpen, onClose }: OrderHistoryModalProps) {
    const { orders } = useCart();
    const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

    if (!isOpen) return null;

    const toggleOrder = (orderId: string) => {
        if (expandedOrderId === orderId) {
            setExpandedOrderId(null);
        } else {
            setExpandedOrderId(orderId);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-2xl h-[85vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="p-6 border-b dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400">
                            <Clock size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Mis Pedidos</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50 dark:bg-gray-900">
                    {orders.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500">
                            <Package size={64} strokeWidth={1} className="mb-4 opacity-50" />
                            <p className="text-lg font-medium">No tienes pedidos registrados</p>
                            <p className="text-sm">Tus compras aparecerán aquí</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {orders.map((order) => (
                                <div
                                    key={order.id}
                                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-200 hover:shadow-md"
                                >
                                    {/* Order Summary (Clickable) */}
                                    <div
                                        className="p-4 flex flex-col sm:flex-row sm:items-center justify-between cursor-pointer gap-4"
                                        onClick={() => toggleOrder(order.id)}
                                    >
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs font-mono text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                ID: {order.id.slice(-8)}
                                            </span>
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                {order.date}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                                            <div className="text-right">
                                                <span className="block text-xs text-gray-500 dark:text-gray-400">Total</span>
                                                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                                    ${order.total.toFixed(2)}
                                                </span>
                                            </div>
                                            <div className={`text-gray-400 transition-transform duration-300 ${expandedOrderId === order.id ? 'rotate-180' : ''}`}>
                                                <ChevronDown size={20} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Details (Expandable) */}
                                    {expandedOrderId === order.id && (
                                        <div className="border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-4 animate-in slide-in-from-top-2 duration-200">
                                            <div className="space-y-3">
                                                {order.items.map((item) => (
                                                    <div key={item.id} className="flex items-center justify-between text-sm">
                                                        <div className="flex items-center gap-3">
                                                            <div className="relative w-10 h-10 rounded overflow-hidden border border-gray-200 dark:border-gray-700 shrink-0">
                                                                <ProductImage
                                                                    code={item.code}
                                                                    alt={item.name}
                                                                    fill
                                                                    className="object-cover"
                                                                />
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="font-medium text-gray-900 dark:text-white line-clamp-1">
                                                                    {item.name}
                                                                </span>
                                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                                    {item.quantity} x ${item.price.toFixed(2)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <span className="font-semibold text-gray-700 dark:text-gray-300">
                                                            ${(item.quantity * item.price).toFixed(2)}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                                    {order.items.reduce((acc, item) => acc + item.quantity, 0)} artículos
                                                </span>
                                                <span className="text-xl font-bold text-gray-900 dark:text-white">
                                                    ${order.total.toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
