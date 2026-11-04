'use client';

import { Store, Ticket, Database, DollarSign, Info } from 'lucide-react';

interface SalesChartProps {
    summary: {
        total_initial_stock?: number;
        total_items_sold: number;
        total_standalone_sold: number;
        standalone_gross_sales?: number;
        total_bundling_sold: number;
        bundling_gross_sales?: number;
        total_bundling_transactions: number;
        total_gross_sales: number;
        total_umkm_income: number;
        total_pokdarwis_share: number;
    };
}

export default function SalesChart({ summary }: SalesChartProps) {
    const formatRupiah = (num: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num || 0);
    };

    // Menghitung sisa stok awal yang belum terjual (Stok Awal - Total Terjual Keseluruhan)
    const initialStock = summary.total_initial_stock || 0;
    const totalSold = summary.total_items_sold || 0;
    const remainingStock = Math.max(0, initialStock - totalSold);

    // Asumsi harga rata-rata per item atau estimasi potensi dari sisa stok jika dijual via standalone
    // Kita ambil rata-rata harga dari omzet standalone/bundling jika ada, atau estimasi berdasarkan total gross sales / total terjual
    const averagePrice = totalSold > 0 ? (summary.total_gross_sales / totalSold) : 0;
    const potentialStandaloneRevenue = remainingStock * averagePrice;

    // Kalkulasi persentase proporsi pendapatan bersih UMKM vs Pokdarwis
    const totalRevenue = (summary.total_umkm_income || 0) + (summary.total_pokdarwis_share || 0);
    const umkmPercentage = totalRevenue > 0 ? Math.round(((summary.total_umkm_income || 0) / totalRevenue) * 100) : 20;
    const pokdarwisPercentage = 100 - umkmPercentage;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Panel Kiri & Tengah: Rincian Saluran Penjualan & Stok Awal */}
            <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-4">
                <div>
                    <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">Rincian Saluran Penjualan & Inventaris</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Akumulasi kuantitas terjual dan rincian pendapatan kotor (omzet) per jalur distribusi.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    {/* Kartu Stok Awal */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-200/80 text-slate-700 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Database className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Stok Awal Sistem</p>
                            <h4 className="text-sm font-black text-slate-800">{initialStock} Pcs</h4>
                            <p className="text-[10px] text-slate-500">Sisa Stok: {remainingStock} Pcs</p>
                        </div>
                    </div>

                    {/* Kartu Standalone */}
                    <div className="bg-purple-50/50 p-4 rounded-2xl border border-purple-100 flex flex-col justify-between gap-2">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-purple-100 text-purple-700 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Store className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-purple-600 uppercase">Toko / Standalone</p>
                                <h4 className="text-xs font-black text-slate-900">{summary.total_standalone_sold} Pcs Terjual</h4>
                            </div>
                        </div>
                        <div className="border-t border-purple-100/80 pt-1.5">
                            <p className="text-[10px] font-semibold text-purple-700">Omzet: {formatRupiah(summary.standalone_gross_sales || 0)}</p>
                            {remainingStock > 0 && (
                                <p className="text-[9px] text-slate-400 mt-0.5">Potensi sisa stok ({remainingStock} pcs): ~{formatRupiah(potentialStandaloneRevenue)}</p>
                            )}
                        </div>
                    </div>

                    {/* Kartu Bundling Tiket */}
                    <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 flex flex-col justify-between gap-2">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Ticket className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-blue-600 uppercase">Bundling Tiket</p>
                                <h4 className="text-xs font-black text-slate-900">{summary.total_bundling_sold} Pcs Terjual</h4>
                            </div>
                        </div>
                        <div className="border-t border-blue-100/80 pt-1.5">
                            <p className="text-[10px] font-semibold text-blue-700">Omzet: {formatRupiah(summary.bundling_gross_sales || 0)}</p>
                            <p className="text-[9px] text-slate-400 mt-0.5">Mengikuti alokasi transaksi tiket wisata</p>
                        </div>
                    </div>
                </div>

                {/* Total Omzet Kotor Keseluruhan dengan Keterangan Jelas */}
                <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-emerald-600 text-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                            <DollarSign className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="text-xs font-bold text-emerald-900 block">Total Pendapatan Kotor Keseluruhan (Omzet)</span>
                            <span className="text-[10px] text-emerald-600 font-medium">Gabungan riwayat omzet Standalone + Bundling Tiket Wisata</span>
                        </div>
                    </div>
                    <span className="text-base font-black text-emerald-700">{formatRupiah(summary.total_gross_sales || 0)}</span>
                </div>
            </div>

            {/* Panel Kanan: Analisis Proporsi Bagi Hasil EOM */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
                <div>
                    <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">Analisis Proporsi Pendapatan</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Perbandingan hak bagi hasil bersih UMKM vs Pokdarwis.</p>
                </div>

                <div className="space-y-3 py-3">
                    <div>
                        <div className="flex justify-between text-xs font-bold mb-1">
                            <span className="text-emerald-700">Hak UMKM ({umkmPercentage}%)</span>
                            <span className="text-slate-900">{formatRupiah(summary.total_umkm_income)}</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                            <div className="bg-emerald-600 h-full rounded-full transition-all duration-500" style={{ width: `${umkmPercentage}%` }}></div>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between text-xs font-bold mb-1">
                            <span className="text-blue-600">Bagian Pokdarwis ({pokdarwisPercentage}%)</span>
                            <span className="text-slate-900">{formatRupiah(summary.total_pokdarwis_share)}</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                            <div className="bg-blue-600 h-full rounded-full transition-all duration-500" style={{ width: `${pokdarwisPercentage}%` }}></div>
                        </div>
                    </div>
                </div>

                <div className="text-[11px] font-medium text-slate-400 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center flex items-center justify-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span>Rekonsiliasi otomatis tercatat untuk audit End of Month (EOM).</span>
                </div>
            </div>
        </div>
    );
}