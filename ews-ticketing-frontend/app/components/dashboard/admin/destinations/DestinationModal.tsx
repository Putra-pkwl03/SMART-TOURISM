'use client';

import { useState, useEffect, useRef } from 'react';
import { X, MapPin, UploadCloud, CheckCircle2 } from 'lucide-react';

interface DestinationItem {
    id: number;
    name: string;
    type: string;
    price: number;
    quota: number;
    status: 'Aktif' | 'Darurat Ditutup';
    description?: string;
    image_url?: string;
    image_file?: File | null;
}

interface DestinationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: DestinationItem) => void;
    initialData?: DestinationItem | null;
}

export default function DestinationModal({ isOpen, onClose, onSave, initialData }: DestinationModalProps) {
    const [name, setName] = useState('');
    const [type, setType] = useState('Padukuhan Gembyong, Ngoro-Oro');
    const [price, setPrice] = useState(35000);
    const [quota, setQuota] = useState(50);
    const [status, setStatus] = useState<'Aktif' | 'Darurat Ditutup'>('Aktif');
    const [description, setDescription] = useState('');
    
    // State untuk Image Drag & Drop / Preview
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (initialData) {
            setName(initialData.name || '');
            setType(initialData.type || 'Padukuhan Gembyong, Ngoro-Oro');
            setPrice(initialData.price || 35000);
            setQuota(initialData.quota || 50);
            setStatus(initialData.status || 'Aktif');
            setDescription(initialData.description || '');
            setImagePreview(initialData.image_url || '/destinasi-jurug-gedhe.jpg');
            setImageFile(null);
        } else {
            setName('');
            setType('Padukuhan Gembyong, Ngoro-Oro');
            setPrice(35000);
            setQuota(50);
            setStatus('Aktif');
            setDescription('');
            setImagePreview('/destinasi-jurug-gedhe.jpg');
            setImageFile(null);
        }
    }, [initialData]);

    if (!isOpen) return null;

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            id: initialData ? initialData.id : Date.now(),
            name,
            type,
            price: Number(price),
            quota: Number(quota),
            status,
            description,
            image_url: imagePreview,
            image_file: imageFile,
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            {/* Kontainer Modal dengan batasan tinggi maks 90vh dan flex layout */}
            <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden">
                
                {/* Header Modal (Tetap di atas) */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                            <MapPin className="w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-900">
                                {initialData ? 'Edit Destinasi / Paket' : 'Tambah Destinasi Baru'}
                            </h3>
                            <p className="text-[11px] text-slate-500">Kelola master data destinasi dan paket wisata</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Bagian Form yang bisa di-scroll jika layar kecil */}
                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-3.5">
                    {/* Nama Destinasi */}
                    <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">Nama Destinasi / Paket Bundling</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Contoh: Susur Sungai Jurug Gedhe"
                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:bg-white focus:ring-2 focus:ring-emerald-600 outline-none transition"
                        />
                    </div>

                    {/* Kategori & Harga */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">Kategori / Lokasi</label>
                            <input
                                type="text"
                                required
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                placeholder="Contoh: Padukuhan Gembyong"
                                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:bg-white focus:ring-2 focus:ring-emerald-600 outline-none transition"
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">Harga Tiket Dasar (Rp)</label>
                            <input
                                type="number"
                                required
                                value={price}
                                onChange={(e) => setPrice(Number(e.target.value))}
                                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:bg-white focus:ring-2 focus:ring-emerald-600 outline-none transition"
                            />
                        </div>
                    </div>

                    {/* Kuota & Status EWS */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">Kuota Harian (Orang)</label>
                            <input
                                type="number"
                                required
                                value={quota}
                                onChange={(e) => setQuota(Number(e.target.value))}
                                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:bg-white focus:ring-2 focus:ring-emerald-600 outline-none transition"
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">Status Operasional (EWS)</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value as 'Aktif' | 'Darurat Ditutup')}
                                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:bg-white focus:ring-2 focus:ring-emerald-600 outline-none transition"
                            >
                                <option value="Aktif">Aktif (Normal)</option>
                                <option value="Darurat Ditutup">Darurat Ditutup (Siaga EWS)</option>
                            </select>
                        </div>
                    </div>

                    {/* Modern Drag & Drop Image Upload */}
                    <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">Foto Banner Destinasi</label>
                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition flex flex-col items-center justify-center gap-1.5 relative overflow-hidden group ${
                                isDragging ? 'border-emerald-600 bg-emerald-50/50' : 'border-slate-200 bg-slate-50 hover:bg-slate-100/60'
                            }`}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                className="hidden"
                            />

                            {imagePreview ? (
                                <div className="relative w-full h-28 rounded-xl overflow-hidden shadow-inner group-hover:opacity-90 transition">
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-white text-xs font-bold gap-1.5">
                                        <UploadCloud className="w-4 h-4" />
                                        <span>Ganti Gambar</span>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition duration-300">
                                        <UploadCloud className="w-4 h-4" />
                                    </div>
                                    <p className="text-[11px] font-bold text-slate-700">
                                        Seret & letakkan file gambar di sini, atau <span className="text-emerald-700 underline">jelajahi</span>
                                    </p>
                                    <p className="text-[9px] text-slate-400">PNG, JPG, WEBP (Maks. 2MB)</p>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Deskripsi Singkat (Diperbesar menjadi rows={4}) */}
                    <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">Deskripsi Singkat Destinasi</label>
                        <textarea
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Tuliskan deskripsi menarik mengenai keindahan destinasi ini..."
                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:bg-white focus:ring-2 focus:ring-emerald-600 outline-none transition resize-y"
                        />
                    </div>

                    {/* Footer Tombol Aksi */}
                    <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-slate-100 mt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-xs font-bold text-white shadow-md shadow-emerald-700/20 transition flex items-center gap-1.5"
                        >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Simpan</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}