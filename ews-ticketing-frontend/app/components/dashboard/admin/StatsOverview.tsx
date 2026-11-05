import { Clock3, CreditCard, ShoppingBag, TrendingUp, Users } from 'lucide-react';
import type { AdminDashboardSummary } from '@/app/lib/admin-dashboard';

interface StatsOverviewProps {
    summary: AdminDashboardSummary;
}

const formatRupiah = (value: number) =>
    `Rp ${new Intl.NumberFormat('id-ID').format(value)}`;

export default function StatsOverview({ summary }: StatsOverviewProps) {
    const stats = [
        {
            label: 'Total Kunjungan',
            value: `${new Intl.NumberFormat('id-ID').format(summary.visitors)} Orang`,
            note: summary.visitor_change_percent === null
                ? 'Data periode lalu belum tersedia'
                : `${summary.visitor_change_percent >= 0 ? '+' : ''}${summary.visitor_change_percent}% vs periode lalu`,
            icon: Users,
            cardBg: 'bg-gradient-to-br from-emerald-100/80 via-white to-white',
            iconBg: 'bg-emerald-200/70 text-emerald-800',
            noteColor: 'text-emerald-600',
            decoration: Users,
            decorationColor: 'text-blue-300',
        },
        {
            label: 'Pendapatan Tiket',
            value: formatRupiah(summary.ticket_revenue),
            note: 'Pembayaran terverifikasi',
            icon: CreditCard,
            cardBg: 'bg-gradient-to-br from-teal-100/80 via-white to-white',
            iconBg: 'bg-teal-200/70 text-teal-800',
            noteColor: 'text-emerald-600',
            decoration: TrendingUp,
            decorationColor: 'text-emerald-500',
        },
        {
            label: 'Penjualan Bundling UMKM',
            value: `${new Intl.NumberFormat('id-ID').format(summary.bundling_sales)} Paket`,
            note: 'Konsinyasi Sedyo Maju',
            icon: ShoppingBag,
            cardBg: 'bg-gradient-to-br from-purple-100/80 via-white to-white',
            iconBg: 'bg-purple-200/70 text-purple-800',
            noteColor: 'text-purple-600',
            decoration: TrendingUp,
            decorationColor: 'text-purple-500',
        },
        {
            label: 'Konsinyasi Belum Direkap',
            value: `${new Intl.NumberFormat('id-ID').format(summary.pending_consignments)} Transaksi`,
            note: 'Menunggu pencairan dana',
            icon: Clock3,
            cardBg: 'bg-gradient-to-br from-amber-100/80 via-white to-white',
            iconBg: 'bg-amber-200/70 text-amber-800',
            noteColor: 'text-amber-600',
            decoration: Clock3,
            decorationColor: 'text-orange-400',
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-2.5 min-[520px]:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
                const Icon = stat.icon;
                const Decoration = stat.decoration;
                return (
                    <article
                        key={stat.label}
                        className={`relative flex min-h-[76px] min-w-0 items-center gap-3 overflow-hidden rounded-xl border border-slate-200/80 px-3 py-2.5 shadow-[0_2px_8px_rgba(15,23,42,0.06)] transition-shadow hover:shadow-md sm:gap-3.5 sm:px-3.5 ${stat.cardBg}`}
                    >
                        <div className={`z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full shadow-sm sm:h-11 sm:w-11 ${stat.iconBg}`}>
                            <Icon className="h-5 w-5 sm:h-[21px] sm:w-[21px]" />
                        </div>
                        <div className="z-10 min-w-0 flex-1">
                            <p className="truncate text-[10px] font-semibold text-slate-500 sm:text-[11px]">{stat.label}</p>
                            <p className="mt-0.5 truncate text-base font-extrabold leading-tight text-slate-900 sm:text-lg">{stat.value}</p>
                            <p className={`mt-0.5 truncate text-[9px] font-semibold sm:text-[10px] ${stat.noteColor}`}>
                                {stat.note}
                            </p>
                        </div>
                        <Decoration className={`absolute -bottom-1 -right-0 h-10 w-10 opacity-20 sm:h-12 sm:w-12 ${stat.decorationColor}`} />
                    </article>
                );
            })}
        </div>
    );
}
