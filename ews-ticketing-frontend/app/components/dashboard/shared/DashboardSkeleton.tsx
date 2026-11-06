import type { CSSProperties } from 'react';

interface SkeletonProps {
    className?: string;
    style?: CSSProperties;
}

export function Skeleton({ className = '', style }: SkeletonProps) {
    return <div aria-hidden="true" style={style} className={`animate-pulse rounded-lg bg-slate-200/80 ${className}`} />;
}

interface SkeletonStatsProps {
    count?: number;
    className?: string;
}

export function SkeletonStats({ count = 4, className = '' }: SkeletonStatsProps) {
    return (
        <div role="status" aria-label="Memuat ringkasan dashboard" className={`grid grid-cols-1 gap-3 min-[520px]:grid-cols-2 xl:grid-cols-4 ${className}`}>
            {Array.from({ length: count }, (_, index) => (
                <div key={index} className="flex min-h-[88px] items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                    <Skeleton className="h-11 w-11 shrink-0 rounded-2xl" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-3 w-2/3" />
                        <Skeleton className="h-5 w-1/2" />
                        <Skeleton className="h-2.5 w-3/4" />
                    </div>
                </div>
            ))}
        </div>
    );
}

interface SkeletonTableProps {
    columns?: number;
    rows?: number;
    className?: string;
}

