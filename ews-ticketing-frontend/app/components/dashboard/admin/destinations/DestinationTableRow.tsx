'use client';

import React, { useMemo } from 'react';
import { Edit, Trash2, CheckCircle2, AlertTriangle, ImageIcon, Layers, ChevronDown, ChevronUp, MapPin } from 'lucide-react';

interface DestinationItem {
    id: number;
    name: string;
    type_entry?: 'destination' | 'package';
    type: string;
    price: number;
    umkm_revenue_share?: number;
    quota: number;
    status: 'Aktif' | 'Darurat Ditutup';
    description?: string;
    image_url?: string;
    image_files?: File[];
    images?: { id: number; image_url: string }[];
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
    
   // Helper untuk mengambil base URL backend dari .env.local secara aman
    const getFullImageUrl = (url?: string) => {
        if (!url) return '';
        if (url.startsWith('blob:') || url.startsWith('http://') || url.startsWith('https://')) {
            return url;
        }

        // Mengambil dari .env.local, hilangkan trailing slash jika ada agar tidak double slash
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000';
        
        return `${backendUrl}${url.startsWith('/') ? '' : '/'}${url}`;
    };

    // Gunakan useMemo agar URL objek stabil dan tidak dibuat ulang secara acak saat re-render
    const allImages = useMemo(() => {
        const urls: string[] = [];
        if (item.image_url) {
            urls.push(getFullImageUrl(item.image_url));
        }
        if (item.images && item.images.length > 0) {
            item.images.forEach(img => {
                if (img.image_url) {
                    const formattedUrl = getFullImageUrl(img.image_url);
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

    return (
        <>
            {/* Baris Utama Tabel */}
            <tr 
                onClick={() => onToggleExpand(item.id)}
                className={`transition cursor-pointer group ${
                    isExpanded ? 'bg-emerald-50/40' : 'hover:bg-slate-50/60'
                }`}
                title="Klik untuk melihat detail & galeri di bawah"
            >
                <td className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 overflow-hidden relative flex-shrink-0 border border-slate-200 shadow-sm">
                            {allImages.length > 0 ? (
                                <>
                                    <img src={allImages[0]} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
                                    {allImages.length > 1 && (
                                        <div className="absolute inset-0 bg-slate-950/50 flex items-center justify-center text-white text-[10px] font-bold">
                                            +{allImages.length - 1}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400">
                                    <ImageIcon className="w-5 h-5" />
                                </div>
                            )}
                        </div>
                        <div>
                            <span className="font-bold text-slate-900 block max-w-[200px] truncate" title={item.name}>
                                {item.name}
                            </span>
                            <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                                ID: #{item.id} • {allImages.length} Foto
                                {isExpanded ? <ChevronUp className="w-3 h-3 text-emerald-600 ml-1" /> : <ChevronDown className="w-3 h-3 text-slate-400 ml-1" />}
                            </span>
                        </div>
                    </div>
                </td>

                <td className="p-4">
                    <div className="space-y-1">
                        <span className={`px-2 py-0.5 rounded-md font-bold text-[9px] uppercase inline-block ${
                            item.type_entry === 'package' 
                                ? 'bg-emerald-100 text-emerald-800' 
                                : 'bg-blue-100 text-blue-800'
                        }`}>
                            {item.type_entry === 'package' ? 'Paket Bundling UMKM' : 'Tiket Murni'}
                        </span>
                        <p className="text-slate-600 font-medium text-[11px]">{item.type}</p>
                    </div>
                </td>

                <td className="p-4">
                    <div className="space-y-0.5">
                        <span className="font-extrabold text-emerald-700 text-xs block">
                            Rp {item.price?.toLocaleString('id-ID')}
                        </span>
                        {item.type_entry === 'package' && item.umkm_revenue_share ? (
                            <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                                <Layers className="w-3 h-3" />
                                UMKM: Rp {Number(item.umkm_revenue_share).toLocaleString('id-ID')}
                            </span>
                        ) : null}
                    </div>
                </td>

                <td className="p-4 font-medium">{item.quota} Orang</td>

                <td className="p-4">
                    <span className={`px-3 py-1 rounded-full font-bold text-[10px] uppercase inline-flex items-center gap-1 ${
                        item.status === 'Aktif' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : 'bg-red-50 text-red-700 border border-red-200 animate-pulse'
                    }`}>
                        {item.status === 'Aktif' ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                        {item.status}
                    </span>
                </td>

                <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-center gap-1.5">
                        <button
                            onClick={() => onToggleStatus(item.id)}
                            title="Ubah Status Darurat EWS"
                            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition shadow-sm ${
                                item.status === 'Aktif'
                                    ? 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                                    : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                            }`}
                        >
                            {item.status === 'Aktif' ? 'Tutup Darurat' : 'Buka Normal'}
                        </button>
                        <button 
                            onClick={() => onEdit(item)}
                            className="p-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-emerald-50 hover:text-emerald-700 transition"
                            title="Edit Data"
                        >
                            <Edit className="w-4 h-4" />
                        </button>
                        <button 
                            onClick={(e) => onDeleteClick(item, e)}
                            className="p-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-red-50 hover:text-red-600 transition"
                            title="Hapus"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </td>
            </tr>

            {/* Baris Detail Expandable di Bawah (Multi Galeri & Deskripsi) */}
            {isExpanded && (
                <tr className="bg-slate-50/80 border-b border-slate-200">
                    <td colSpan={6} className="p-5">
                        <div className="space-y-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-inner">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                                        <MapPin className="w-3.5 h-3.5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-xs">Detail & Galeri Foto: {item.name}</h4>
                                        <p className="text-[10px] text-slate-500">Lokasi: {item.type}</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={onCloseDetail}
                                    className="text-slate-400 hover:text-slate-600 text-[11px] font-bold px-2.5 py-1 bg-slate-100 rounded-lg transition"
                                >
                                    Tutup Detail ▲
                                </button>
                            </div>

                            {/* Deskripsi */}
                            <div>
                                <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Deskripsi / Fasilitas</h5>
                                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                                    {item.description || 'Tidak ada deskripsi tambahan untuk item ini.'}
                                </p>
                            </div>

                            {/* Grid Galeri Multi-Foto */}
                            <div>
                                <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                                    Galeri Foto ({allImages.length} Foto Tersedia)
                                </h5>
                                {allImages.length > 0 ? (
                                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
                                        {allImages.map((src, idx) => (
                                            <div key={`${src}-${idx}`} className="relative h-24 rounded-xl overflow-hidden border border-slate-200 shadow-sm group">
                                                <img src={src} alt={`Galeri ${idx}`} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                                                <span className="absolute bottom-1 right-1 bg-slate-900/60 text-white text-[9px] px-1.5 py-0.5 rounded font-bold">
                                                    #{idx + 1}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-xs text-slate-400 italic">Belum ada foto galeri yang diunggah untuk item ini.</p>
                                )}
                            </div>
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
}