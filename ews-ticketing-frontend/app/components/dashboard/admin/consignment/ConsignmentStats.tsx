// app/components/dashboard/consignment/ConsignmentStats.tsx
'use client';

import { DollarSign, TrendingUp, Package, ShoppingCart } from 'lucide-react';

interface ConsignmentStatsProps {
    totalUmkmIncome: number;
    totalPokdarwisIncome: number;
    totalTransactions: number;
    totalItemsSold: number;
    formatRupiah: (val: number) => string;
}

export default function ConsignmentStats({
    totalUmkmIncome,
    totalPokdarwisIncome,
    totalTransactions,
    totalItemsSold,
    formatRupiah,
}: ConsignmentStatsProps) {
    const stats = [
        {
            title: 'Hak Pendapatan UMKM',
            value: formatRupiah(totalUmkmIncome),
            icon: DollarSign,
            iconBg: 'bg-emerald-100 text-emerald-700 shadow-xs',
            cardBg: 'bg-gradient-to-br from-emerald-100/80 via-white to-white',
        },
        {
            title: 'Bagian Pokdarwis',
            value: formatRupiah(totalPokdarwisIncome),
            icon: TrendingUp,
            iconBg: 'bg-blue-100 text-blue-700 shadow-xs',
            cardBg: 'bg-gradient-to-br from-blue-100/80 via-white to-white',
        },
        {
            title: 'Produk Terkeluar (Qty)',
            value: `${totalItemsSold.toLocaleString('id-ID')} Pcs`,
            icon: Package,
            iconBg: 'bg-amber-100 text-amber-700 shadow-xs',
            cardBg: 'bg-gradient-to-br from-amber-100/80 via-white to-white',
        },
        {
            title: 'Total Transaksi',
            value: `${totalTransactions.toLocaleString('id-ID')} Nota`,
            icon: ShoppingCart,
            iconBg: 'bg-indigo-100 text-indigo-700 shadow-xs',
            cardBg: 'bg-gradient-to-br from-indigo-100/80 via-white to-white',
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                    <div 
                        key={index} 
                        className={`${stat.cardBg} backdrop-blur-md p-5 rounded-3xl border border-white/80 shadow-xs flex items-center gap-4 relative overflow-hidden`}
                    >
                        {/* Kotak Ikon di Kiri */}
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${stat.iconBg}`}>
                            <Icon className="w-6 h-6" />
                        </div>

                        {/* Konten Teks di Kanan */}
                        <div className="flex-1 min-w-0">
                            <span className="text-[11px] font-bold text-slate-500 uppercase block truncate">
                                {stat.title}
                            </span>
                            <h3 className="text-base font-extrabold text-slate-900 truncate mt-0.5">
                                {stat.value}
                            </h3>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}