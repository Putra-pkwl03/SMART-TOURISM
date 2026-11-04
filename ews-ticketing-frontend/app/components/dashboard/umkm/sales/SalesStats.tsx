'use client';

import { ShoppingBag, CheckCircle, Clock } from 'lucide-react';

interface SalesStatsProps {
    totalItemsSold: number;
    totalPaidIncome: number;
    totalPendingIncome: number;
}

export default function SalesStats({
    totalItemsSold,
    totalPaidIncome,
    totalPendingIncome,
}: SalesStatsProps) {
    const formatRupiah = (num: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
    };

    const stats = [
        {
            title: 'Total Keseluruhan Terjual',
            value: `${totalItemsSold} Pcs`,
            subtitle: 'Akumulasi produk konsinyasi',
            icon: ShoppingBag,
            cardBg: 'bg-gradient-to-br from-emerald-100/80 via-white to-white',
            iconBg: 'bg-emerald-200/70 text-emerald-800',
            textColor: 'text-slate-900',
        },
        {
            title: 'Sudah Dicairkan (Paid)',
            value: formatRupiah(totalPaidIncome),
            subtitle: 'Dana lunas / diterima UMKM',
            icon: CheckCircle,
            cardBg: 'bg-gradient-to-br from-teal-100/80 via-white to-white',
            iconBg: 'bg-teal-200/70 text-teal-800',
            textColor: 'text-teal-700',
        },
        {
            title: 'Pending EOM (Belum Cair)',
            value: formatRupiah(totalPendingIncome),
            subtitle: 'Akumulasi audit akhir bulan',
            icon: Clock,
            cardBg: 'bg-gradient-to-br from-amber-100/80 via-white to-white',
            iconBg: 'bg-amber-200/70 text-amber-800',
            textColor: 'text-amber-700',
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                    <div 
                        key={index} 
                        className={`${stat.cardBg} p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between transition-all hover:shadow-md`}
                    >
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{stat.title}</p>
                            <h3 className={`text-base sm:text-lg font-black ${stat.textColor}`}>{stat.value}</h3>
                            {stat.subtitle && (
                                <p className="text-[10px] font-medium text-slate-400">{stat.subtitle}</p>
                            )}
                        </div>
                        <div className={`w-12 h-12 ${stat.iconBg} rounded-2xl flex items-center justify-center shadow-inner flex-shrink-0`}>
                            <IconComponent className="w-6 h-6" />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}