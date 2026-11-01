'use client';

import React, { useMemo } from 'react';
import { 
    Edit2, 
    Trash2, 
    AlertTriangle, 
    ImageIcon, 
    ChevronUp, 
    ChevronDown, 
    MapPin, 
    Package, 
    FileText,
    Boxes,
    Info
} from 'lucide-react';

export interface UmkmProduct {
    id: number;
    name: string;
    price: number;
    image_url?: string;
    image_path?: string;
    image?: string;
    images?: any[];
}

export interface DestinationImage {
    id: number;
    image_url?: string;
    image_path?: string;
    is_primary?: boolean;
}

export interface DestinationItem {
    id: number;
    name: string;
    type_entry: string;
    type: string;
    price: number;
    quota: number;
    status: 'Aktif' | 'Darurat Ditutup';
    description?: string;
    image_url?: string;
    images?: DestinationImage[];
    image_files?: File[];
    umkm_products?: UmkmProduct[];
    umkm_revenue_share?: number;
}

interface DestinationTableRowProps {
    item: DestinationItem;
    isExpanded: boolean;
    onToggleExpand: (id: number) => void;
    onToggleStatus: (id: number) => void;
    onEdit: (item: DestinationItem) => void;
    onDeleteClick: (item: DestinationItem, e: React.MouseEvent) => void;
    onCloseDetail: () => void;
}

