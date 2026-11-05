import { CheckCircle2, QrCode, ShieldAlert, Users, Waves } from 'lucide-react';
import type { LoketDashboardData } from '@/app/lib/loket-dashboard';

interface LoketStatsProps {
    summary: LoketDashboardData['summary'];
    ews: LoketDashboardData['ews'];
}

const numberFormat = new Intl.NumberFormat('id-ID');

export default function LoketStats({ summary, ews }: LoketStatsProps) {
    const ewsStatus = ews?.status ?? 'TIDAK ADA DATA';
    const ewsColors = ewsStatus === 'NORMAL'
        ? {
            icon: 'bg-violet-100 text-violet-700',
            value: 'text-emerald-700',
        }
        : ewsStatus === 'WASPADA'
            ? {
                icon: 'bg-amber-100 text-amber-700',
                value: 'text-amber-700',
            }
            : ewsStatus === 'AWAS'
                ? {
                    icon: 'bg-rose-100 text-rose-700',
                    value: 'text-rose-700',
                }
                : {
                    icon: 'bg-slate-100 text-slate-600',
                    value: 'text-slate-600',
                };
    const statusLabel = ewsStatus === 'TIDAK ADA DATA'
        ? 'Tidak Ada Data'
        : ewsStatus.charAt(0) + ewsStatus.slice(1).toLowerCase();

    const cards = [
        {
            label: 'Tiket Diverifikasi',
            value: numberFormat.format(summary.verified_tickets_today),
            note: 'Terverifikasi hari ini',
            icon: QrCode,
            iconStyle: 'bg-emerald-100 text-emerald-700',
            valueStyle: 'text-slate-900',
            noteStyle: 'text-emerald-700',
        },
        {
            label: 'Pengunjung Masuk',
            value: numberFormat.format(summary.visitors_today),
            note: 'Orang masuk hari ini',
            icon: Users,
            iconStyle: 'bg-blue-100 text-blue-700',
            valueStyle: 'text-slate-900',
            noteStyle: 'text-blue-700',
        },
        {
            label: 'Kondisi Debit Air',
            value: ews ? `${ews.water_level.toLocaleString('id-ID')} m` : '—',
            note: ews?.description || 'Menunggu data sensor EWS',
            icon: Waves,
            iconStyle: 'bg-amber-100 text-amber-700',
            valueStyle: 'text-slate-900',
            noteStyle: 'text-slate-500',
        },
        {
            label: 'Status EWS Cuaca',
            value: statusLabel,
            note: ews ? 'Status sensor terbaru' : 'Data sensor belum tersedia',
            icon: ShieldAlert,
            iconStyle: ewsColors.icon,
            valueStyle: ewsColors.value,
            noteStyle: 'text-slate-500',
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-2.5 min-[520px]:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => {
                const Icon = card.icon;

                return (
                    <article
                        key={card.label}
                        className="relative flex min-h-[88px] min-w-0 items-center gap-3 overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white via-white to-slate-50 px-3 py-3 shadow-[0_2px_8px_rgba(15,23,42,0.06)] sm:gap-3.5 sm:px-3.5"
                    >
                        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${card.iconStyle}`}>
                            <Icon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-[10px] font-semibold text-slate-600 sm:text-[11px]">{card.label}</p>
                            <p className={`mt-0.5 truncate text-lg font-extrabold leading-tight sm:text-xl ${card.valueStyle}`}>{card.value}</p>
                            <p className={`mt-1 flex items-center gap-1 truncate text-[9px] font-semibold sm:text-[10px] ${card.noteStyle}`}>
                                {card.label === 'Tiket Diverifikasi' && <CheckCircle2 className="h-3 w-3 shrink-0" />}
                                {card.label === 'Status EWS Cuaca' && (
                                    <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${ews?.status === 'AWAS' ? 'bg-rose-500' : ews?.status === 'WASPADA' ? 'bg-amber-500' : ews?.status === 'NORMAL' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                                )}
                                {card.note}
                            </p>
                        </div>
                    </article>
                );
            })}
        </div>
    );
}
