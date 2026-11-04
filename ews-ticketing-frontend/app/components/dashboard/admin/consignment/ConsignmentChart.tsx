// app/components/dashboard/admin/consignment/ConsignmentChart.tsx
'use client';

import { BarChart3, TrendingUp, Wallet } from 'lucide-react';

interface ConsignmentChartProps {
    summary: {
        total_items_sold: number;
        total_gross_sales: number;
        total_umkm_income: number;
        total_pokdarwis_income: number;
    };
    formatRupiah: (num: number) => string;
}

export default function ConsignmentChart({ summary, formatRupiah }: ConsignmentChartProps) {
    const totalRevenue = summary.total_gross_sales || 1; // Hindari pembagian dengan nol
    const umkmPercentage = Math.round((summary.total_umkm_income / totalRevenue) * 100);
    const pokdarwisPercentage = 100 - umkmPercentage;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Visualisasi Proporsi Bagi Hasil & Pendapatan Kotor */}
            <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 p-6 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-sm font-extrabold text-slate-900">Analisis Proporsi Pendapatan Konsinyasi</h3>
                            <p className="text-[11px] text-slate-500 font-medium">Perbandingan bagian pendapatan bersih UMKM vs Pokdarwis dari Gross Sales</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-4 my-auto py-2">
                    {/* Progress Bar Proporsi */}
                    <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-bold">
                            <span className="text-emerald-700">Hak UMKM ({umkmPercentage}%)</span>
                            <span className="text-blue-700">Bagian Pokdarwis ({pokdarwisPercentage}%)</span>
                        </div>
                        <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
                            <div 
                                className="bg-emerald-500 h-full transition-all duration-500" 
                                style={{ width: `${umkmPercentage}%` }}
                                title={`UMKM: ${formatRupiah(summary.total_umkm_income)}`}
                            ></div>
                            <div 
                                className="bg-blue-500 h-full transition-all duration-500" 
                                style={{ width: `${pokdarwisPercentage}%` }}
                                title={`Pokdarwis: ${formatRupiah(summary.total_pokdarwis_income)}`}
                            ></div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                        <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-3.5">
                            <span className="text-[10px] text-indigo-700 font-bold uppercase tracking-wider block">Total Kotor (Gross)</span>
                            <div className="text-sm font-extrabold text-indigo-900 mt-0.5">{formatRupiah(totalRevenue)}</div>
                        </div>
                        <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-3.5">
                            <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider block">Hak UMKM</span>
                            <div className="text-sm font-extrabold text-emerald-800 mt-0.5">{formatRupiah(summary.total_umkm_income)}</div>
                        </div>
                        <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-3.5">
                            <span className="text-[10px] text-blue-700 font-bold uppercase tracking-wider block">Bagian Pokdarwis</span>
                            <div className="text-sm font-extrabold text-blue-800 mt-0.5">{formatRupiah(summary.total_pokdarwis_income)}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Ringkasan Status Konsinyasi EOM */}
            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-6 text-white shadow-lg shadow-emerald-600/20 flex flex-col justify-between">
                <div>
                    <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white mb-4 border border-white/20">
                        <BarChart3 className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-extrabold tracking-tight">Rekapitulasi EOM</h3>
                    <p className="text-xs text-emerald-100 mt-1 leading-relaxed">
                        Seluruh transaksi tercatat otomatis untuk proses pencairan dan audit bagi hasil di akhir bulan.
                    </p>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 mt-6">
                    <div className="text-[11px] text-emerald-100 font-medium">Total Produk Terkeluar</div>
                    <div className="text-2xl font-black mt-0.5">{summary.total_items_sold} <span className="text-sm font-bold">Pcs</span></div>
                </div>
            </div>
        </div>
    );
}