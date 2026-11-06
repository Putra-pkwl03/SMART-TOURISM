'use client';

import { useState } from 'react';
import { BarChart3, Tags } from 'lucide-react';
import type { UmkmProductCompositionItem, UmkmSalesTrendPoint } from './types';
import { SkeletonChart, SkeletonDonutContent } from '@/app/components/dashboard/shared/DashboardSkeleton';

const formatNumber = (value: number) => new Intl.NumberFormat('id-ID').format(value);
const palette = ['#059669', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#0ea5e9'];

function SalesTrendChart({ data }: { data: UmkmSalesTrendPoint[] }) {
    const width = 720;
    const height = 220;
    const left = 38;
    const right = 12;
    const top = 14;
    const bottom = 34;
    const max = Math.max(...data.map((point) => point.quantity), 1);
    const points = data.map((point, index) => {
        const x = data.length <= 1
            ? (left + width - right) / 2
            : left + index * (width - left - right) / (data.length - 1);
        const y = top + (1 - point.quantity / max) * (height - top - bottom);
        return { ...point, x, y };
    });
    const line = points.map((point) => `${point.x},${point.y}`).join(' ');
    const area = `${left},${height - bottom} ${line} ${width - right},${height - bottom}`;
    const labelStep = Math.max(1, Math.ceil(data.length / 6));
    const [activeDate, setActiveDate] = useState<string | null>(null);
    const activePoint = points.find((point) => point.date === activeDate);

    return (
        <svg className="h-56 w-full overflow-visible" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" role="img" aria-label="Grafik jumlah produk terjual dalam 30 hari terakhir">
            {[0, 1, 2, 3].map((step) => {
                const y = top + step * (height - top - bottom) / 3;
                const label = Math.round(max * (1 - step / 3));
                return (
                    <g key={step}>
                        <line x1={left} x2={width - right} y1={y} y2={y} stroke="#e8eef5" strokeDasharray="3 4" />
                        <text x={left - 8} y={y + 4} textAnchor="end" fill="#64748b" fontSize="11">{label}</text>
                    </g>
                );
            })}
            <defs>
                <linearGradient id="umkm-sales-area" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.02" />
                </linearGradient>
            </defs>
            <polygon points={area} fill="url(#umkm-sales-area)" />
            <polyline points={line} fill="none" stroke="#059669" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            {activePoint && (
                <line
                    x1={activePoint.x}
                    x2={activePoint.x}
                    y1={top}
                    y2={height - bottom}
                    stroke="#059669"
                    strokeOpacity=".24"
                    strokeDasharray="3 4"
                    pointerEvents="none"
                />
            )}
            {points.map((point, index) => (
                <g
                    key={point.date}
                    className="cursor-crosshair outline-none"
                    onMouseEnter={() => setActiveDate(point.date)}
                    onMouseLeave={() => setActiveDate(null)}
                    onFocus={() => setActiveDate(point.date)}
                    onBlur={() => setActiveDate(null)}
                    tabIndex={0}
                    role="button"
                    aria-label={`${point.label}: ${formatNumber(point.quantity)} produk terjual`}
                >
                    <circle cx={point.x} cy={point.y} r="12" fill="transparent" />
                    <circle
                        className="transition-all duration-150"
                        cx={point.x}
                        cy={point.y}
                        r={activeDate === point.date ? 6 : 4}
                        fill="#059669"
                        stroke="white"
                        strokeWidth="2"
                    />
                    {(index % labelStep === 0 || index === points.length - 1) && (
                        <text x={point.x} y={height - 8} textAnchor="middle" fill="#64748b" fontSize="11">{point.label}</text>
                    )}
                </g>
            ))}
            {activePoint && (() => {
                const tooltipX = Math.max(62, Math.min(width - 62, activePoint.x));
                const tooltipY = Math.max(19, activePoint.y - 20);
                return (
                    <g pointerEvents="none">
                        <rect
                            x={tooltipX - 58}
                            y={tooltipY - 15}
                            width="116"
                            height="25"
                            rx="12.5"
                            fill="#064e3b"
                            className="drop-shadow"
                        />
                        <text x={tooltipX} y={tooltipY + 1} textAnchor="middle" fill="white" fontSize="10" fontWeight="700">
                            {`${activePoint.label} · ${formatNumber(activePoint.quantity)} pcs`}
                        </text>
                    </g>
                );
            })()}
        </svg>
    );
}

function ProductComposition({ data }: { data: UmkmProductCompositionItem[] }) {
    const total = data.reduce((sum, item) => sum + item.quantity, 0);
    const radius = 43;
    const circumference = 2 * Math.PI * radius;
    let consumed = 0;
    const [activeProduct, setActiveProduct] = useState<string | null>(null);
    const activeItem = data.find((item) => item.name === activeProduct);
    const activePercentage = activeItem && total > 0
        ? Math.round(activeItem.quantity / total * 100)
        : 0;

    return (
        <div className="flex flex-col items-center justify-center gap-5 py-4 sm:flex-row sm:gap-7">
            <div className="relative h-36 w-36 shrink-0">
                <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" role="img" aria-label="Komposisi produk terjual">
                    <circle cx="60" cy="60" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="15" />
                    {total > 0 && data.map((item, index) => {
                        const length = circumference * item.quantity / total;
                        const offset = consumed;
                        consumed += length;
                        return (
                            <circle
                                key={item.name}
                                cx="60"
                                cy="60"
                                r={radius}
                                fill="none"
                                stroke={palette[index % palette.length]}
                                strokeWidth={activeProduct === item.name ? 20 : 15}
                                strokeDasharray={`${length} ${circumference - length}`}
                                strokeDashoffset={-offset}
                                pointerEvents="stroke"
                                tabIndex={0}
                                role="button"
                                aria-label={`${item.name}: ${formatNumber(item.quantity)} pcs, ${total ? Math.round(item.quantity / total * 100) : 0}%`}
                                className="cursor-pointer outline-none transition-all duration-200 focus:opacity-80"
                                onMouseEnter={() => setActiveProduct(item.name)}
                                onMouseLeave={() => setActiveProduct(null)}
                                onFocus={() => setActiveProduct(item.name)}
                                onBlur={() => setActiveProduct(null)}
                            />
                        );
                    })}
                </svg>
                {activeItem && (
                    <div
                        role="status"
                        className="pointer-events-none absolute left-1/2 top-0 z-10 w-max max-w-48 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-slate-900 px-3 py-2 text-center text-xs text-white shadow-lg"
                    >
                        <span className="block max-w-44 truncate font-bold">{activeItem.name}</span>
                        <span className="mt-0.5 block text-slate-200">
                            {formatNumber(activeItem.quantity)} pcs · {activePercentage}%
                        </span>
                    </div>
                )}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-xl font-extrabold text-slate-900">{formatNumber(total)}</span>
                    <span className="text-xs text-slate-500">Produk terjual</span>
                </div>
            </div>
            <div className="max-h-40 min-w-0 space-y-3 overflow-y-auto">
                {data.length ? data.map((item, index) => (
                    <div
                        key={item.name}
                        className={`flex cursor-pointer items-start gap-2.5 rounded-lg px-2 py-1.5 transition-colors ${
                            activeProduct === item.name ? 'bg-slate-50' : 'hover:bg-slate-50/70'
                        }`}
                        onMouseEnter={() => setActiveProduct(item.name)}
                        onMouseLeave={() => setActiveProduct(null)}
                        onFocus={() => setActiveProduct(item.name)}
                        onBlur={() => setActiveProduct(null)}
                        tabIndex={0}
                        role="button"
                    >
                        <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: palette[index % palette.length] }} />
                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-700">{item.name}</p>
                            <p className="text-xs text-slate-500">
                                {formatNumber(item.quantity)} pcs ({total ? Math.round(item.quantity / total * 100) : 0}%)
                            </p>
                        </div>
                    </div>
                )) : <p className="text-sm text-slate-500">Belum ada transaksi bulan ini.</p>}
            </div>
        </div>
    );
}

