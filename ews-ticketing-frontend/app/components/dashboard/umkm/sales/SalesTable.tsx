'use client';

import { Fragment, useState } from 'react';
import { ReceiptText, Calendar, ShoppingCart, ChevronDown, ChevronUp, User, MapPin, Eye } from 'lucide-react';
import { getBackendUrl } from '@/app/lib/backend-url';
import CashierReceiptModal from '@/app/components/dashboard/umkm/cashier/CashierReceiptModal';
import type { OfflineReceiptData } from '@/app/components/dashboard/umkm/cashier/CashierReceiptModal';
import { SkeletonTable } from '@/app/components/dashboard/shared/DashboardSkeleton';

interface SalesTableProps {
    sales: SaleRecord[];
    loading: boolean;
}

interface SaleProduct {
    name?: string;
    price?: number;
    images?: Array<{ image_path: string; is_primary: boolean }>;
}

export interface SaleRecord {
    id: number;
    qty: number;
    unit_price?: number | null;
    created_at: string;
    total_umkm_income: number;
    total_pokdarwis_income: number;
    umkm_product?: SaleProduct | null;
    ticket?: {
        ticket_code?: string;
        visitor_count?: number;
        user?: { name?: string; email?: string } | null;
        destination?: { name?: string } | null;
    } | null;
    status?: 'pending' | 'paid';
    offline_sale?: OfflineReceiptData | null;
}

export default function SalesTable({ sales, loading }: SalesTableProps) {
    const [expandedRowId, setExpandedRowId] = useState<number | null>(null);
    const [selectedReceipt, setSelectedReceipt] = useState<OfflineReceiptData | null>(null);
    const BACKEND_URL = getBackendUrl();

    const formatRupiah = (num: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
    };

    const toggleRow = (id: number) => {
        setExpandedRowId(expandedRowId === id ? null : id);
    };

    if (loading) {
        return <SkeletonTable columns={6} rows={6} />;
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
                            <th className="py-4 px-6">Pendapatan / Hak UMKM</th>
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
                            const primaryImage = product?.images?.find((img) => img.is_primary) || product?.images?.[0];
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
                                                <span>{ticket?.ticket_code || item.offline_sale?.receipt_code || `TRX-#${item.id}`}</span>
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
                                                {isStandalone ? 'Penjualan Satuan (POS)' : 'Paket Bundling Tiket'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 font-bold text-slate-900">
                                            {formatRupiah(item.qty * (item.unit_price ?? product?.price ?? 0))}
                                        </td>
                                        <td className="py-4 px-6 font-extrabold text-emerald-600">
                                            {formatRupiah(item.total_umkm_income)}
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <div className="inline-flex items-center gap-2">
                                                {isStandalone && item.offline_sale && (
                                                    <button
                                                        onClick={(event) => {
                                                            event.stopPropagation();
                                                            setSelectedReceipt(item.offline_sale ?? null);
                                                        }}
                                                        className="inline-flex items-center gap-1 rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100"
                                                    >
                                                        <ReceiptText className="h-3.5 w-3.5" />
                                                        Lihat Struk
                                                    </button>
                                                )}
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); toggleRow(item.id); }}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-100 hover:text-emerald-700 text-slate-600 transition font-bold text-xs"
                                                >
                                                    <Eye className="w-3.5 h-3.5" />
                                                    <span>{isExpanded ? 'Tutup' : 'Detail'}</span>
                                                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                                </button>
                                            </div>
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
                                                            {isStandalone ? 'Rincian Penjualan Satuan' : 'Rincian Paket Bundling'}
                                                            {' '}#{ticket?.ticket_code || item.offline_sale?.receipt_code || item.id}
                                                        </h4>
                                                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                            {isStandalone
                                                                ? 'Transaksi langsung di lapak'
                                                                : item.status === 'paid' ? 'Bagi hasil sudah dibayarkan' : 'Bagi hasil menunggu rekonsiliasi EOM'}
                                                        </span>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                                                        <div className="space-y-1 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                                                            <span className="text-slate-400 font-bold uppercase text-xs">
                                                                {isStandalone ? 'Jenis Pembelian' : 'Informasi Pemesan / Wisatawan'}
                                                            </span>
                                                            <div className="font-bold text-slate-800 flex items-center gap-1.5 pt-1">
                                                                <User className="w-3.5 h-3.5 text-slate-500" />
                                                                {isStandalone ? 'Pembelian satuan di lapak' : ticket?.user?.name || 'Pembeli umum'}
                                                            </div>
                                                            {!isStandalone && (
                                                                <div className="text-slate-500 text-xs">{ticket?.user?.email || '-'}</div>
                                                            )}
                                                        </div>

                                                        <div className="space-y-1 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                                                            <span className="text-slate-400 font-bold uppercase text-xs">
                                                                {isStandalone ? 'Info Transaksi Kasir' : 'Destinasi & Tiket Wisata'}
                                                            </span>
                                                            {isStandalone ? (
                                                                <>
                                                                    <div className="font-bold text-slate-800 pt-1">
                                                                        {item.offline_sale?.receipt_code || 'Transaksi satuan'}
                                                                    </div>
                                                                    <div className="text-slate-500">
                                                                        Pembayaran: {item.offline_sale?.payment_method === 'manual_transfer' ? 'Transfer manual' : 'Tunai'}
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <div className="font-bold text-slate-800 flex items-center gap-1.5 pt-1">
                                                                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                                                                        {ticket?.destination?.name || 'Destinasi wisata'}
                                                                    </div>
                                                                    <div className="text-slate-500 text-xs">
                                                                        Jumlah pengunjung: {ticket?.visitor_count || 1} orang
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>

                                                        <div className="space-y-1 bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-100">
                                                            <span className="text-emerald-600 font-bold uppercase text-xs">
                                                                {isStandalone ? 'Pendapatan Penjualan Satuan' : 'Rincian Bagi Hasil Bundling'}
                                                            </span>
                                                            {!isStandalone && (
                                                                <div className="flex justify-between text-slate-600 pt-1">
                                                                    <span>Bagian Pokdarwis:</span>
                                                                    <span className="font-bold text-slate-800">{formatRupiah(item.total_pokdarwis_income)}</span>
                                                                </div>
                                                            )}
                                                            <div className="flex justify-between text-emerald-700 font-bold">
                                                                <span>{isStandalone ? 'Pendapatan UMKM:' : 'Hak bagi hasil UMKM:'}</span>
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
            <CashierReceiptModal sale={selectedReceipt} onClose={() => setSelectedReceipt(null)} />
        </div>
    );
}