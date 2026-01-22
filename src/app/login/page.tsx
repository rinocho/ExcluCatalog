"use client";

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { KeyRound, ArrowRight, Lock } from "lucide-react";

export default function LoginPage() {
    const { login } = useAuth();
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === "admin123") {
            login();
        } else {
            setError(true);
            setPassword(""); // Clear password on error for privacy
            setTimeout(() => setError(false), 2000);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gray-900">
            {/* Background with deep blur/gradient */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2500&auto=format&fit=crop')] bg-cover bg-center opacity-40 blur-[20px] scale-110"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>

            {/* Login Container */}
            <div className="relative z-10 w-full max-w-sm p-8 mx-4">
                <div className="bg-white/10 dark:bg-black/30 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8 flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">

                    {/* Icon */}
                    <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 shadow-inner ring-1 ring-white/20">
                        <Lock className="text-white w-8 h-8" />
                    </div>

                    <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">Acceso Privado</h1>
                    <p className="text-gray-400 text-sm mb-8 text-center">Introduce tu llave maestra para continuar</p>

                    <form onSubmit={handleSubmit} className="w-full space-y-6">
                        <div className="relative group">
                            <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300 ${isFocused ? 'text-blue-400' : 'text-gray-500'}`}>
                                <KeyRound size={20} />
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setError(false);
                                }}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                className={`w-full pl-12 pr-4 py-4 bg-black/20 border ${error ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-blue-500/50'} rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300`}
                                placeholder="Llave de Acceso"
                                autoFocus
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={!password}
                            className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-100 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-white/10"
                        >
                            <span>Entrar</span>
                            <ArrowRight size={18} />
                        </button>
                    </form>

                    {/* Error Message (Subtle) */}
                    <div className={`mt-6 h-6 flex items-center justify-center transition-opacity duration-300 ${error ? 'opacity-100' : 'opacity-0'}`}>
                        <span className="text-red-400 text-sm font-medium bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
                            Llave incorrecta
                        </span>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-white/20 text-xs font-mono tracking-widest uppercase">ExcluCatalog Secure System</p>
                </div>
            </div>
        </div>
    );
}
