"use client";

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

export default function LoginPage() {
    const { login } = useAuth();
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simple mock authentication
        if (password === "admin123") { // In a real app, validate against backend
            login();
        } else {
            setError("Contraseña incorrecta");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
            <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md border border-gray-700">
                <h1 className="text-3xl font-bold mb-6 text-center text-blue-500">ExcluCatalog</h1>
                <p className="text-gray-400 mb-6 text-center">Ingresa para ver el catálogo exclusivo</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <p className="text-red-500 text-sm text-center">{error}</p>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-200"
                    >
                        Entrar
                    </button>
                </form>
                <div className="mt-4 text-center text-xs text-gray-500">
                    <p>Contraseña demo: admin123</p>
                </div>
            </div>
        </div>
    );
}
