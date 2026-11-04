// app/components/dashboard/admin/consignment/ConsignmentTable.tsx
'use client';

import React, { useState } from 'react';
import { Package, ChevronDown, ChevronUp, Calendar, User, Ticket, CreditCard, MapPin, CheckCircle2, Clock } from 'lucide-react';
import { getBackendUrl } from '@/app/lib/backend-url';

interface ConsignmentTableProps {
    consignments: any[];
    loading: boolean;
    formatRupiah: (val: number) => string;
    onMarkAsPaid?: (ids: number[]) => void;
}

export default function ConsignmentTable({ consignments, loading, formatRupiah, onMarkAsPaid }: ConsignmentTableProps) {
    const [expandedRowId, setExpandedRowId] = useState<number | null>(null);
    const BACKEND_URL = getBackendUrl();

    const toggleRow = (id: number) => {
        setExpandedRowId(expandedRowId === id ? null : id);
    };

    if (loading) {
        return (
            <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center text-xs text-slate-500 shadow-xs">
                Memuat data konsinyasi...
            </div>
        );
    }

    if (consignments.length === 0) {
        return (
            <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center text-xs text-slate-500 shadow-xs">
                Belum ada data transaksi konsinyasi tercatat atau filter tidak ditemukan.
            </div>
        );
    }

    return (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                    Riwayat Transaksi & Bagi Hasil Konsinyasi
                </h2>
                <span className="text-[11px] text-slate-400">Klik baris untuk melihat detail bundling</span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold text-slate-600 uppercase">
                            <th className="py-3 px-4">Destinasi & Tiket / Wisatawan</th>
                            <th className="py-3 px-4">Produk UMKM (Bundling)</th>
                            <th className="py-3 px-4 text-center">Jumlah (Qty)</th>
                            <th className="py-3 px-4">Hak UMKM</th>
                            <th className="py-3 px-4">Bagian Pokdarwis</th>
                            <th className="py-3 px-4 text-center">Status EOM</th>
                            <th className="py-3 px-4 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-medium">
                        {consignments.map((item) => {
                            const isExpanded = expandedRowId === item.id;
                            const productImg = item.umkm_product?.images?.[0]?.image_path;
                            const destinationImg = item.ticket?.destination?.images?.[0]?.image_url;
                            const destinationName = item.ticket?.destination?.name || 'Destinasi Wisata';

                            const totalBundlingValue = Number(item.total_umkm_income) + Number(item.total_pokdarwis_income);
                            const visitorCount = item.ticket?.visitor_count || 1;
                            const pricePerPerson = totalBundlingValue / visitorCount;
                            const isPaid = item.status === 'paid';

                            return (
                                <React.Fragment key={item.id}>
                                    <tr 
                                        className={`transition cursor-pointer ${isExpanded ? 'bg-emerald-50/40' : 'hover:bg-slate-50/50'}`}
                                    >
                                        <td className="py-3.5 px-4" onClick={() => toggleRow(item.id)}>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center overflow-hidden shrink-0 border border-slate-200 shadow-xs">
                                                    {destinationImg ? (
                                                        <img src={`${BACKEND_URL}${destinationImg}`} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <MapPin className="w-4 h-4 text-slate-400" />
                                                    )}
                                                </div>
                                                <div>
                                                    <span className="font-bold text-slate-900 block">
                                                        {item.ticket?.ticket_code || `#${item.ticket_id}`}
                                                    </span>
                                                    <span className="text-[11px] text-slate-500 block truncate max-w-[180px]">
                                                        {destinationName} • {item.ticket?.user?.name || 'Wisatawan Umum'}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-4" onClick={() => toggleRow(item.id)}>
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden shrink-0 border border-slate-200">
                                                    {productImg ? (
                                                        <img src={`${BACKEND_URL}/storage/${productImg}`} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Package className="w-4 h-4 text-slate-400" />
                                                    )}
                                                </div>
                                                <span className="font-bold text-slate-800">
                                                    {item.umkm_product?.name || 'Produk UMKM'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-4 text-center" onClick={() => toggleRow(item.id)}>
                                            <span className="bg-emerald-50 text-emerald-700 py-1 px-2.5 rounded-xl font-bold">
                                                {item.qty} Pcs
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-4 font-bold text-emerald-600" onClick={() => toggleRow(item.id)}>
                                            {formatRupiah(item.total_umkm_income)}
                                        </td>
                                        <td className="py-3.5 px-4 font-bold text-blue-600" onClick={() => toggleRow(item.id)}>
                                            {formatRupiah(item.total_pokdarwis_income)}
                                        </td>
                                        
                                        {/* Kolom Status EOM (Paid / Pending) */}
                                        <td className="py-3.5 px-4 text-center" onClick={() => toggleRow(item.id)}>
                                            {isPaid ? (
                                                <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full text-[10px] font-extrabold">
                                                    <CheckCircle2 className="w-3 h-3" /> Lunas
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full text-[10px] font-extrabold">
                                                    <Clock className="w-3 h-3" /> Pending
                                                </span>
                                            )}
                                        </td>

                                        <td className="py-3.5 px-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {/* Kolom Aksi di ConsignmentTable.tsx */}
                                                    {!isPaid && onMarkAsPaid && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                // Panggil prop handler untuk mencairkan ID ini
                                                                onMarkAsPaid([item.id]); 
                                                            }}
                                                            title="Cairkan Dana Ini"
                                                            className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition cursor-pointer"
                                                        >
                                                            <CheckCircle2 className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                <button 
                                                    onClick={() => toggleRow(item.id)}
                                                    className="text-slate-400 hover:text-slate-600 inline-flex items-center gap-1 font-semibold text-[11px]"
                                                >
                                                    {isExpanded ? 'Tutup' : 'Detail'}
                                                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>

                                    {/* Baris Detail Expandable */}
                                    {isExpanded && (
                                        <tr className="bg-slate-50/80 border-b border-slate-200">
                                            <td colSpan={7} className="p-5">
                                                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
                                                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                                        <h4 className="font-extrabold text-slate-900 text-xs flex items-center gap-2">
                                                            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                                                            Rincian Transaksi Bundling & Tiket: {item.ticket?.ticket_code || `#${item.ticket_id}`}
                                                        </h4>
                                                        <span className="text-[11px] text-slate-400">
                                                            Dicatat pada: {item.created_at ? new Date(item.created_at).toLocaleString('id-ID') : '-'}
                                                            {item.settled_at && ` • Dicairkan: ${new Date(item.settled_at).toLocaleString('id-ID')}`}
                                                        </span>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                                                        {/* Info Wisatawan & Tiket */}
                                                        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-2">
                                                            <span className="font-bold text-slate-400 uppercase text-[10px] block">Informasi Pengunjung & Tarif</span>
                                                            <div className="flex items-center gap-2 text-slate-700">
                                                                <User className="w-3.5 h-3.5 text-slate-400" />
                                                                <span>Nama: <strong>{item.ticket?.user?.name || 'Wisatawan Umum'}</strong></span>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-slate-700">
                                                                <Ticket className="w-3.5 h-3.5 text-slate-400" />
                                                                <span>Kode Tiket: <strong>{item.ticket?.ticket_code}</strong></span>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-slate-700">
                                                                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                                                <span>Kunjungan: <strong>{item.ticket?.visit_date || '-'} ({visitorCount} Orang)</strong></span>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-slate-700 pt-1 border-t border-slate-200">
                                                                <CreditCard className="w-3.5 h-3.5 text-indigo-500" />
                                                                <span>Harga Paket: <strong>{formatRupiah(pricePerPerson)} / Orang</strong></span>
                                                            </div>
                                                        </div>

                                                        {/* Info Produk Bundling */}
                                                        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-2">
                                                            <span className="font-bold text-slate-400 uppercase text-[10px] block">Produk Suvenir / Hampers</span>
                                                            <p className="font-bold text-slate-800">{item.umkm_product?.name}</p>
                                                            <p className="text-slate-600">Harga Satuan Jual: <strong>{formatRupiah(item.umkm_product?.price || 0)}</strong></p>
                                                            <p className="text-emerald-600">Hak UMKM Per Pcs: <strong>{formatRupiah(item.umkm_product?.umkm_share_amount || 0)}</strong></p>
                                                            {item.notes && <p className="text-slate-500 text-[11px] pt-1">Catatan: {item.notes}</p>}
                                                        </div>

                                                        {/* Kalkulasi Finansial Bagi Hasil */}
                                                        <div className="bg-emerald-50/40 p-3.5 rounded-xl border border-emerald-100 space-y-2">
                                                            <span className="font-bold text-emerald-700 uppercase text-[10px] block">Rekapitulasi Bagi Hasil ({item.qty} Pcs)</span>
                                                            <div className="flex justify-between text-slate-700">
                                                                <span>Total Hak UMKM:</span>
                                                                <strong className="text-emerald-600">{formatRupiah(item.total_umkm_income)}</strong>
                                                            </div>
                                                            <div className="flex justify-between text-slate-700">
                                                                <span>Total Bagian Pokdarwis:</span>
                                                                <strong className="text-blue-600">{formatRupiah(item.total_pokdarwis_income)}</strong>
                                                            </div>
                                                            <div className="border-t border-emerald-200/60 pt-1.5 flex justify-between text-slate-900 font-extrabold">
                                                                <span>Total Nilai Bundling ({visitorCount} Orang):</span>
                                                                <span>{formatRupiah(totalBundlingValue)}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}