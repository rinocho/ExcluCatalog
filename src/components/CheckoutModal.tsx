"use client";

import { useState } from "react";
import { X, User, CreditCard, Phone, MapPin, CheckCircle } from "lucide-react";
import { useCart, Customer } from "@/context/CartContext";

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    onOrderCompleted: () => void;
}

export default function CheckoutModal({ isOpen, onClose, onOrderCompleted }: CheckoutModalProps) {
    const { saveOrder } = useCart();
    const [formData, setFormData] = useState<Customer>({
        rif: "",
        name: "",
        phone: "",
        address: ""
    });
    const [errors, setErrors] = useState<Partial<Customer>>({});

    if (!isOpen) return null;

    const validate = () => {
        const newErrors: Partial<Customer> = {};
        if (!formData.rif.trim()) newErrors.rif = "Requerido";
        if (!formData.name.trim()) newErrors.name = "Requerido";
        if (!formData.phone.trim()) newErrors.phone = "Requerido";
        if (!formData.address.trim()) newErrors.address = "Requerido";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            saveOrder(formData);
            onOrderCompleted();
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in" onClick={onClose} />

            <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
                <div className="p-6 border-b dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Datos del Cliente</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">RIF / Cédula</label>
                        <div className="relative">
                            <CreditCard className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input
                                type="text"
                                value={formData.rif}
                                onChange={(e) => setFormData({ ...formData, rif: e.target.value })}
                                className={`w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border ${errors.rif ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
                                placeholder="V-12345678"
                            />
                        </div>
                        {errors.rif && <p className="text-xs text-red-500">{errors.rif}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nombre / Razón Social</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className={`w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
                                placeholder="Juan Pérez"
                            />
                        </div>
                        {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Teléfono</label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className={`w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border ${errors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
                                placeholder="0414-1234567"
                            />
                        </div>
                        {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Dirección Fiscal</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                            <textarea
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                className={`w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border ${errors.address ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none h-24`}
                                placeholder="Av. Principal..."
                            />
                        </div>
                        {errors.address && <p className="text-xs text-red-500">{errors.address}</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
                    >
                        <CheckCircle size={20} />
                        Procesar Pedido
                    </button>
                </form>
            </div>
        </div>
    );
}
