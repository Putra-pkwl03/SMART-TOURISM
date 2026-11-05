import { BarChart3, Package, ShoppingBag, type LucideIcon } from 'lucide-react';
import type { UmkmDashboardSummary } from './types';

const formatNumber = (value: number) => new Intl.NumberFormat('id-ID').format(value);
const formatRupiah = (value: number) => `Rp ${formatNumber(value)}`;

const statsStyle = {
    emerald: {
        card: 'border-emerald-100/90 from-emerald-100/80',
        icon: 'bg-gradient-to-br from-emerald-300 to-emerald-500 text-emerald-950',
        line: '#34d399',
    },
    blue: {
        card: 'border-blue-100/90 from-blue-100/80',
        icon: 'bg-gradient-to-br from-blue-300 to-blue-500 text-blue-950',
        line: '#60a5fa',
    },
    amber: {
        card: 'border-amber-100/90 from-amber-100/80',
        icon: 'bg-gradient-to-br from-amber-300 to-amber-500 text-amber-950',
        line: '#fbbf24',
    },
    violet: {
        card: 'border-violet-100/90 from-violet-100/80',
        icon: 'bg-gradient-to-br from-violet-300 to-violet-500 text-violet-950',
        line: '#c084fc',
    },
} as const;

interface StatCardProps {
    title: string;
    value: string;
    note: string;
    icon: LucideIcon;
    tone: keyof typeof statsStyle;
}

function StatCard({ title, value, note, icon: Icon, tone }: StatCardProps) {
    const style = statsStyle[tone];

    return (
        <article className={`relative flex h-[82px] min-w-0 items-center gap-3 overflow-hidden rounded-xl border bg-gradient-to-br ${style.card} via-white to-white px-3.5 py-2.5 shadow-[0_2px_8px_rgba(15,23,42,0.06)] sm:h-[86px] sm:gap-3.5 sm:px-4`}>
            <div className={`z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm sm:h-11 sm:w-11 ${style.icon}`}>
                <Icon className="h-5 w-5 sm:h-[21px] sm:w-[21px]" strokeWidth={2.2} />
            </div>
            <div className="z-10 min-w-0 flex-1">
                <p className="truncate text-[11px] font-semibold leading-4 text-slate-600 sm:text-xs">{title}</p>
                <div className="mt-1 flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    <p className="max-w-full truncate text-lg font-extrabold leading-5 tracking-tight text-slate-900 sm:text-xl">{value}</p>
                    <span className="truncate text-[10px] font-bold text-emerald-600 sm:text-[11px]">{note}</span>
                </div>
            </div>
            <svg className="absolute -bottom-1 -right-1 h-12 w-24 opacity-75 sm:h-14 sm:w-28" viewBox="0 0 112 56" fill="none" aria-hidden="true">
                <path d="M1 48C12 47 14 35 25 39C35 43 39 34 47 33C57 32 59 20 69 22C80 25 81 30 88 23C97 14 98 3 107 7C110 9 111 12 112 14V56H1V48Z" fill={style.line} fillOpacity=".1" />
                <path d="M1 48C12 47 14 35 25 39C35 43 39 34 47 33C57 32 59 20 69 22C80 25 81 30 88 23C97 14 98 3 107 7C110 9 111 12 112 14" stroke={style.line} strokeWidth="2" strokeLinecap="round" />
            </svg>
        </article>
    );
}

export default function DashboardStats({ summary }: { summary: UmkmDashboardSummary }) {
    return (
        <section aria-label="Ringkasan UMKM" className="grid grid-cols-1 gap-2.5 min-[520px]:grid-cols-2 xl:grid-cols-4">
            <StatCard
                title="Total Produk Terdaftar"
                value={formatNumber(summary.total_products)}
                note="di katalog"
                icon={Package}
                tone="emerald"
            />
            <StatCard
                title="Stok Menipis (Low Stock)"
                value={formatNumber(summary.low_stock_count)}
                note="perlu dicek"
                icon={Package}
                tone="blue"
            />
            <StatCard
                title="Total Penjualan (Bulan Ini)"
                value={formatRupiah(summary.monthly_gross_sales)}
                note={`${formatNumber(summary.monthly_sold_quantity)} pcs`}
                icon={ShoppingBag}
                tone="amber"
            />
            <StatCard
                title="Estimasi Pendapatan (EOM)"
                value={formatRupiah(summary.monthly_estimated_income)}
                note="bulan ini"
                icon={BarChart3}
                tone="violet"
            />
        </section>
    );
}
