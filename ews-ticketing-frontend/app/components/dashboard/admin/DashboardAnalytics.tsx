'use client';

import { useState } from 'react';
import { BarChart3, Loader2, TrendingUp } from 'lucide-react';
import type {
    RevenueCompositionItem,
    VisitorTrendPoint,
} from '@/app/lib/admin-dashboard';

interface DashboardAnalyticsProps {
    visitorTrend: VisitorTrendPoint[];
    revenueComposition: RevenueCompositionItem[];
    period: number;
    onPeriodChange: (period: number) => void;
    isLoading: boolean;
}

const formatRupiah = (value: number) =>
    `Rp ${new Intl.NumberFormat('id-ID').format(value)}`;

function VisitorChart({ data }: { data: VisitorTrendPoint[] }) {
    const width = 620;
    const height = 170;
    const left = 34;
    const right = 12;
    const top = 14;
    const bottom = 28;
    const max = Math.max(...data.map((point) => point.visitors), 1);
    const points = data.map((point, index) => {
        const x = data.length <= 1
            ? (left + width - right) / 2
            : left + index * (width - left - right) / (data.length - 1);
        const y = top + (1 - point.visitors / max) * (height - top - bottom);
        return { x, y, ...point };
    });
    const line = points.map((point) => `${point.x},${point.y}`).join(' ');
    const area = `${left},${height - bottom} ${line} ${width - right},${height - bottom}`;
    const labelStep = Math.max(1, Math.ceil(data.length / 7));
    const [activeDate, setActiveDate] = useState<string | null>(null);
    const activePoint = points.find((point) => point.date === activeDate);

    return (
        <svg className="h-52 w-full overflow-visible" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" role="img" aria-label="Grafik jumlah kunjungan wisata">
            {[0, 1, 2, 3].map((step) => {
                const y = top + step * (height - top - bottom) / 3;
                const label = Math.round(max * (1 - step / 3));
                return (
                    <g key={step}>
                        <line x1={left} x2={width - right} y1={y} y2={y} stroke="#e8eef5" strokeDasharray="3 4" />
                        <text x={left - 7} y={y + 3} textAnchor="end" fill="#718096" fontSize="9">{label}</text>
                    </g>
                );
            })}
            <polygon points={area} fill="url(#visitor-area)" />
            <defs>
                <linearGradient id="visitor-area" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.02" />
                </linearGradient>
            </defs>
            <polyline points={line} fill="none" stroke="#059669" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            {activePoint && (
                <line
                    x1={activePoint.x}
                    x2={activePoint.x}
                    y1={top}
                    y2={height - bottom}
                    stroke="#059669"
                    strokeOpacity=".2"
                    strokeDasharray="3 4"
                />
            )}
            {points.map((point, index) => (
                <g
                    key={point.date}
                    className="cursor-crosshair"
                    onMouseEnter={() => setActiveDate(point.date)}
                    onMouseLeave={() => setActiveDate(null)}
                    onFocus={() => setActiveDate(point.date)}
                    onBlur={() => setActiveDate(null)}
                    tabIndex={0}
                    role="button"
                    aria-label={`${point.label}: ${point.visitors} pengunjung`}
                >
                    <circle cx={point.x} cy={point.y} r="12" fill="transparent" />
                    <circle
                        className="transition-all duration-150"
                        cx={point.x}
                        cy={point.y}
                        r={activeDate === point.date ? 6 : 4.5}
                        fill="#059669"
                        stroke="white"
                        strokeWidth="2"
                    />
                    {(index % labelStep === 0 || index === points.length - 1) && (
                        <text x={point.x} y={height - 7} textAnchor="middle" fill="#64748b" fontSize="9">
                            {point.label}
                        </text>
                    )}
                </g>
            ))}
            {activePoint && (() => {
                const tooltipX = Math.max(53, Math.min(width - 53, activePoint.x));
                const tooltipY = Math.max(17, activePoint.y - 22);
                return (
                    <g pointerEvents="none">
                        <rect x={tooltipX - 49} y={tooltipY - 13} width="98" height="22" rx="11" fill="#047857" />
                        <text x={tooltipX} y={tooltipY + 2} textAnchor="middle" fill="white" fontSize="10" fontWeight="700">
                            {`${activePoint.label}: ${new Intl.NumberFormat('id-ID').format(activePoint.visitors)} orang`}
                        </text>
                    </g>
                );
            })()}
        </svg>
    );
}

