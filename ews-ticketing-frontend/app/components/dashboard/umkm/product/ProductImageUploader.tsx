'use client';

import { Upload, Trash2, Image as ImageIcon } from 'lucide-react';

interface ProductImageUploaderProps {
    imagePreviews: string[];
    onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemoveImage: (index: number) => void;
}

export default function ProductImageUploader({
    imagePreviews,
    onImageChange,
    onRemoveImage,
}: ProductImageUploaderProps) {
    return (
        <div className="space-y-2">
            <label className="block text-gray-700 font-bold mb-1.5 flex items-center gap-1.5 text-xs">
                <ImageIcon className="w-3.5 h-3.5 text-green-600" />
                <span>Galeri Foto Produk (Bisa pilih banyak)</span>
            </label>
            
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 hover:border-green-500 rounded-2xl p-4 cursor-pointer bg-gray-50 hover:bg-green-50/30 transition group">
                <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-1.5 group-hover:scale-110 transition-transform">
                    <Upload className="w-4 h-4" />
                </div>
                <span className="text-gray-800 font-semibold text-xs">Klik untuk unggah foto produk</span>
                <span className="text-[10px] text-gray-400 mt-0.5">PNG, JPG, JPEG (Maks. 2MB per file)</span>
                <input 
                    type="file" 
                    multiple 
                    accept="image/*"
                    onChange={onImageChange} 
                    className="hidden" 
                />
            </label>

            {/* Grid Live Preview Gambar */}
            {imagePreviews.length > 0 && (
                <div className="mt-3 space-y-2">
                    <p className="text-[11px] font-semibold text-green-700">
                        Pratinjau Gambar ({imagePreviews.length} dipilih):
                    </p>
                    <div className="grid grid-cols-4 gap-2">
                        {imagePreviews.map((src, idx) => (
                            <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-100 shadow-sm">
                                <img src={src} alt="Preview" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button 
                                        type="button"
                                        onClick={() => onRemoveImage(idx)}
                                        className="w-7 h-7 bg-rose-600 text-white rounded-full flex items-center justify-center hover:bg-rose-700 transition shadow cursor-pointer"
                                        title="Hapus gambar"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                                {idx === 0 && (
                                    <span className="absolute bottom-1 left-1 bg-green-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                                        Utama
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}