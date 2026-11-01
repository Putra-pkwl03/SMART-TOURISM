'use client';

import React, { useState } from 'react';
import { List } from 'lucide-react';
import DestinationTableRow, { DestinationItem } from './DestinationTableRow';

interface DestinationTableProps {
    destinations?: DestinationItem[] | null;
    loading: boolean;
    onToggleStatus: (id: number) => void;
    onEdit: (item: DestinationItem) => void;
    onDelete: (item: DestinationItem) => void;
}

export default function DestinationTable({
    destinations = [],
    loading,
    onToggleStatus,
    onEdit,
    onDelete,
}: DestinationTableProps) {
    const safeDestinations = Array.isArray(destinations) ? destinations : [];
    const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});

    const toggleRow = (id: number) => {
        setExpandedRows(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    if (loading) {
        return (
            <div className="bg-white rounded-2xl p-8 text-center text-slate-500 border border-slate-100 shadow-sm">
                Memuat daftar destinasi...
            </div>
        );
    }

    if (safeDestinations.length === 0) {
        return (
            <div className="bg-white rounded-2xl p-8 text-center text-slate-500 border border-slate-100 shadow-sm">
                Belum ada data destinasi atau paket wisata yang terdaftar.
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                        <List className="w-4 h-4" />
                    </div>
                    <h2 className="text-sm font-bold text-slate-800">Daftar Destinasi & Paket Bundling Aktif</h2>
                </div>
                <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-100">
                    {safeDestinations.length} Item Terdaftar
                </span>
            </div>

            {/* Tabel Utama */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                            <th className="py-3.5 px-5">Destinasi / Paket & Foto Utama</th>
                            <th className="py-3.5 px-4">Jenis & Lokasi</th>
                            <th className="py-3.5 px-4">Harga & Bagi Hasil UMKM</th>
                            <th className="py-3.5 px-4">Kuota</th>
                            <th className="py-3.5 px-4">Status EWS</th>
                            <th className="py-3.5 px-5 text-right">Aksi & Kontrol</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                        {safeDestinations.map((item) => (
                            <DestinationTableRow
                                key={item.id}
                                item={item}
                                isExpanded={!!expandedRows[item.id]}
                                onToggleExpand={toggleRow}
                                onToggleStatus={onToggleStatus}
                                onEdit={onEdit}
                                onDeleteClick={(destinationItem) => onDelete(destinationItem)}
                                onCloseDetail={() => toggleRow(item.id)}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// Ekspor juga tipe datanya agar bisa dipakai di komponen lain jika diperlukan
export type { DestinationItem };