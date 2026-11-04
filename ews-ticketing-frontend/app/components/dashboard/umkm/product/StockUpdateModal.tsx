'use client';

import { useState, useEffect } from 'react';
import { X, Loader2, Package } from 'lucide-react';
import { apiClient } from '@/app/lib/axios';
import { toast } from 'sonner';

interface StockUpdateModalProps {
    product: any | null;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function StockUpdateModal({ product, isOpen, onClose, onSuccess }: StockUpdateModalProps) {
    const [stock, setStock] = useState('');
    const [loading, setLoading] = useState(false);

    // Sinkronkan nilai input stok saat modal dibuka atau produk berubah
    useEffect(() => {
        if (product) {
            setStock(product.stock !== undefined ? product.stock.toString() : '');
        }
    }, [product, isOpen]);

    if (!isOpen || !product) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await apiClient.patch(`/umkm/products/${product.id}/stock`, {
                stock: Number(stock)
            });
            toast.success('Stok produk berhasil diperbarui!');
            onSuccess();
            onClose();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Gagal memperbarui stok.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white border border-gray-100 rounded-3xl w-full max-w-sm p-6 space-y-5 shadow-2xl">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center border border-indigo-100">
                            <Package className="w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="text-sm font-extrabold text-gray-900">Update Stok Cepat</h3>
                            <p className="text-[10px] text-gray-400 truncate max-w-[200px]">{product.name}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 cursor-pointer transition">
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                    <div>
                        <label className="block text-gray-700 font-bold mb-1.5">Jumlah Sisa Stok Baru (Pcs)</label>
                        <input 
                            type="number" 
                            required 
                            min="0"
                            value={stock} 
                            onChange={(e) => setStock(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition font-bold text-sm"
                            placeholder="Masukkan jumlah stok..."
                        />
                        <p className="text-[10px] text-gray-400 mt-1">
                            Stok awal titipan tercatat: <span className="font-semibold text-gray-600">{product.initial_stock || product.stock} Pcs</span>
                        </p>
                    </div>

                    <div className="flex gap-2.5 pt-2">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition cursor-pointer"
                        >
                            Batal
                        </button>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition shadow-lg shadow-indigo-600/20 cursor-pointer disabled:opacity-50"
                        >
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                            <span>Simpan Stok</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}