export default function SalesAnalytics({
    salesTrend,
    productComposition,
    period,
    onPeriodChange,
    isLoading,
}: {
    salesTrend: UmkmSalesTrendPoint[];
    productComposition: UmkmProductCompositionItem[];
    period: 7 | 30 | 90;
    onPeriodChange: (period: 7 | 30 | 90) => void;
    isLoading: boolean;
}) {
    return (
        <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1.8fr_1fr]">
            <article className="group min-w-0 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-100 hover:shadow-lg sm:p-5">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-emerald-700 transition-transform duration-300 group-hover:scale-110" />
                        <div>
                            <h2 className="text-base font-extrabold text-slate-900">Tren Penjualan {period} Hari Terakhir</h2>
                            <p className="text-xs text-slate-500">Jumlah produk terjual per hari</p>
                        </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-1 rounded-full bg-slate-100/90 p-1" role="group" aria-label="Pilih periode tren penjualan">
                        {([7, 30, 90] as const).map((days) => (
                            <button
                                key={days}
                                type="button"
                                onClick={() => onPeriodChange(days)}
                                aria-pressed={period === days}
                                className={`rounded-full px-3 py-1.5 text-[11px] font-bold transition-all duration-200 active:scale-95 ${
                                    period === days
                                        ? 'bg-emerald-700 text-white shadow-sm shadow-emerald-900/20'
                                        : 'text-slate-500 hover:bg-white hover:text-slate-800 hover:shadow-sm'
                                }`}
                            >
                                {days} Hari
                            </button>
                        ))}
                    </div>
                </div>
                {isLoading ? (
                    <SkeletonChart showHeader={false} className="h-56 border-0 p-0 shadow-none" />
                ) : salesTrend.length ? (
                    <SalesTrendChart data={salesTrend} />
                ) : (
                    <div className="flex h-56 items-center justify-center text-sm text-slate-500">Belum ada data penjualan.</div>
                )}
            </article>

            <article className="group min-w-0 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-100 hover:shadow-lg sm:p-5">
                <h2 className="flex items-center gap-2 text-base font-extrabold text-slate-900">
                    <Tags className="h-5 w-5 text-emerald-700 transition-transform duration-300 group-hover:scale-110" />
                    Komposisi Penjualan
                </h2>
                <p className="mt-1 text-xs text-slate-500">Produk terjual berdasarkan produk bulan ini</p>
                {isLoading ? <SkeletonDonutContent rows={4} /> : <ProductComposition data={productComposition} />}
            </article>
        </section>
    );
}