export function SkeletonTable({ columns = 6, rows = 5, className = '' }: SkeletonTableProps) {
    return (
        <div role="status" aria-label="Memuat data tabel" className={`overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm ${className}`}>
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                <Skeleton className="h-4 w-44" />
                <Skeleton className="h-3 w-28" />
            </div>
            <div className="overflow-hidden p-4">
                <div className="grid gap-4 border-b border-slate-100 bg-slate-50/70 px-2 py-3" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
                    {Array.from({ length: columns }, (_, index) => <Skeleton key={index} className="h-3 w-4/5" />)}
                </div>
                <div className="divide-y divide-slate-100">
                    {Array.from({ length: rows }, (_, row) => (
                        <div key={row} className="grid items-center gap-4 px-2 py-4" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
                            {Array.from({ length: columns }, (_, column) => (
                                <Skeleton key={column} className={`h-4 ${column === 0 ? 'w-5/6' : 'w-2/3'}`} />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

interface SkeletonChartProps {
    className?: string;
    showHeader?: boolean;
}

export function SkeletonChart({ className = '', showHeader = true }: SkeletonChartProps) {
    const points = [
        [0, 112], [56, 88], [112, 101], [168, 54], [224, 78], [280, 42],
        [336, 65], [392, 30], [448, 70], [504, 48], [560, 74], [620, 35],
    ];
    const line = points.map(([x, y]) => `${x},${y}`).join(' ');

    return (
        <div role="status" aria-label="Memuat grafik" className={`rounded-2xl border border-slate-100 bg-white p-5 shadow-sm ${className}`}>
            {showHeader && (
                <div className="mb-5">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="mt-2 h-3 w-64 max-w-full" />
                </div>
            )}
            <div className="relative h-40">
                <div className="absolute inset-0 flex flex-col justify-between pb-3">
                    {[0, 1, 2, 3].map((lineIndex) => (
                        <Skeleton key={lineIndex} className="h-px w-full rounded-none opacity-60" />
                    ))}
                </div>
                <svg className="absolute inset-0 h-full w-full overflow-visible" viewBox="0 0 620 130" preserveAspectRatio="none" aria-hidden="true">
                    <polygon points={`0,130 ${line} 620,130`} fill="#10b981" fillOpacity="0.08" />
                    <polyline points={line} fill="none" stroke="#10b981" strokeOpacity="0.5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    {points.map(([x, y], index) => (
                        <circle key={index} cx={x} cy={y} r="4" fill="#10b981" fillOpacity="0.45" stroke="white" strokeWidth="2" />
                    ))}
                </svg>
            </div>
            <div className="mt-2 flex justify-between">
                <Skeleton className="h-2.5 w-10" />
                <Skeleton className="h-2.5 w-10" />
                <Skeleton className="h-2.5 w-10" />
                <Skeleton className="h-2.5 w-10" />
            </div>
        </div>
    );
}

export function SkeletonDonutContent({ rows = 4 }: { rows?: number }) {
    return (
        <div role="status" aria-label="Memuat komposisi data" className="flex min-h-48 flex-col items-center justify-center gap-5 py-4 sm:flex-row sm:gap-7">
            <div className="relative h-36 w-36 shrink-0 rounded-full border-[15px] border-slate-200/80 animate-pulse">
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                    <Skeleton className="h-5 w-14" />
                    <Skeleton className="h-3 w-16" />
                </div>
            </div>
            <div className="w-full min-w-0 max-w-56 space-y-3">
                {Array.from({ length: rows }, (_, index) => (
                    <div key={index} className="flex items-start gap-2.5 rounded-lg px-2 py-1.5">
                        <Skeleton className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full" />
                        <div className="min-w-0 flex-1 space-y-2">
                            <Skeleton className="h-3.5 w-4/5" />
                            <Skeleton className="h-3 w-3/5" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function DashboardEwsSkeleton() {
    return (
        <section role="status" aria-label="Memuat monitoring EWS" className="overflow-hidden rounded-2xl border border-sky-200/10 bg-gradient-to-br from-[#102b49] via-[#0b2340] to-[#092d3b] p-3.5 shadow-[0_12px_30px_rgba(8,30,52,0.2)] sm:rounded-[1.4rem] sm:p-5">
            <div className="mb-3.5 flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                    <Skeleton className="h-10 w-10 shrink-0 rounded-full bg-white/15 sm:h-11 sm:w-11" />
                    <div className="min-w-0 flex-1 space-y-2">
                        <Skeleton className="h-4 w-56 max-w-full bg-white/15" />
                        <Skeleton className="h-3 w-64 max-w-full bg-white/10" />
                    </div>
                </div>
                <Skeleton className="h-7 w-28 rounded-full bg-white/15" />
            </div>
            <div className="grid grid-cols-1 gap-2.5 min-[420px]:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: 4 }, (_, index) => (
                    <div key={index} className="flex min-h-[4.25rem] items-center gap-2.5 rounded-xl border border-sky-300/10 bg-sky-950/30 px-3 py-2 sm:gap-3 sm:px-3.5">
                        <Skeleton className="h-6 w-6 shrink-0 rounded-full bg-white/15" />
                        <div className="min-w-0 flex-1 space-y-2">
                            <Skeleton className="h-3 w-4/5 bg-white/15" />
                            <Skeleton className="h-5 w-2/3 bg-white/20" />
                        </div>
                        <Skeleton className="h-8 w-16 shrink-0 bg-white/15" />
                    </div>
                ))}
            </div>
        </section>
    );
}

export function ConsignmentAnalyticsSkeleton() {
    return (
        <div role="status" aria-label="Memuat analisis konsinyasi" className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <section className="flex flex-col justify-between rounded-3xl border border-slate-100 bg-white p-6 shadow-sm lg:col-span-2">
                <div className="mb-5 flex items-center gap-3">
                    <Skeleton className="h-10 w-10 shrink-0 rounded-2xl" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-64 max-w-full" />
                        <Skeleton className="h-3 w-full max-w-xl" />
                    </div>
                </div>
                <div className="my-auto space-y-5 py-2">
                    <div className="space-y-2">
                        <div className="flex justify-between gap-3">
                            <Skeleton className="h-3 w-1/3" />
                            <Skeleton className="h-3 w-1/3" />
                        </div>
                        <Skeleton className="h-4 w-full rounded-full" />
                    </div>
                    <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-3">
                        {Array.from({ length: 3 }, (_, index) => (
                            <div key={index} className="space-y-2 rounded-2xl border border-slate-100 bg-slate-50 p-3.5">
                                <Skeleton className="h-3 w-4/5" />
                                <Skeleton className="h-5 w-3/4" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <section className="flex min-h-64 flex-col justify-between rounded-3xl bg-gradient-to-br from-emerald-700 to-teal-800 p-6">
                <div>
                    <Skeleton className="mb-4 h-10 w-10 rounded-2xl bg-white/15" />
                    <Skeleton className="h-5 w-40 bg-white/20" />
                    <Skeleton className="mt-2 h-3 w-full bg-white/15" />
                    <Skeleton className="mt-2 h-3 w-4/5 bg-white/15" />
                </div>
                <div className="mt-6 space-y-2 rounded-2xl border border-white/20 bg-white/10 p-4">
                    <Skeleton className="h-3 w-2/3 bg-white/15" />
                    <Skeleton className="h-7 w-1/2 bg-white/20" />
                </div>
            </section>
        </div>
    );
}

export function UmkmDashboardSkeleton() {
    return (
        <div role="status" aria-label="Memuat dashboard UMKM" className="space-y-5">
            <SkeletonStats />
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.8fr_1fr]">
                <SkeletonChart />
                <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="mt-2 h-3 w-3/4" />
                    <SkeletonDonutContent rows={4} />
                </section>
            </div>
            <div className="grid grid-cols-1 items-stretch gap-4 xl:grid-cols-[0.95fr_2fr]">
                <section className="min-h-64 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="mt-3 h-3 w-4/5" />
                    <Skeleton className="mt-2 h-3 w-2/3" />
                </section>
                <section className="min-h-64 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                    <Skeleton className="h-5 w-44" />
                    <div className="mt-5 space-y-4">
                        {Array.from({ length: 4 }, (_, index) => (
                            <div key={index} className="flex items-center gap-3">
                                <Skeleton className="h-9 w-9 shrink-0 rounded-xl" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-3.5 w-2/3" />
                                    <Skeleton className="h-3 w-1/3" />
                                </div>
                                <Skeleton className="h-4 w-16" />
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}

export function LoketDashboardSkeleton() {
    return (
        <div role="status" aria-label="Memuat dashboard loket" className="space-y-5">
            <SkeletonStats />
            <div className="grid min-w-0 grid-cols-1 items-stretch gap-4 xl:grid-cols-[1.05fr_0.95fr]">
                <Skeleton className="h-64 rounded-2xl" />
                <section className="min-h-64 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                    <Skeleton className="h-5 w-44" />
                    <Skeleton className="mt-4 h-20 w-full rounded-xl" />
                    <Skeleton className="mt-3 h-3 w-4/5" />
                    <Skeleton className="mt-2 h-3 w-2/3" />
                </section>
            </div>
            <div className="grid min-w-0 grid-cols-1 items-stretch gap-4 xl:grid-cols-[1.05fr_0.95fr]">
                <SkeletonChart />
                <SkeletonTable columns={5} rows={4} />
            </div>
        </div>
    );
}

export function SalesBreakdownSkeleton() {
    return (
        <div role="status" aria-label="Memuat rincian penjualan dan proporsi pendapatan" className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            <section className="flex flex-col justify-between space-y-4 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm lg:col-span-2">
                <div>
                    <Skeleton className="h-5 w-72 max-w-full" />
                    <Skeleton className="mt-2 h-4 w-full max-w-2xl" />
                </div>

                <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-3">
                    <div className="flex min-h-[130px] items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                        <Skeleton className="h-10 w-10 shrink-0 rounded-xl" />
                        <div className="min-w-0 flex-1 space-y-2">
                            <Skeleton className="h-3 w-4/5" />
                            <Skeleton className="h-5 w-2/3" />
                            <Skeleton className="h-3 w-3/4" />
                        </div>
                    </div>
                    {[0, 1].map((card) => (
                        <div key={card} className="flex min-h-[130px] flex-col justify-between gap-2 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-9 w-9 shrink-0 rounded-xl" />
                                <div className="min-w-0 flex-1 space-y-2">
                                    <Skeleton className="h-3 w-4/5" />
                                    <Skeleton className="h-4 w-3/4" />
                                </div>
                            </div>
                            <div className="space-y-2 border-t border-slate-200/80 pt-2">
                                <Skeleton className="h-3 w-4/5" />
                                <Skeleton className="h-2.5 w-full" />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col items-start justify-between gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4 sm:flex-row sm:items-center">
                    <div className="flex w-full items-center gap-3 sm:w-2/3">
                        <Skeleton className="h-9 w-9 shrink-0 rounded-xl" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-2/3" />
                            <Skeleton className="h-3 w-full" />
                        </div>
                    </div>
                    <Skeleton className="h-5 w-28" />
                </div>
            </section>

            <section className="flex flex-col justify-between rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                <div>
                    <Skeleton className="h-5 w-64 max-w-full" />
                    <Skeleton className="mt-2 h-4 w-full" />
                    <Skeleton className="mt-1 h-4 w-4/5" />
                </div>
                <div className="space-y-5 py-3">
                    {[0, 1].map((row) => (
                        <div key={row}>
                            <div className="mb-2 flex justify-between gap-3">
                                <Skeleton className="h-4 w-2/3" />
                                <Skeleton className="h-4 w-1/3" />
                            </div>
                            <Skeleton className="h-2.5 w-full rounded-full" />
                        </div>
                    ))}
                </div>
                <div className="flex min-h-16 items-center gap-2 rounded-2xl border border-slate-100 bg-slate-50 p-3">
                    <Skeleton className="h-4 w-4 shrink-0 rounded-full" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-4/5" />
                    </div>
                </div>
            </section>
        </div>
    );
}

export function DashboardPageSkeleton() {
    return (
        <div role="status" aria-label="Memuat dashboard" className="space-y-5">
            <SkeletonStats />
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <SkeletonChart />
                <SkeletonChart />
            </div>
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <Skeleton className="h-64 rounded-2xl" />
                <Skeleton className="h-64 rounded-2xl" />
            </div>
        </div>
    );
}