export default function DestinationTableRow({
    item,
    isExpanded,
    onToggleExpand,
    onToggleStatus,
    onEdit,
    onDeleteClick,
    onCloseDetail,
}: DestinationTableRowProps) {
    
    const getFullImageUrl = (url?: string) => {
        if (!url) return '';
        if (url.startsWith('blob:') || url.startsWith('http://') || url.startsWith('https://')) {
            return url;
        }
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000';
        const cleanPath = url.startsWith('/') ? url : `/${url}`;
        const finalPath = cleanPath.startsWith('/storage') ? cleanPath : `/storage/${url.replace(/^\/+/, '')}`;
        return `${backendUrl}${finalPath}`;
    };

    // Helper untuk mengambil gambar produk UMKM dari relasi images Laravel
    const getProductImageUrl = (prod: UmkmProduct & { images?: { image_url?: string; image_path?: string }[] }) => {
        if (!prod) return '';
        
        if (prod.images && prod.images.length > 0) {
            const primaryImg = prod.images.find((img: any) => img.is_primary) || prod.images[0];
            const rawPath = primaryImg.image_url || primaryImg.image_path || '';
            return getFullImageUrl(rawPath);
        }

        const rawPath = prod.image_url || prod.image_path || prod.image || '';
        return getFullImageUrl(rawPath);
    };

    const allImages = useMemo(() => {
        const urls: string[] = [];
        if (item.image_url) {
            urls.push(getFullImageUrl(item.image_url));
        }
        if (item.images && item.images.length > 0) {
            item.images.forEach(img => {
                const targetUrl = img.image_url || img.image_path;
                if (targetUrl) {
                    const formattedUrl = getFullImageUrl(targetUrl);
                    if (!urls.includes(formattedUrl)) {
                        urls.push(formattedUrl);
                    }
                }
            });
        }
        if (item.image_files && item.image_files.length > 0) {
            item.image_files.forEach(file => {
                urls.push(URL.createObjectURL(file));
            });
        }
        return urls;
    }, [item.image_url, item.images, item.image_files]);

    const isActive = item.status === 'Aktif';
    const totalUmkmProducts = item.umkm_products?.length || 0;
    const isBundling = totalUmkmProducts > 0;

    return (
        <>
            {/* Baris Utama Tabel */}
            <tr 
                onClick={() => onToggleExpand(item.id)}
                className={`transition cursor-pointer group ${
                    isExpanded ? 'bg-emerald-50/40' : 'hover:bg-slate-50/60'
                }`}
            >
                <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden relative flex-shrink-0 border border-slate-200">
                            {allImages.length > 0 ? (
                                <img src={allImages[0]} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400">
                                    <ImageIcon className="w-5 h-5" />
                                </div>
                            )}
                        </div>
                        <div>
                            <div className="font-bold text-slate-900 text-sm">{item.name}</div>
                            <div className="text-[11px] text-slate-400 mt-0.5">Paket Wisata (Klik untuk detail)</div>
                        </div>
                    </div>
                </td>

                <td className="py-4 px-4">
                    <div className="space-y-1">
                        {isBundling ? (
                            <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wide">
                                PAKET BUNDLING UMKM
                            </span>
                        ) : (
                            <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 uppercase tracking-wide border border-slate-200">
                                PAKET WISATA BIASA
                            </span>
                        )}
                        <div className="text-slate-500 text-[11px] font-medium">
                            {item.type}
                        </div>
                    </div>
                </td>

                <td className="py-4 px-4">
                    <div className="font-bold text-slate-900 text-sm">
                        Rp {item.price?.toLocaleString('id-ID')}
                    </div>
                </td>

                <td className="py-4 px-4 font-medium text-slate-600">
                    {item.quota} Orang
                </td>

                <td className="py-4 px-4">
                    {isActive ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                            Aktif
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-red-50 text-red-700 border border-red-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                            Darurat Ditutup
                        </span>
                    )}
                </td>

                <td className="py-4 px-5 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                        <button
                            onClick={() => onToggleStatus(item.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition border cursor-pointer ${
                                isActive 
                                    ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200' 
                                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
                            }`}
                            title="Ubah Status Darurat EWS"
                        >
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                            <span>{isActive ? 'Tutup Darurat' : 'Buka Normal'}</span>
                        </button>

                        <button
                            onClick={() => onEdit(item)}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition cursor-pointer"
                            title="Edit Destinasi"
                        >
                            <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                            onClick={(e) => onDeleteClick(item, e)}
                            className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition cursor-pointer"
                            title="Hapus Destinasi"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>

                        <button
                            onClick={() => onToggleExpand(item.id)}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition cursor-pointer ml-1"
                            title={isExpanded ? "Sembunyikan Detail" : "Lihat Detail"}
                        >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                    </div>
                </td>
            </tr>

            {/* Bagian Detail Accordion (Expandable) dengan Layout Modern Grid Samping-Sampingan */}
            {isExpanded && (
                <tr className="bg-slate-50/80">
                    <td colSpan={6} className="p-5">
                        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
                            
                            {/* Header Informasi & Tombol Sembunyikan */}
                            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                                    Detail Informasi ({isBundling ? 'Paket Bundling UMKM' : 'Paket Wisata Biasa'})
                                </h3>
                                
                                <button 
                                    onClick={onCloseDetail}
                                    className="text-xs text-slate-500 hover:text-slate-800 font-semibold flex items-center gap-1.5 transition px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 cursor-pointer"
                                >
                                    <span>Sembunyikan</span>
                                    <span>✕</span>
                                </button>
                            </div>

                            {/* Layout 3 Card Berjajar Horizontal */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                
                                {/* Card 1: Lokasi Destinasi */}
                                <div className="flex items-start gap-3 p-4 bg-slate-50/60 rounded-xl border border-slate-100 shadow-xs">
                                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg mt-0.5 border border-emerald-100 flex-shrink-0">
                                        <MapPin className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Lokasi Destinasi</h4>
                                        <p className="text-xs font-semibold text-slate-800 mt-0.5">{item.type}</p>
                                    </div>
                                </div>

                                {/* Card 2: Status Bundling / Jumlah Produk */}
                                <div className="flex items-start gap-3 p-4 bg-slate-50/60 rounded-xl border border-slate-100 shadow-xs">
                                    <div className={`p-2 rounded-lg mt-0.5 border flex-shrink-0 ${isBundling ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                                        {isBundling ? <Boxes className="w-4 h-4" /> : <Info className="w-4 h-4" />}
                                    </div>
                                    <div>
                                        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Jenis Paket</h4>
                                        <p className="text-xs font-semibold text-slate-800 mt-0.5">
                                            {isBundling ? `${totalUmkmProducts} Produk UMKM Terdaftar` : 'Paket Wisata Biasa (Tanpa Produk)'}
                                        </p>
                                    </div>
                                </div>

                                {/* Card 3: Deskripsi & Fasilitas */}
                                <div className="flex items-start gap-3 p-4 bg-slate-50/60 rounded-xl border border-slate-100 shadow-xs">
                                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg mt-0.5 border border-emerald-100 flex-shrink-0">
                                        <FileText className="w-4 h-4" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Deskripsi & Fasilitas</h4>
                                        <p className="text-xs text-slate-700 mt-0.5 leading-relaxed line-clamp-3">
                                            {item.description || 'Belum ada deskripsi yang ditambahkan.'}
                                        </p>
                                    </div>
                                </div>

                            </div>

                            {/* Produk UMKM dalam Paket (Hanya muncul jika ada produknya) */}
                            {isBundling && (
                                <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-100 space-y-3">
                                    <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                                        <Package className="w-4 h-4 text-emerald-700" />
                                        <span>Produk UMKM dalam Paket</span>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                        {item.umkm_products!.map((prod) => {
                                            const prodImgUrl = getProductImageUrl(prod);
                                            return (
                                                <div key={prod.id} className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-emerald-100 shadow-xs">
                                                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
                                                        {prodImgUrl ? (
                                                            <img src={prodImgUrl} alt={prod.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                                <ImageIcon className="w-4 h-4" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-slate-800 text-xs">{prod.name}</div>
                                                        <div className="text-[11px] font-semibold text-emerald-700 mt-0.5">
                                                            Rp {Number(prod.price)?.toLocaleString('id-ID')}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Galeri Foto Destinasi */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-slate-800 font-bold text-xs">
                                        <ImageIcon className="w-4 h-4 text-slate-600" />
                                        <span>Galeri Foto Destinasi</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                    {allImages.length > 0 ? (
                                        allImages.map((src, idx) => (
                                            <div key={idx} className="h-28 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 relative group">
                                                <img src={src} alt={`Galeri ${idx}`} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-xs text-slate-400 italic">Tidak ada foto galeri tambahan.</p>
                                    )}
                                </div>
                            </div>

                        </div>
                    </td>
                </tr>
            )}
        </>
    );
}