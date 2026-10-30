'use client';

import { useState } from 'react';
import { Loader2, X, AlertOctagon, Trash2 } from 'lucide-react';
import DestinationTableRow from './DestinationTableRow';

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

    // State untuk baris yang sedang dipilih/di-expand untuk melihat detail galeri di bawahnya
    const [expandedRowId, setExpandedRowId] = useState<number | null>(null);

    const openDeleteModal = (item: DestinationItem, e: React.MouseEvent) => {
        e.stopPropagation(); // Mencegah trigger expand row saat klik tombol aksi
        setItemToDelete(item);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (itemToDelete) {
            onDelete(itemToDelete.id);
            setDeleteModalOpen(false);
            setItemToDelete(null);
            if (expandedRowId === itemToDelete.id) {
                setExpandedRowId(null);
            }
        }
    };

    const toggleRowExpand = (id: number) => {
        setExpandedRowId(prev => (prev === id ? null : id));
    };

    return (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            {/* Custom Scrollbar & Animation */}
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                    height: 6px;
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

            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50/30 via-white to-white">
                <div>
                    <h3 className="font-bold text-slate-900 text-sm">Daftar Destinasi & Paket Bundling Aktif</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Klik pada baris tabel untuk melihat galeri foto lengkap dan deskripsi di bawahnya</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200">
                    {destinations.length} Item Terdaftar
                </span>
            </div>
            
            {loading ? (
                <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-2">
                    <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
                    <span className="text-xs font-medium">Memuat data dari server...</span>
                </div>
            ) : destinations.length === 0 ? (
                <div className="text-center py-16 text-slate-400 text-xs">
                    Belum ada data destinasi atau paket wisata yang ditambahkan.
                </div>
            ) : (
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse text-xs">
                        <thead>
                            <tr className="bg-slate-50/70 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                                <th className="p-4">Destinasi / Paket & Foto Utama</th>
                                <th className="p-4">Jenis & Lokasi</th>
                                <th className="p-4">Harga & Bagi Hasil UMKM</th>
                                <th className="p-4">Kuota</th>
                                <th className="p-4">Status EWS</th>
                                <th className="p-4 text-center">Aksi & Kontrol</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                            {destinations.map((item) => (
                                <DestinationTableRow
                                    key={item.id}
                                    item={item}
                                    isExpanded={expandedRowId === item.id}
                                    onToggleExpand={toggleRowExpand}
                                    onToggleStatus={onToggleStatus}
                                    onEdit={onEdit}
                                    onDeleteClick={openDeleteModal}
                                    onCloseDetail={() => setExpandedRowId(null)}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal Konfirmasi Hapus */}
            {deleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
                                <AlertOctagon className="w-5 h-5" />
                            </div>
                            <button onClick={() => setDeleteModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <h3 className="text-base font-bold text-slate-900 mb-1">Hapus Data Ini?</h3>
                        <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                            Apakah Anda yakin ingin menghapus <strong className="text-slate-800">{itemToDelete?.name}</strong>? Tindakan ini tidak dapat dibatalkan.
                        </p>
                        <div className="flex items-center gap-3">
                            <button type="button" onClick={() => setDeleteModalOpen(false)} className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition">
                                Batal
                            </button>
                            <button type="button" onClick={handleConfirmDelete} className="flex-1 px-4 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-xs font-bold text-white shadow-lg shadow-red-600/20 transition flex items-center justify-center gap-2">
                                <Trash2 className="w-4 h-4" /> Ya, Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}