import React, { useRef } from 'react';
import { UploadCloud, Trash2 } from 'lucide-react';

interface DestinationImageUploaderProps {
    entryType: 'destination' | 'package';
    imagePreviews: string[];
    isDragging: boolean;
    setIsDragging: (val: boolean) => void;
    onFilesChange: (files: FileList | File[]) => void;
    onRemoveImage: (index: number) => void;
}

export default function DestinationImageUploader({
    entryType,
    imagePreviews,
    isDragging,
    setIsDragging,
    onFilesChange,
    onRemoveImage,
}: DestinationImageUploaderProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDropUpload = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            onFilesChange(e.dataTransfer.files);
        }
    };

    return (
        <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center justify-between">
                <span>{entryType === 'package' ? 'Foto Utama Paket Wisata (Banner)' : 'Galeri Foto Destinasi'}</span>
                <span className="text-[10px] text-emerald-600 font-bold">{imagePreviews.length} Foto</span>
            </label>
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={(e) => e.target.files && onFilesChange(e.target.files)} 
                accept="image/*" 
                multiple={entryType === 'destination'} 
                className="hidden" 
            />

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-2">
                {imagePreviews.map((src, index) => (
                    <div key={index} className="relative h-20 rounded-2xl overflow-hidden border border-slate-200 group shadow-sm bg-slate-100">
                        <img src={src} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                        <div className="absolute top-1 left-1 bg-slate-900/70 text-white text-[9px] px-1.5 py-0.5 rounded-md font-bold">
                            {index === 0 ? 'Foto Utama' : `#${index + 1}`}
                        </div>
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                                type="button"
                                onClick={() => onRemoveImage(index)}
                                className="p-1.5 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition shadow-md cursor-pointer"
                                title="Hapus foto"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}

                {(entryType === 'destination' || imagePreviews.length === 0) && (
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDropUpload}
                        className={`h-20 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all ${
                            isDragging ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-200 hover:border-emerald-400 bg-slate-50/50 text-slate-400 hover:text-emerald-600'
                        }`}
                    >
                        <UploadCloud className="w-4 h-4 mb-1" />
                        <span className="text-[10px] font-bold text-center px-1">
                            {entryType === 'package' ? 'Upload Foto' : 'Tambah Foto'}
                        </span>
                    </div>
                )}
            </div>
            {entryType === 'package' && (
                <p className="text-[11px] text-slate-500 italic">
                    *Untuk paket bundling, cukup upload 1 foto utama destinasi. Foto produk UMKM otomatis ditarik dari master data UMKM.
                </p>
            )}
        </div>
    );
}