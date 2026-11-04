// app/components/dashboard/admin/consignment/ConsignmentStats.tsx
'use client';

import { DollarSign, TrendingUp, ShoppingCart } from 'lucide-react';

interface ConsignmentStatsProps {
    totalTransactions: number;
    totalPaidUmkm: number;
    totalUnpaidUmkm: number;
    formatRupiah: (val: number) => string;
}

export default function ConsignmentStats({
    totalTransactions,
    totalPaidUmkm,
    totalUnpaidUmkm,
    formatRupiah,
}: ConsignmentStatsProps) {
    
    const stats = [
        {
            title: 'Total Nota / Transaksi',
            value: `${totalTransactions.toLocaleString('id-ID')} Nota`,
            icon: ShoppingCart,
            iconBg: 'bg-purple-100 text-purple-700 shadow-xs',
            cardBg: 'bg-gradient-to-br from-purple-100/80 via-white to-white',
        },
        {
            title: 'Hak UMKM Sudah Lunas (Paid)',
            value: formatRupiah(totalPaidUmkm),
            icon: DollarSign,
            iconBg: 'bg-emerald-100 text-emerald-700 shadow-xs',
            cardBg: 'bg-gradient-to-br from-emerald-100/80 via-white to-white',
        },
        {
            title: 'Hak UMKM Belum Lunas (Pending)',
            value: formatRupiah(totalUnpaidUmkm),
            icon: TrendingUp,
            iconBg: 'bg-amber-100 text-amber-700 shadow-xs',
            cardBg: 'bg-gradient-to-br from-amber-100/80 via-white to-white',
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                    <div 
                        key={index} 
                        className={`${stat.cardBg} backdrop-blur-md p-5 rounded-3xl border border-white/80 shadow-xs flex items-center gap-4 relative overflow-hidden`}
                    >
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${stat.iconBg}`}>
                            <Icon className="w-6 h-6" />
                        </div>
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