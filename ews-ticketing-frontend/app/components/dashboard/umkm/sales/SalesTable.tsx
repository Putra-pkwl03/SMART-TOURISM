'use client';

import { Fragment, useState } from 'react';
import { ReceiptText, Calendar, ShoppingCart, ChevronDown, ChevronUp, User, MapPin, Eye } from 'lucide-react';
import { getBackendUrl } from '@/app/lib/backend-url';

interface SalesTableProps {
    sales: any[];
    loading: boolean;
}

export default function SalesTable({ sales, loading }: SalesTableProps) {
    const [expandedRowId, setExpandedRowId] = useState<number | null>(null);
    const BACKEND_URL = getBackendUrl();

    const formatRupiah = (num: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
    };

    const toggleRow = (id: number) => {
        setExpandedRowId(expandedRowId === id ? null : id);
    };

    if (loading) {
        return (
            <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center text-slate-400 text-sm font-medium">
                Memuat data penjualan & hampers...
            </div>
        );
    }

    if (sales.length === 0) {
        return (
            <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center text-slate-400 text-sm font-medium flex flex-col items-center justify-center gap-3">
                <ShoppingCart className="w-10 h-10 text-slate-300" />
                <span>Belum ada riwayat transaksi penjualan produk atau hampers tercatat.</span>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/50 text-xs font-bold text-slate-400 uppercase tracking-wider">
                            <th className="py-4 px-6">ID Transaksi / Tanggal</th>
                            <th className="py-4 px-6">Produk & Qty</th>
                            <th className="py-4 px-6">Jenis Penjualan</th>
                            <th className="py-4 px-6">Total Jual</th>
                            <th className="py-4 px-6">Hak Bagi Hasil UMKM</th>
                            <th className="py-4 px-6 text-center">Aksi / Detail</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
                        {sales.map((item) => {
                            const product = item.umkm_product;
                            const ticket = item.ticket;
                            const isStandalone = !ticket; 
                            const isExpanded = expandedRowId === item.id;

                            // Ambil gambar utama produk jika ada
                            const primaryImage = product?.images?.find((img: any) => img.is_primary) || product?.images?.[0];
                            const imageUrl = primaryImage ? `${BACKEND_URL}/storage/${primaryImage.image_path}` : null;

                            return (
                                <Fragment key={item.id}>
                                    <tr 
                                        onClick={() => toggleRow(item.id)}
                                        className={`hover:bg-slate-50/80 transition cursor-pointer ${isExpanded ? 'bg-emerald-50/30' : ''}`}
                                    >
                                        <td className="py-4 px-6">
                                            <div className="font-bold text-slate-900 flex items-center gap-2">
                                                <ReceiptText className="w-4 h-4 text-emerald-600" />
                                                <span>{ticket?.ticket_code || `TRX-#${item.id}`}</span>
                                            </div>
                                            <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1 font-semibold">
                                                <Calendar className="w-3 h-3" />
                                                <span>{new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                                                    {imageUrl ? (
                                                        <img src={imageUrl} alt={product?.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <ShoppingCart className="w-4 h-4 text-slate-400" />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-900">{product?.name || 'Produk UMKM'}</div>
                                                    <div className="text-xs text-slate-500 font-semibold">Jumlah: <span className="font-bold text-slate-700">{item.qty} Pcs</span></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-bold ${
                                                isStandalone 
                                                    ? 'bg-purple-50 text-purple-700 border border-purple-200' 
                                                    : 'bg-blue-50 text-blue-700 border border-blue-200'
                                            }`}>
                                                {isStandalone ? 'Standalone (Oleh-Oleh)' : 'Bundling Tiket Wisata'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 font-bold text-slate-900">
                                            {formatRupiah(item.qty * (product?.price || 0))}
                                        </td>
                                        <td className="py-4 px-6 font-extrabold text-emerald-600">
                                            {formatRupiah(item.total_umkm_income)}
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); toggleRow(item.id); }}
                                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-100 hover:text-emerald-700 text-slate-600 transition font-bold text-xs"
                                            >
                                                <Eye className="w-3.5 h-3.5" />
                                                <span>{isExpanded ? 'Tutup' : 'Detail'}</span>
                                                {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                            </button>
                                        </td>
                                    </tr>

                                    {/* Panel Detail yang Muncul di Bawah Baris saat Diklik */}
                                    {isExpanded && (
                                        <tr key={`detail-${item.id}`} className="bg-slate-50/70 border-b border-slate-100">
                                            <td colSpan={6} className="p-6">
                                                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                                                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                                        <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                                                            <ReceiptText className="w-4 h-4 text-emerald-600" />
                                                            Rincian Transaksi & Konsinyasi #{ticket?.ticket_code || item.id}
                                                        </h4>
                                                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                            Status: Tercatat EOM (End of Month)
                                                        </span>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                                                        <div className="space-y-1 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                                                            <span className="text-slate-400 font-bold uppercase text-xs">Informasi Pemesan / Wisatawan</span>
                                                            <div className="font-bold text-slate-800 flex items-center gap-1.5 pt-1">
                                                                <User className="w-3.5 h-3.5 text-slate-500" />
                                                                {ticket?.user?.name || 'Pembeli Umum / Walk-in'}
                                                            </div>
                                                            <div className="text-slate-500 text-xs">{ticket?.user?.email || '-'}</div>
                                                        </div>

                                                        <div className="space-y-1 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                                                            <span className="text-slate-400 font-bold uppercase text-xs">Destinasi & Tiket Bundling</span>
                                                            <div className="font-bold text-slate-800 flex items-center gap-1.5 pt-1">
                                                                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                                                                {ticket?.destination?.name || 'Pembelian Standalone Toko Oleh-Oleh'}
                                                            </div>
                                                            <div className="text-slate-500 text-xs">Jumlah Pengunjung: {ticket?.visitor_count || 1} Orang</div>
                                                        </div>

                                                        <div className="space-y-1 bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-100">
                                                            <span className="text-emerald-600 font-bold uppercase text-xs">Kalkulasi Bagi Hasil</span>
                                                            <div className="flex justify-between text-slate-600 pt-1">
                                                                <span>Bagian Pokdarwis:</span>
                                                                <span className="font-bold text-slate-800">{formatRupiah(item.total_pokdarwis_income)}</span>
                                                            </div>
                                                            <div className="flex justify-between text-emerald-700 font-bold">
                                                                <span>Hak Bersih UMKM:</span>
                                                                <span>{formatRupiah(item.total_umkm_income)}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </Fragment>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}