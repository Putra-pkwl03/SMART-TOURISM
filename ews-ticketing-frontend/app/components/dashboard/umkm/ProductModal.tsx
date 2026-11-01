'use client';

import { useState, useEffect } from 'react';
import { X, Loader2, Tag, DollarSign, Package, FileText, Sparkles } from 'lucide-react';
import { apiClient } from '@/app/lib/axios';
import { toast } from 'sonner';
import ProductImageUploader from './ProductImageUploader';

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    productToEdit?: any | null;
}

export default function ProductModal({ isOpen, onClose, onSuccess, productToEdit }: ProductModalProps) {
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [umkmShareAmount, setUmkmShareAmount] = useState('');
    
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    // Menyimpan ID gambar lama yang dihapus agar backend tahu gambar mana yang harus di-delete
    const [removedImageIds, setRemovedImageIds] = useState<number[]>([]);

    useEffect(() => {
        if (productToEdit) {
            setName(productToEdit.name || '');
            setDescription(productToEdit.description || '');
            setPrice(productToEdit.price || '');
            setStock(productToEdit.stock || '');
            setUmkmShareAmount(productToEdit.umkm_share_amount || '');
            
            if (productToEdit.images && productToEdit.images.length > 0) {
                // Simpan objek gambar asli beserta URL-nya untuk pelacakan ID
                const existingPreviews = productToEdit.images.map(
                    (img: any) => `http://127.0.0.1:8000/storage/${img.image_path}`
                );
                setImagePreviews(existingPreviews);
            } else {
                setImagePreviews([]);
            }
            
            setImageFiles([]);
            setRemovedImageIds([]);
        } else {
            setName('');
            setDescription('');
            setPrice('');
            setStock('');
            setUmkmShareAmount('');
            setImageFiles([]);
            setImagePreviews([]);
            setRemovedImageIds([]);
        }
    }, [productToEdit, isOpen]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const filesArray = Array.from(e.target.files);
        
        setImageFiles((prev) => [...prev, ...filesArray]);

        const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
        setImagePreviews((prev) => [...prev, ...newPreviews]);
    };

    const handleRemoveImage = (index: number) => {
        const targetPreview = imagePreviews[index];

        // Jika gambar yang dihapus adalah gambar lama dari database (bukan berformat blob:)
        if (productToEdit && productToEdit.images && !targetPreview.startsWith('blob:')) {
            // Cari tahu gambar lama ke-berapa yang dihapus
            const oldImagesCount = productToEdit.images.length;
            // Hitung index relatif terhadap gambar lama
            const matchedImage = productToEdit.images[index];
            if (matchedImage) {
                setRemovedImageIds((prev) => [...prev, matchedImage.id]);
            }
        } else if (targetPreview.startsWith('blob:')) {
            // Jika itu gambar baru yang di-upload lokal
            // Hitung posisi file baru di dalam array imageFiles
            const oldImagesCount = (productToEdit?.images || []).length;
            const existingRemovedOldCount = removedImageIds.length; // Estimasi
            const fileIndex = index - (imagePreviews.filter(p => !p.startsWith('blob:')).length);
            
            if (fileIndex >= 0 && fileIndex < imageFiles.length) {
                setImageFiles((prev) => prev.filter((_, i) => i !== fileIndex));
            }
            URL.revokeObjectURL(targetPreview);
        }

        // Hapus dari preview tampilan
        setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    };

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('umkm_id', '1'); 
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('stock', stock);
        formData.append('umkm_share_amount', umkmShareAmount);

        // Lampirkan file gambar baru
        imageFiles.forEach((file) => {
            formData.append('images[]', file);
        });

        // Lampirkan ID gambar lama yang dihapus (jika backend mendukung penghapusan via array ID)
        removedImageIds.forEach((id) => {
            formData.append('removed_image_ids[]', id.toString());
        });

        try {
            if (productToEdit) {
                await apiClient.post(`/umkm/products/${productToEdit.id}`, formData);
                toast.success('Produk berhasil diperbarui!');
            } else {
                await apiClient.post('/umkm/products', formData);
                toast.success('Produk berhasil ditambahkan!');
            }
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error("Error:", error);
            toast.error(error.response?.data?.message || 'Gagal menyimpan produk.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-hidden">
            <div className="bg-white border border-gray-100 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                
                {/* Header Dekoratif Varian Warna (green & Slate - Tidak Terlalu Biru) */}
                <div className="relative bg-slate-50 p-5 text-white flex-shrink-0">
                    <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-32 h-32 bg-green-500/10 rounded-full blur-2xl pointer-events-none"></div>
                    <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
                                <Sparkles className="w-5 h-5 text-green-500" />
                            </div>
                            <div>
                                <h3 className="text-base font-extrabold tracking-tight text-black">
                                    {productToEdit ? 'Edit Produk Konsinyasi' : 'Tambah Produk & Hampers Baru'}
                                </h3>
                                <p className="text-[11px] text-green-800 mt-0.5">
                                    Lengkapi informasi produk atau hampers UMKM Sedyo Maju
                                </p>
                            </div>
                        </div>
                        <button 
                            onClick={onClose} 
                            className="w-8 h-8  hover:text-gray-700 flex items-center justify-center text-gray-500 transition cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-300">
                    
                    {/* Nama Produk */}
                    <div>
                        <label className="block text-gray-700 font-bold mb-1.5 flex items-center gap-1.5">
                            <Tag className="w-3.5 h-3.5 text-green-600" />
                            <span>Nama Produk / Hampers <span className="text-rose-500">*</span></span>
                        </label>
                        <input 
                            type="text" 
                            required 
                            value={name} 
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Contoh: Lempeng Karak Khas Ngoro-Oro"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition"
                        />
                    </div>

                    {/* Harga Jual & Bagi Hasil */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-gray-700 font-bold mb-1.5 flex items-center gap-1.5">
                                <DollarSign className="w-3.5 h-3.5 text-green-600" />
                                <span>Harga Jual (Rp) <span className="text-rose-500">*</span></span>
                            </label>
                            <div className="relative">
                                <input 
                                    type="number" 
                                    required 
                                    value={price} 
                                    onChange={(e) => setPrice(e.target.value)}
                                    placeholder="15000"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-3.5 pr-10 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition"
                                />
                                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">Rp</span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-gray-700 font-bold mb-1.5 flex items-center gap-1.5">
                                <DollarSign className="w-3.5 h-3.5 text-amber-600" />
                                <span>Porsi Bagi Hasil UMKM (Rp) <span className="text-rose-500">*</span></span>
                            </label>
                            <div className="relative">
                                <input 
                                    type="number" 
                                    required 
                                    value={umkmShareAmount} 
                                    onChange={(e) => setUmkmShareAmount(e.target.value)}
                                    placeholder="12000"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-3.5 pr-10 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition"
                                />
                                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">Rp</span>
                            </div>
                        </div>
                    </div>

                    {/* Stok Awal */}
                    <div>
                        <label className="block text-gray-700 font-bold mb-1.5 flex items-center gap-1.5">
                            <Package className="w-3.5 h-3.5 text-green-600" />
                            <span>Stok Awal <span className="text-rose-500">*</span></span>
                        </label>
                        <input 
                            type="number" 
                            required 
                            value={stock} 
                            onChange={(e) => setStock(e.target.value)}
                            placeholder="30"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition"
                        />
                    </div>

                    {/* Deskripsi */}
                    <div>
                        <label className="block text-gray-700 font-bold mb-1.5 flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5 text-green-600" />
                            <span>Deskripsi Produk</span>
                        </label>
                        <textarea 
                            rows={2}
                            value={description} 
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Jelaskan bahan, cita rasa, dan keunggulan produk..."
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition resize-none"
                        />
                    </div>

                    {/* Komponen Uploader Terpisah */}
                    <ProductImageUploader 
                        imagePreviews={imagePreviews}
                        onImageChange={handleImageChange}
                        onRemoveImage={handleRemoveImage}
                    />

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-3 border-t border-gray-100 flex-shrink-0">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl font-semibold transition cursor-pointer"
                        >
                            Batal
                        </button>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="flex items-center rounded-2xl gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white shadow-lg shadow-emerald-600/25 transition-all  transform active:scale-95 disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                            <span>Simpan Data</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}