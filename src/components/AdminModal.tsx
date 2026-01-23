import { X, Upload, FileSpreadsheet, CheckCircle, AlertCircle, Users } from "lucide-react";
import { useState, useRef } from "react";
import * as XLSX from 'xlsx';
import { useProducts, Product } from "@/context/ProductContext";

interface AdminModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AdminModal({ isOpen, onClose }: AdminModalProps) {
    const { updateProducts } = useProducts();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState("");

    if (!isOpen) return null;

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setStatus('loading');
        setMessage("Procesando archivo...");

        const reader = new FileReader();
        reader.onload = (evt) => {
            try {
                const bstr = evt.target?.result;
                const wb = XLSX.read(bstr, { type: 'binary' });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const data = XLSX.utils.sheet_to_json(ws);

                if (data.length === 0) {
                    throw new Error("El archivo está vacío");
                }

                const newProducts: Product[] = data.map((row: any, index) => {
                    // Smart mapping: normalize keys
                    const normalizedRow: { [key: string]: any } = {};
                    Object.keys(row).forEach(key => {
                        const normalizedKey = key.trim().toUpperCase()
                            .normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Remove accents
                        normalizedRow[normalizedKey] = row[key];
                    });

                    // Map fields
                    const code = normalizedRow['CODIGO'] || `GEN-${index}`;
                    const name = normalizedRow['DESCRIPCION'] || "Producto sin nombre";
                    const model = normalizedRow['MODELO AL QUE APLICA'] || "General";
                    const price = parseFloat(normalizedRow['PRECIO ESTANDAR']) || 0;

                    // Clean discount logic
                    let discount = undefined;
                    const rawDiscount = normalizedRow['MAXIMOS DESCUENTO PAGO EN $ POSIBLE'];

                    if (rawDiscount) {
                        const discountStr = String(rawDiscount);
                        // Extract percentages
                        const percentages = discountStr.match(/\d+%/g);

                        if (percentages && percentages.length > 0) {
                            // Join ranges with " - "
                            discount = percentages.join(" - ");
                        } else {
                            // Fallback: remove negatives and trim
                            discount = discountStr.replace(/-/g, "").trim();
                        }
                    }

                    return {
                        id: Date.now() + index, // Generate unique ID
                        code: String(code),
                        name: String(name),
                        model: String(model),
                        price: price,
                        discount: discount,
                        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60" // Default image
                    };
                });

                updateProducts(newProducts);
                setStatus('success');
                setMessage(`Se han cargado ${newProducts.length} productos exitosamente.`);

                setTimeout(() => {
                    onClose();
                    setStatus('idle');
                    setMessage("");
                }, 2000);

            } catch (error) {
                console.error("Error parsing Excel:", error);
                setStatus('error');
                setMessage("Error al procesar el archivo. Verifique el formato.");
            }
        };
        reader.readAsBinaryString(file);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in" onClick={onClose} />

            <div className="relative w-[80%] h-[80%] bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
                <div className="p-6 flex justify-between items-center border-b dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Panel de Control</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
                    >
                        <X size={32} />
                    </button>
                </div>

                <div className="flex-1 p-8 flex flex-col items-center justify-center gap-8 overflow-y-auto">
                    <div className="w-full max-w-md space-y-6">
                        {/* Product Upload Button */}
                        <div className="space-y-2">
                            <input
                                type="file"
                                accept=".xlsx, .xls, .csv"
                                onChange={handleFileUpload}
                                ref={fileInputRef}
                                className="hidden"
                            />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={status === 'loading' || status === 'success'}
                                className={`w-full py-6 px-6 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-all group ${status === 'success'
                                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                                    : status === 'error'
                                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                                        : 'border-gray-300 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-600 dark:text-gray-300'
                                    }`}
                            >
                                {status === 'loading' ? (
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-current"></div>
                                ) : status === 'success' ? (
                                    <CheckCircle size={32} />
                                ) : status === 'error' ? (
                                    <AlertCircle size={32} />
                                ) : (
                                    <FileSpreadsheet size={32} className="group-hover:scale-110 transition-transform" />
                                )}
                                <span className="font-bold text-lg">
                                    {status === 'loading' ? 'Procesando...' :
                                        status === 'success' ? '¡Carga Exitosa!' :
                                            status === 'error' ? 'Error en la carga' :
                                                'Carga Excel de Productos'}
                                </span>
                                <span className="text-sm opacity-70 font-normal">Actualizar catálogo</span>
                            </button>

                            {message && (
                                <p className={`text-center text-sm font-medium ${status === 'success' ? 'text-green-600 dark:text-green-400' :
                                    status === 'error' ? 'text-red-600 dark:text-red-400' :
                                        'text-gray-500'
                                    }`}>
                                    {message}
                                </p>
                            )}
                        </div>

                        {/* Client Upload Button (Disabled) */}
                        <button
                            disabled
                            className="w-full py-6 px-6 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 text-gray-400 dark:text-gray-600 flex flex-col items-center justify-center gap-3 cursor-not-allowed opacity-70"
                        >
                            <Users size={32} />
                            <span className="font-bold text-lg">Carga Excel de Clientes</span>
                            <span className="text-sm font-normal">Próximamente</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
