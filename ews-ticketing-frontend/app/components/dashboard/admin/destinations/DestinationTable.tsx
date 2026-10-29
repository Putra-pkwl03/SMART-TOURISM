'use client';

import { useState } from 'react';
import { Edit, Trash2, CheckCircle2, AlertTriangle, Loader2, X, AlertOctagon, ImageIcon } from 'lucide-react';

interface DestinationItem {
    id: number;
    name: string;
    type: string;
    price: number;
    quota: number;
    status: 'Aktif' | 'Darurat Ditutup';
    description?: string;
    image_url?: string;
}

interface DestinationTableProps {
    destinations: DestinationItem[];
    loading: boolean;
    onToggleStatus: (id: number) => void;
    onEdit: (item: DestinationItem) => void;
    onDelete: (id: number) => void;
}

export default function DestinationTable({
    destinations,
    loading,
    onToggleStatus,
    onEdit,
    onDelete,
}: DestinationTableProps) {
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<DestinationItem | null>(null);

    const openDeleteModal = (item: DestinationItem) => {
        setItemToDelete(item);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (itemToDelete) {
            onDelete(itemToDelete.id);
            setDeleteModalOpen(false);
            setItemToDelete(null);
        }
    };

    return (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                    <h3 className="font-bold text-slate-900 text-sm">Daftar Destinasi & Paket Bundling Aktif</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Kelola informasi visual, harga, kuota, dan status EWS</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-bold text-xs">
                    {destinations.length} Item Terdaftar
                </span>
            </div>
            
            {loading ? (
                <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-2">
                    <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
                    <span className="text-xs">Memuat data dari server...</span>
                </div>
            ) : destinations.length === 0 ? (
                <div className="text-center py-16 text-slate-400 text-xs">
                    Belum ada data destinasi yang ditambahkan.
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                                <th className="p-4">Destinasi & Banner</th>
                                <th className="p-4">Deskripsi Singkat</th>
                                <th className="p-4">Kategori / Lokasi</th>
                                <th className="p-4">Harga Tiket</th>
                                <th className="p-4">Kuota</th>
                                <th className="p-4">Status EWS</th>
                                <th className="p-4 text-center">Aksi & Kontrol</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                            {destinations.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50/50 transition">
                                    {/* Kolom Nama & Gambar Thumbnail */}
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-100 overflow-hidden relative flex-shrink-0 border border-slate-200 shadow-sm">
                                                {item.image_url ? (
                                                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
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
                                                <span className="text-[10px] text-slate-400">ID: #{item.id}</span>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Kolom Deskripsi Singkat */}
                                    <td className="p-4 max-w-[220px]">
                                        <p className="text-slate-500 text-[11px] leading-relaxed line-clamp-2" title={item.description}>
                                            {item.description || 'Tidak ada deskripsi singkat.'}
                                        </p>
                                    </td>

                                    <td className="p-4 font-medium text-slate-600">{item.type}</td>

                                    <td className="p-4 font-extrabold text-emerald-700">
                                        Rp {item.price?.toLocaleString('id-ID')}
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

                                    {/* Kolom Aksi */}
                                    <td className="p-4 text-center">
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
                                                onClick={() => openDeleteModal(item)}
                                                className="p-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-red-50 hover:text-red-600 transition"
                                                title="Hapus"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal Konfirmasi Hapus */}
            {deleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm transition-opacity">
                    <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
                                <AlertOctagon className="w-5 h-5" />
                            </div>
                            <button 
                                onClick={() => setDeleteModalOpen(false)}
                                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <h3 className="text-base font-bold text-slate-900 mb-1">Hapus Destinasi?</h3>
                        <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                            Apakah Anda yakin ingin menghapus <strong className="text-slate-800">{itemToDelete?.name}</strong>? Tindakan ini tidak dapat dibatalkan dari sistem.
                        </p>

                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setDeleteModalOpen(false)}
                                className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmDelete}
                                className="flex-1 px-4 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-xs font-bold text-white shadow-lg shadow-red-600/20 transition flex items-center justify-center gap-2"
                            >
                                <Trash2 className="w-4 h-4" />
                                <span>Ya, Hapus</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}