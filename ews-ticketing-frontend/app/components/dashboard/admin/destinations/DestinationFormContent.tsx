'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, CheckCircle2, X, Loader2 } from 'lucide-react';
import { apiClient } from '@/app/lib/axios';
import DestinationTypeSelector from './DestinationTypeSelector';
import DestinationBasicInfo from './DestinationBasicInfo';
import DestinationStatusSelector from './DestinationStatusSelector';
import UmkmBundlingSelector from './UmkmBundlingSelector';
import DestinationImageUploader from './DestinationImageUploader';

interface DestinationFormContentProps {
    isEdit: boolean;
    name: string;
    setName: (val: string) => void;
    entryType: 'destination' | 'package';
    setEntryType: (val: 'destination' | 'package') => void;
    type: string;
    setType: (val: string) => void;
    price: number | '';
    setPrice: (val: number | '') => void;
    quota: number | '';
    setQuota: (val: number | '') => void;
    status: 'Aktif' | 'Darurat Ditutup';
    setStatus: (val: 'Aktif' | 'Darurat Ditutup') => void;
    description: string;
    setDescription: (val: string) => void;
    imagePreviews: string[];
    isDragging: boolean;
    setIsDragging: (val: boolean) => void;
    onFilesChange: (files: FileList | File[]) => void;
    onRemoveImage: (index: number) => void;
    onReorderImages: (dragIndex: number, hoverIndex: number) => void;
    onSubmit: (e: React.FormEvent) => void;
    onClose: () => void;
    isLoading?: boolean;
    selectedProductIds?: number[];
    setSelectedProductIds?: (ids: number[]) => void;
}

export default function DestinationFormContent({
    isEdit,
    name,
    setName,
    entryType,
    setEntryType,
    type,
    setType,
    price,
    setPrice,
    quota,
    setQuota,
    status,
    setStatus,
    description,
    setDescription,
    imagePreviews,
    isDragging,
    setIsDragging,
    onFilesChange,
    onRemoveImage,
    onSubmit,
    onClose,
    isLoading = false,
    selectedProductIds = [],
    setSelectedProductIds = () => {},
}: DestinationFormContentProps) {
    const [availableProducts, setAvailableProducts] = useState<any[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await apiClient.get('/umkm/products');
                setAvailableProducts(res.data.data || res.data || []);
            } catch (error) {
                console.error("Gagal memuat produk UMKM", error);
            }
        };
        fetchProducts();
    }, []);

    return (
        <div className="bg-white rounded-3xl max-w-2xl w-full flex flex-col shadow-2xl border border-slate-100 overflow-hidden transform transition-all animate-scaleUp">
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 9999px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
            `}</style>

            {/* Header Modal */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-emerald-50/50 via-white to-white flex-shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shadow-inner">
                        <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-900">
                            {isEdit ? 'Edit Destinasi / Paket Bundling' : 'Tambah Destinasi / Paket Baru'}
                        </h3>
                        <p className="text-xs text-emerald-700 font-medium">Desa Wisata Cerdas Ngoro-Oro (Kosabangsa 2026)</p>
                    </div>
                </div>
                <button 
                    type="button"
                    onClick={onClose} 
                    disabled={isLoading}
                    className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors disabled:opacity-50 cursor-pointer"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Form Body */}
            <form onSubmit={onSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto custom-scrollbar">
                <DestinationTypeSelector entryType={entryType} setEntryType={setEntryType} />

                <DestinationBasicInfo
                    entryType={entryType}
                    name={name}
                    setName={setName}
                    type={type}
                    setType={setType}
                    price={price}
                    setPrice={setPrice}
                    quota={quota}
                    setQuota={setQuota}
                />

                <DestinationStatusSelector status={status} setStatus={setStatus} />

                {entryType === 'package' && (
                    <UmkmBundlingSelector
                        availableProducts={availableProducts}
                        selectedProductIds={selectedProductIds}
                        setSelectedProductIds={setSelectedProductIds}
                    />
                )}

                <DestinationImageUploader
                    entryType={entryType}
                    imagePreviews={imagePreviews}
                    isDragging={isDragging}
                    setIsDragging={setIsDragging}
                    onFilesChange={onFilesChange}
                    onRemoveImage={onRemoveImage}
                />

                {/* Deskripsi */}
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Deskripsi Singkat</label>
                    <textarea
                        rows={2}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Detail fasilitas atau isi paket wisata..."
                        className="w-full px-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none resize-none transition-all"
                    />
                </div>

                {/* Footer Tombol Aksi */}
                <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-slate-100">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-5 py-2.5 rounded-2xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all disabled:opacity-50 cursor-pointer"
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white shadow-lg shadow-emerald-600/25 transition-all flex items-center gap-2 transform active:scale-95 disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Menyimpan...</span>
                            </>
                        ) : (
                            <>
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Simpan Data</span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}