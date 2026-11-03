'use client';

import { useState } from 'react';
import { Package, Edit, Trash2, ChevronLeft, ChevronRight, Loader2, AlertTriangle, Layers } from 'lucide-react';
import { getBackendUrl } from '@/app/lib/backend-url';
import StockUpdateModal from './StockUpdateModal';

interface ProductTableProps {
    products: any[];
    loading: boolean;
    onEdit: (product: any) => void;
    onDelete: (id: number) => void;
    onSuccess: () => void;
    totalCount: number;
}

export default function ProductTable({
    products,
    loading,
    onEdit,
    onDelete,
    onSuccess,
    totalCount,
}: ProductTableProps) {
    const [expandedRowId, setExpandedRowId] = useState<number | null>(null);
    const [activeImageIndexes, setActiveImageIndexes] = useState<{ [key: number]: number }>({});
    const [deleteId, setDeleteId] = useState<number | null>(null);
    
    const [stockModalProduct, setStockModalProduct] = useState<any | null>(null);

    const toggleRow = (id: number) => {
        if (expandedRowId === id) {
            setExpandedRowId(null);
        } else {
            setExpandedRowId(id);
            if (activeImageIndexes[id] === undefined) {
                setActiveImageIndexes(prev => ({ ...prev, [id]: 0 }));
            }
        }
    };

    const handleSelectImage = (productId: number, imgIndex: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setActiveImageIndexes(prev => ({ ...prev, [productId]: imgIndex }));
    };

    const confirmDelete = () => {
        if (deleteId !== null) {
            onDelete(deleteId);
            setDeleteId(null);
        }
    };

    const BACKEND_URL = getBackendUrl();

    if (loading) {
        return (
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xs">
                <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-2">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                    <span className="text-xs font-semibold">Memuat katalog produk...</span>
                </div>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xs">
                <div className="text-center py-16 text-gray-400 text-xs">
                    Belum ada produk terdaftar atau produk tidak ditemukan.
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-700">
                    <thead className="bg-slate-50 uppercase tracking-wider text-slate-400 font-semibold border-b border-gray-100">
                        <tr>
                            <th className="py-3.5 px-4 rounded-l-xl">Produk</th>
                            <th className="py-3.5 px-4">Harga Jual</th>
                            <th className="py-3.5 px-4">Bagi Hasil UMKM</th>
                            <th className="py-3.5 px-4">Stok (Sisa / Awal)</th>
                            <th className="py-3.5 px-4">Status</th>
                            <th className="py-3.5 px-4 text-right rounded-r-xl">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {products.map((item) => {
                            const isExpanded = expandedRowId === item.id;
                            const currentImgIdx = activeImageIndexes[item.id] || 0;

                            return (
                                <tr key={`row-group-${item.id}`} className="contents">
                                    {/* Baris Utama Produk */}
                                    <tr 
                                        onClick={() => toggleRow(item.id)}
                                        className={`transition cursor-pointer group ${isExpanded ? 'bg-indigo-50/40' : 'hover:bg-slate-50/60'}`}
                                        title="Klik untuk melihat detail di bawah"
                                    >
                                        <td className="py-4 px-4 font-bold text-gray-900 flex items-center gap-3">
                                            <div className="w-11 h-11 bg-gray-100 rounded-2xl flex items-center justify-center border border-gray-200 overflow-hidden shrink-0 shadow-inner">
                                               {item.images && item.images.length > 0 ? (
                                                <img 
                                                    src={`${BACKEND_URL}/storage/${item.images[0].image_path}`} 
                                                    alt={item.name} 
                                                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                                />
                                            ) : (
                                                <Package className="w-5 h-5 text-gray-400" />
                                            )}
                                            </div>
                                            <div>
                                                <span className="max-w-xs truncate block group-hover:text-indigo-600 transition">{item.name}</span>
                                                <span className="text-[10px] text-gray-400 font-normal">
                                                    {isExpanded ? 'Tutup detail ▲' : 'Klik untuk lihat detail ▼'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 font-semibold text-gray-900">Rp {Number(item.price).toLocaleString('id-ID')}</td>
                                        <td className="py-4 px-4 font-bold text-emerald-600">Rp {Number(item.umkm_share_amount).toLocaleString('id-ID')}</td>
                                        <td className="py-4 px-4">
                                            <div className="flex flex-col">
                                                <span className={`font-bold ${
                                                    item.stock <= 5 ? 'text-amber-700' : 'text-gray-900'
                                                }`}>
                                                    {item.stock} Pcs <span className="text-[10px] font-normal text-gray-400">(Sisa)</span>
                                                </span>
                                                <span className="text-[10px] text-gray-500">
                                                    Awal: {item.initial_stock || item.stock} Pcs
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                item.stock <= 5 
                                                    ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                                                    : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                            }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${item.stock <= 5 ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                                                {item.stock <= 5 ? 'Stok Menipis' : 'Aman'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-right space-x-1.5" onClick={(e) => e.stopPropagation()}>
                                            <button 
                                                onClick={() => setStockModalProduct(item)}
                                                className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 font-semibold rounded-md transition inline-flex items-center gap-1 cursor-pointer border border-amber-200 shadow-xs"
                                                title="Update Stok Cepat / Restock"
                                            >
                                                <Layers className="w-3 h-3" />
                                            </button>
                                            <button 
                                                onClick={() => onEdit(item)}
                                                className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-semibold rounded-md transition inline-flex items-center gap-1 cursor-pointer border border-indigo-200 shadow-xs"
                                                title="Edit Produk"
                                            >
                                                <Edit className="w-3 h-3" /> 
                                            </button>
                                            <button 
                                                onClick={() => setDeleteId(item.id)}
                                                className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold rounded-md transition inline-flex items-center gap-1 border border-rose-200 cursor-pointer shadow-xs"
                                                title="Hapus Produk"
                                            >
                                                <Trash2 className="w-3 h-3" /> 
                                            </button>
                                        </td>
                                    </tr>

                                    {/* Baris Detail Terintegrasi di Bawahnya */}
                                    {isExpanded && (
                                        <tr key={`detail-${item.id}`} className="bg-slate-50/80 border-b border-gray-200">
                                            <td colSpan={6} className="p-5">
                                                <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
                                                    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                                                        <h4 className="font-extrabold text-gray-900 text-xs flex items-center gap-2">
                                                            <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                                                            Informasi Detail: {item.name}
                                                        </h4>
                                                        <button 
                                                            onClick={() => setExpandedRowId(null)}
                                                            className="text-gray-400 hover:text-gray-600 font-bold text-[11px] cursor-pointer"
                                                        >
                                                            Tutup [✕]
                                                        </button>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                        <div className="space-y-2">
                                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Galeri Foto</span>
                                                            {item.images && item.images.length > 0 ? (
                                                                <div className="space-y-2">
                                                                    <div className="w-full h-44 rounded-xl overflow-hidden border border-gray-200 bg-gray-100 shadow-inner">
                                                                        <img 
                                                                            src={`${BACKEND_URL}/storage/${item.images[currentImgIdx]?.image_path}`} 
                                                                            alt={item.name} 
                                                                            className="w-full h-full object-cover"
                                                                        />
                                                                    </div>
                                                                    {item.images.length > 1 && (
                                                                        <div className="grid grid-cols-4 gap-1.5">
                                                                            {item.images.map((img: any, idx: number) => (
                                                                               <button
                                                                                key={idx}
                                                                                onClick={(e) => handleSelectImage(item.id, idx, e)}
                                                                                className={`relative aspect-square rounded-lg overflow-hidden border-2 transition cursor-pointer ${
                                                                                    currentImgIdx === idx ? 'border-indigo-600 ring-2 ring-indigo-500/20' : 'border-gray-200 opacity-60 hover:opacity-100'
                                                                                }`}
                                                                               >
                                                                                    <img src={`${BACKEND_URL}/storage/${img.image_path}`} alt="Thumb" className="w-full h-full object-cover" />
                                                                               </button>
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <div className="w-full h-32 bg-gray-100 rounded-xl flex flex-col items-center justify-center text-gray-400 gap-1 border border-gray-200">
                                                                    <Package className="w-6 h-6" />
                                                                    <span className="text-[10px]">Tidak ada foto</span>
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="md:col-span-2 space-y-3">
                                                            <div>
                                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Deskripsi Produk</span>
                                                                <p className="text-gray-700 bg-gray-50 p-3.5 rounded-xl mt-1 leading-relaxed border border-gray-100 text-xs">
                                                                    {item.description || 'Tidak ada deskripsi yang ditambahkan untuk produk ini.'}
                                                                </p>
                                                            </div>

                                                            {/* Kotak Ringkasan Stok (Menampilkan Stok Awal & Sisa Stok) */}
                                                            <div className="grid grid-cols-3 gap-3 pt-1">
                                                                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                                                    <span className="text-[10px] font-bold text-gray-400 block">Stok Awal Titipan</span>
                                                                    <span className="text-sm font-extrabold text-gray-900">{item.initial_stock || item.stock} Pcs</span>
                                                                </div>
                                                                <div className="bg-indigo-50/50 p-3 rounded-xl border border-indigo-100">
                                                                    <span className="text-[10px] font-bold text-indigo-600 block">Sisa Stok Berjalan</span>
                                                                    <span className="text-sm font-extrabold text-indigo-700">{item.stock} Pcs</span>
                                                                </div>
                                                                <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                                                                    <span className="text-[10px] font-bold text-emerald-600 block">Hak UMKM / Pcs</span>
                                                                    <span className="text-sm font-extrabold text-emerald-600">Rp {Number(item.umkm_share_amount).toLocaleString('id-ID')}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Pagination Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-gray-100 gap-3 text-xs text-gray-500">
                <p>Menampilkan {products.length} dari {totalCount} data produk</p>
                <div className="flex items-center gap-1">
                    <button className="w-8 h-8 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-600 transition cursor-pointer disabled:opacity-40" disabled>
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center shadow-md shadow-indigo-600/20">
                        1
                    </button>
                    <button className="w-8 h-8 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-600 transition cursor-pointer" disabled>
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* MODAL UPDATE STOK CEPAT */}
            <StockUpdateModal 
                product={stockModalProduct}
                isOpen={stockModalProduct !== null}
                onClose={() => setStockModalProduct(null)}
                onSuccess={onSuccess}
            />

            {/* MODAL KONFIRMASI HAPUS */}
            {deleteId !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
                    <div className="bg-white border border-gray-100 rounded-3xl w-full max-w-sm p-6 space-y-5 shadow-2xl text-center">
                        <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto border border-rose-100 shadow-inner">
                            <AlertTriangle className="w-7 h-7" />
                        </div>
                        <div className="space-y-1.5">
                            <h3 className="text-base font-extrabold text-gray-900">Hapus Produk Ini?</h3>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                Tindakan ini bersifat permanen dan data produk yang dihapus tidak dapat dikembalikan.
                            </p>
                        </div>
                        <div className="flex gap-2.5 pt-2">
                            <button 
                                onClick={() => setDeleteId(null)}
                                className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition cursor-pointer text-xs"
                            >
                                Batal
                            </button>
                            <button 
                                onClick={confirmDelete}
                                className="flex-1 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold transition shadow-lg shadow-rose-600/20 cursor-pointer text-xs"
                            >
                                Ya, Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}