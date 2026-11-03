import { Users, Ticket, Wallet, CalendarDays } from 'lucide-react';

interface TicketStatsProps {
    totalVisitors: number;
    totalTicketsSold: number;
    totalRevenue: number;
    todayVisitors: number;
}

export default function TicketStats({
    totalVisitors,
    totalTicketsSold,
    totalRevenue,
    todayVisitors,
}: TicketStatsProps) {
    const stats = [
        {
            title: 'Total Kunjungan',
            value: totalVisitors.toLocaleString('id-ID'),
            growth: '+12%',
            icon: Users,
            iconBg: 'bg-emerald-100 text-emerald-700',
            cardBg: 'bg-gradient-to-br from-emerald-100/80 via-white to-white',
            textColor: 'text-emerald-600',
        },
        {
            title: 'Tiket Terjual',
            value: totalTicketsSold.toLocaleString('id-ID'),
            growth: '+10%',
            icon: Ticket,
            iconBg: 'bg-blue-100 text-blue-700',
            cardBg: 'bg-gradient-to-br from-blue-100/80 via-white to-white',
            textColor: 'text-blue-600',
        },
        {
            title: 'Total Pendapatan',
            value: `Rp ${totalRevenue.toLocaleString('id-ID')}`,
            growth: '+15%',
            icon: Wallet,
            iconBg: 'bg-amber-100 text-amber-700',
            cardBg: 'bg-gradient-to-br from-amber-100/80 via-white to-white',
            textColor: 'text-amber-600',
        },
        {
            title: 'Pengunjung Hari Ini',
            value: todayVisitors.toLocaleString('id-ID'),
            growth: '+8%',
            icon: CalendarDays,
            iconBg: 'bg-purple-100 text-purple-700',
            cardBg: 'bg-gradient-to-br from-purple-100/80 via-white to-white',
            textColor: 'text-purple-600',
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                    <div 
                        key={index} 
                        className={`${stat.cardBg} backdrop-blur-md p-5 rounded-3xl border border-white/80 shadow-sm flex items-center gap-4 relative overflow-hidden`}
                    >
                        {/* Kotak Ikon di Kiri */}
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm ${stat.iconBg}`}>
                            <Icon className="w-6 h-6" />
                        </div>

                        {/* Konten Teks di Kanan */}
                        <div className="flex-1 min-w-0">
                            <span className="text-xs font-semibold text-slate-500 block truncate">{stat.title}</span>
                            <div className="flex items-baseline gap-2 mt-0.5">
                                <h3 className="text-base font-extrabold text-slate-900 truncate">{stat.value}</h3>
                                <span className={`text-[11px] font-bold ${stat.textColor} flex-shrink-0`}>
                                    ↑ {stat.growth}
                                </span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}