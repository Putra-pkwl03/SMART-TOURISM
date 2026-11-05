'use client';

import { useState } from 'react';
import { Activity } from 'lucide-react';
import type { LoketDashboardData } from '@/app/lib/loket-dashboard';

interface TicketValidationTrendProps {
    data: LoketDashboardData['trend'];
    period: number;
    isLoading: boolean;
    onPeriodChange: (period: 7 | 30 | 90) => void;
}

export default function TicketValidationTrend({
    data,
    period,
    isLoading,
    onPeriodChange,
}: TicketValidationTrendProps) {
    const [activeDate, setActiveDate] = useState<string | null>(null);
    const width = 620;
    const height = 190;
    const left = 36;
    const right = 12;
    const top = 14;
    const bottom = 30;
    const max = Math.max(...data.map((point) => point.tickets), 1);
    const points = data.map((point, index) => {
        const x = data.length <= 1
            ? (left + width - right) / 2
            : left + index * (width - left - right) / (data.length - 1);
        const y = top + (1 - point.tickets / max) * (height - top - bottom);
        return { x, y, ...point };
    });
    const line = points.map((point) => `${point.x},${point.y}`).join(' ');
    const area = `${left},${height - bottom} ${line} ${width - right},${height - bottom}`;
    const labelStep = Math.max(1, Math.ceil(data.length / 7));
    const activePoint = points.find((point) => point.date === activeDate);

    return (
        <section className="flex h-full min-w-0 flex-col rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
                <h2 className="flex items-center gap-2 text-sm font-extrabold text-slate-900">
                    <Activity className="h-4 w-4 text-emerald-600" />
                    Tren Validasi Tiket
                </h2>
                <div className="flex rounded-full bg-slate-100 p-1" role="group" aria-label="Pilih periode validasi">
                    {([7, 30, 90] as const).map((days) => (
                        <button
                            key={days}
                            type="button"
                            onClick={() => onPeriodChange(days)}
                            aria-pressed={period === days}
                            className={`cursor-pointer rounded-full px-3 py-1.5 text-[10px] font-semibold transition ${
                                period === days ? 'bg-emerald-700 text-white shadow-sm' : 'text-slate-500 hover:bg-white'
                            }`}
                        >
                            {days} Hari
                        </button>
                    ))}
                </div>
            </div>

            {isLoading ? (
                <div className="flex h-48 items-center justify-center text-xs text-slate-400">Memuat tren validasi...</div>
            ) : data.length ? (
                <svg className="h-48 w-full overflow-visible" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" role="img" aria-label={`Tren validasi tiket ${period} hari`}>
                    {[0, 1, 2].map((step) => {
                        const y = top + step * (height - top - bottom) / 2;
                        const label = Math.round(max * (1 - step / 2));
                        return (
                            <g key={step}>
                                <line x1={left} x2={width - right} y1={y} y2={y} stroke="#e8eef5" strokeDasharray="3 4" />
                                <text x={left - 7} y={y + 3} textAnchor="end" fill="#718096" fontSize="9">{label}</text>
                            </g>
                        );
                    })}
                    <defs>
                        <linearGradient id="loket-trend-area" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.22" />
                            <stop offset="100%" stopColor="#10b981" stopOpacity="0.02" />
                        </linearGradient>
                    </defs>
                    <polygon points={area} fill="url(#loket-trend-area)" />
                    <polyline points={line} fill="none" stroke="#059669" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
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
                            aria-label={`${point.date}: ${point.tickets} tiket tervalidasi`}
                        >
                            <circle cx={point.x} cy={point.y} r="11" fill="transparent" />
                            <circle cx={point.x} cy={point.y} r={activeDate === point.date ? 6 : 4.5} fill="#059669" stroke="white" strokeWidth="2" />
                            {(index % labelStep === 0 || index === points.length - 1) && (
                                <text x={point.x} y={height - 7} textAnchor="middle" fill="#64748b" fontSize="9">{point.label}</text>
                            )}
                        </g>
                    ))}
                    {activePoint && (() => {
                        const tooltipX = Math.max(48, Math.min(width - 48, activePoint.x));
                        const tooltipY = Math.max(14, activePoint.y - 28);
                        return (
                            <g pointerEvents="none">
                                <rect x={tooltipX - 45} y={tooltipY} width="90" height="20" rx="10" fill="#047857" />
                                <text x={tooltipX} y={tooltipY + 14} textAnchor="middle" fill="white" fontSize="10" fontWeight="700">
                                    {`${activePoint.tickets} tiket`}
                                </text>
                            </g>
                        );
                    })()}
                </svg>
            ) : (
                <div className="flex h-48 items-center justify-center text-xs text-slate-400">Belum ada data validasi pada periode ini.</div>
            )}
        </section>
    );
}