function RevenueDonut({ data }: { data: RevenueCompositionItem[] }) {
    const ticketRevenue = data.find((item) => item.name === 'Tiket')?.amount ?? 0;
    const bundlingRevenue = data.find((item) => item.name === 'Bundling UMKM')?.amount ?? 0;
    const total = ticketRevenue + bundlingRevenue;
    const radius = 43;
    const circumference = 2 * Math.PI * radius;
    const ticketLength = total > 0 ? circumference * ticketRevenue / total : 0;
    const bundlingLength = circumference - ticketLength;
    const [activeSegment, setActiveSegment] = useState<string | null>(null);
    const activeItem = data.find((item) => item.name === activeSegment);
    const centerAmount = activeItem?.amount ?? total;
    const centerLabel = activeItem?.name ?? 'Total';
    const segmentPercentage = total > 0 && activeItem ? Math.round(activeItem.amount / total * 100) : null;

    return (
        <div className="flex flex-col items-center justify-center gap-5 py-3 sm:flex-row sm:gap-8">
            <div className="relative h-36 w-36 shrink-0">
                <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" role="img" aria-label="Komposisi pendapatan tiket dan bundling UMKM">
                    <circle cx="60" cy="60" r={radius} fill="none" stroke="#e8eef5" strokeWidth="15" />
                    {total > 0 && (
                        <>
                            <circle
                                className="cursor-pointer transition-all duration-200"
                                onMouseEnter={() => setActiveSegment('Tiket')}
                                onMouseLeave={() => setActiveSegment(null)}
                                onFocus={() => setActiveSegment('Tiket')}
                                onBlur={() => setActiveSegment(null)}
                                tabIndex={0}
                                role="button"
                                aria-label={`Tiket: ${formatRupiah(ticketRevenue)}`}
                                cx="60" cy="60" r={radius} fill="none" stroke="#059669" strokeWidth={activeSegment === 'Tiket' ? 20 : 15}
                                strokeDasharray={`${ticketLength} ${circumference - ticketLength}`}
                            />
                            <circle
                                className="cursor-pointer transition-all duration-200"
                                onMouseEnter={() => setActiveSegment('Bundling UMKM')}
                                onMouseLeave={() => setActiveSegment(null)}
                                onFocus={() => setActiveSegment('Bundling UMKM')}
                                onBlur={() => setActiveSegment(null)}
                                tabIndex={0}
                                role="button"
                                aria-label={`Bundling UMKM: ${formatRupiah(bundlingRevenue)}`}
                                cx="60" cy="60" r={radius} fill="none" stroke="#3b82f6" strokeWidth={activeSegment === 'Bundling UMKM' ? 20 : 15}
                                strokeDasharray={`${bundlingLength} ${circumference - bundlingLength}`}
                                strokeDashoffset={-ticketLength}
                            />
                        </>
                    )}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="max-w-[112px] truncate text-sm font-extrabold text-slate-900">{formatRupiah(centerAmount)}</span>
                    <span className="max-w-[112px] truncate text-[10px] text-slate-500">
                        {segmentPercentage === null ? centerLabel : `${centerLabel} · ${segmentPercentage}%`}
                    </span>
                </div>
            </div>
            <div className="space-y-4">
                {[
                    { name: 'Tiket', amount: ticketRevenue, color: 'bg-emerald-600' },
                    { name: 'Bundling UMKM', amount: bundlingRevenue, color: 'bg-blue-500' },
                ].map((item) => (
                    <div
                        key={item.name}
                        className={`flex cursor-pointer items-start gap-2.5 rounded-lg px-2 py-1.5 transition-colors ${
                            activeSegment === item.name ? 'bg-slate-50' : 'hover:bg-slate-50/70'
                        }`}
                        onMouseEnter={() => setActiveSegment(item.name)}
                        onMouseLeave={() => setActiveSegment(null)}
                        onFocus={() => setActiveSegment(item.name)}
                        onBlur={() => setActiveSegment(null)}
                        tabIndex={0}
                        role="button"
                    >
                        <span className={`mt-1 h-2.5 w-2.5 rounded-full ${item.color}`} />
                        <div>
                            <p className="text-xs font-semibold text-slate-700">{item.name}</p>
                            <p className="text-[11px] text-slate-500">
                                {formatRupiah(item.amount)} ({total > 0 ? Math.round(item.amount / total * 100) : 0}%)
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function DashboardAnalytics({
    visitorTrend,
    revenueComposition,
    period,
    onPeriodChange,
    isLoading,
}: DashboardAnalyticsProps) {
    return (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.7fr_1fr]">
            <section className="group min-w-0 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-100 hover:shadow-lg sm:p-5">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                            <BarChart3 className="h-4 w-4 text-emerald-600 transition-transform duration-300 group-hover:scale-110" />
                            Tren Kunjungan Wisata
                        </h3>
                        <p className="mt-1 text-[10px] text-slate-500">Jumlah orang dari tiket yang sudah dipindai</p>
                    </div>
                    <div className="flex rounded-full bg-slate-100 p-1" role="group" aria-label="Pilih periode kunjungan">
                        {[7, 30, 90].map((days) => (
                            <button
                                key={days}
                                type="button"
                                onClick={() => onPeriodChange(days)}
                                aria-pressed={period === days}
                                className={`rounded-full px-3 py-1.5 text-[10px] font-semibold transition-all duration-200 active:scale-95 ${
                                    period === days ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-900/20' : 'text-slate-500 hover:bg-white hover:text-slate-800 hover:shadow-sm'
                                }`}
                            >
                                {days} Hari
                            </button>
                        ))}
                    </div>
                </div>
                {isLoading ? (
                    <div className="flex h-52 items-center justify-center gap-2 text-xs text-slate-500">
                        <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
                        Memuat data periode...
                    </div>
                ) : visitorTrend.length ? (
                    <VisitorChart data={visitorTrend} />
                ) : (
                    <div className="flex h-52 items-center justify-center text-xs text-slate-400">Belum ada tiket yang dipindai pada periode ini.</div>
                )}
            </section>

            <section className="group min-w-0 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-100 hover:shadow-lg sm:p-5">
                <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                    <TrendingUp className="h-4 w-4 text-emerald-600 transition-transform duration-300 group-hover:scale-110" />
                    Komposisi Pendapatan
                </h3>
                <RevenueDonut data={revenueComposition} />
            </section>
        </div>
    );
}
