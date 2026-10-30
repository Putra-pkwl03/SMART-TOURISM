'use client';

import React, { useRef, useState } from 'react';
import { MapPin, UploadCloud, CheckCircle2, Layers, Trash2, Tag, Users, ShieldAlert, X, Loader2, GripHorizontal } from 'lucide-react';

const NGORO_ORO_REGIONS = [
    'Padukuhan Gembyong (Jurug Gedhe)',
    'Padukuhan Salaran (Sentra UMKM)',
    'Padukuhan Sepat',
    'Padukuhan Klegung',
    'Padukuhan Tawang',
    'Padukuhan Senggotan',
    'Padukuhan Gunung Asem',
    'Padukuhan Soka',
    'Padukuhan Jati Kuning'
];

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
    revenueShare: number | '';
    setRevenueShare: (val: number | '') => void;
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
    onReorderImages: (dragIndex: number, hoverIndex: number) => void; // Props baru untuk geser posisi foto
    onSubmit: (e: React.FormEvent) => void;
    onClose: () => void;
    isLoading?: boolean; // Props indikator loading saat submit
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
    revenueShare,
    setRevenueShare,
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
    onReorderImages,
    onSubmit,
    onClose,
    isLoading = false,
}: DestinationFormContentProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);

    const handleDropUpload = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            onFilesChange(e.dataTransfer.files);
        }
    };

    // Handler untuk drag and drop urutan foto (reordering)
    const handleDragStart = (e: React.DragEvent, index: number) => {
        setDraggedItemIndex(index);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDropReorder = (e: React.DragEvent, targetIndex: number) => {
        e.preventDefault();
        if (draggedItemIndex === null) return;
        if (draggedItemIndex !== targetIndex) {
            onReorderImages(draggedItemIndex, targetIndex);
        }
        setDraggedItemIndex(null);
    };

    return (
        <div className="bg-white rounded-3xl max-w-2xl w-full flex flex-col shadow-2xl border border-slate-100 overflow-hidden transform transition-all animate-scaleUp">
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 9999px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8;
                }
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
                    onClick={onClose} 
                    disabled={isLoading}
                    className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors disabled:opacity-50"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Form Body */}
            <form onSubmit={onSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto custom-scrollbar">
                
                {/* Jenis Entri */}
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Jenis Entri Menu</label>
                    <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-2xl">
                        <button
                            type="button"
                            onClick={() => setEntryType('destination')}
                            className={`py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                                entryType === 'destination' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            <MapPin className="w-4 h-4" /> Tiket / Destinasi Murni
                        </button>
                        <button
                            type="button"
                            onClick={() => setEntryType('package')}
                            className={`py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                                entryType === 'package' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            <Layers className="w-4 h-4" /> Paket Bundling UMKM
                        </button>
                    </div>
                </div>

                {/* Nama */}
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                        Nama {entryType === 'destination' ? 'Destinasi Wisata' : 'Paket Bundling'}
                    </label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <Tag className="w-4 h-4" />
                        </span>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Contoh: Canyoneering Jurug Gedhe"
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50/70 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                        />
                    </div>
                </div>

                {/* Lokasi, Harga, Kuota */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Lokasi Padukuhan</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer"
                        >
                            {NGORO_ORO_REGIONS.map((region) => (
                                <option key={region} value={region}>{region}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Harga Dasar (Rp)</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-bold text-xs">Rp</span>
                            <input
                                type="number"
                                required
                                value={price}
                                onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                                className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Kuota Harian</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                <Users className="w-4 h-4" />
                            </span>
                            <input
                                type="number"
                                required
                                value={quota}
                                onChange={(e) => setQuota(e.target.value === '' ? '' : Number(e.target.value))}
                                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Bagi Hasil & Status EWS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {entryType === 'package' ? (
                        <div className="p-3 bg-emerald-50/60 border border-emerald-200/80 rounded-2xl">
                            <label className="block text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1.5 flex items-center gap-1.5">
                                <Layers className="w-3.5 h-3.5 text-emerald-600" /> Bagi Hasil UMKM Sedyo Maju (Rp)
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-700 font-bold text-xs">Rp</span>
                                <input
                                    type="number"
                                    value={revenueShare}
                                    onChange={(e) => setRevenueShare(e.target.value === '' ? '' : Number(e.target.value))}
                                    placeholder="Contoh: 15000"
                                    className="w-full pl-9 pr-3.5 py-2 bg-white border border-emerald-300 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm"
                                />
                            </div>
                        </div>
                    ) : (
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
                                <ShieldAlert className="w-3.5 h-3.5 text-slate-400" /> Status Operasional (EWS)
                            </label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value as 'Aktif' | 'Darurat Ditutup')}
                                className="w-full px-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer"
                            >
                                <option value="Aktif">🟢 Aktif (Normal)</option>
                                <option value="Darurat Ditutup">🔴 Darurat Ditutup (Siaga EWS)</option>
                            </select>
                        </div>
                    )}

                    {entryType === 'package' && (
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
                                <ShieldAlert className="w-3.5 h-3.5 text-slate-400" /> Status Operasional (EWS)
                            </label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value as 'Aktif' | 'Darurat Ditutup')}
                                className="w-full px-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer"
                            >
                                <option value="Aktif">🟢 Aktif (Normal)</option>
                                <option value="Darurat Ditutup">🔴 Darurat Ditutup (Siaga EWS)</option>
                            </select>
                        </div>
                    )}
                </div>

                {/* Multi-Image Upload & Grid Previews dengan Fitur Geser (Drag-and-Drop) */}
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center justify-between">
                        <span>Galeri Foto (Geser untuk ubah urutan / Foto #1 jadi Banner Utama)</span>
                        <span className="text-[10px] text-emerald-600 font-bold">{imagePreviews.length} Foto</span>
                    </label>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={(e) => e.target.files && onFilesChange(e.target.files)} 
                        accept="image/*" 
                        multiple 
                        className="hidden" 
                    />

                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-2">
                        {imagePreviews.map((src, index) => (
                            <div 
                                key={index} 
                                draggable
                                onDragStart={(e) => handleDragStart(e, index)}
                                onDragOver={(e) => handleDragOver(e, index)}
                                onDrop={(e) => handleDropReorder(e, index)}
                                className="relative h-20 rounded-2xl overflow-hidden border border-slate-200 group shadow-sm cursor-grab active:cursor-grabbing bg-slate-100"
                                title="Geser untuk memindahkan posisi foto"
                            >
                                <img src={src} alt={`Preview ${index}`} className="w-full h-full object-cover pointer-events-none" />
                                
                                {/* Label urutan / Badge Banner */}
                                <div className="absolute top-1 left-1 bg-slate-900/70 text-white text-[9px] px-1.5 py-0.5 rounded-md font-bold flex items-center gap-1">
                                    <GripHorizontal className="w-2.5 h-2.5" /> #{index + 1} {index === 0 ? '(Utama)' : ''}
                                </div>

                                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button
                                        type="button"
                                        onClick={() => onRemoveImage(index)}
                                        className="p-1.5 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition shadow-md"
                                        title="Hapus foto"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                        <div
                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={handleDropUpload}
                            onClick={() => fileInputRef.current?.click()}
                            className={`h-20 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all ${
                                isDragging ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-200 hover:border-emerald-400 bg-slate-50/50 hover:bg-emerald-50/20 text-slate-400 hover:text-emerald-600'
                            }`}
                        >
                            <UploadCloud className="w-4 h-4 mb-1" />
                            <span className="text-[10px] font-bold text-center px-1">Tambah Foto</span>
                        </div>
                    </div>
                </div>

                {/* Deskripsi */}
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Deskripsi Singkat</label>
                    <textarea
                        rows={2}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Detail fasilitas atau isi hampers UMKM..."
                        className="w-full px-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none resize-none transition-all"
                    />
                </div>

                {/* Footer Tombol Aksi dengan Loading State */}
                <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-slate-100">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-5 py-2.5 rounded-2xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all disabled:opacity-50"
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white shadow-lg shadow-emerald-600/25 transition-all flex items-center gap-2 transform active:scale-95 disabled:opacity-75 disabled:cursor-not-allowed"
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