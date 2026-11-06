'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { apiClient } from '@/app/lib/axios';
import DashboardStats from '@/app/components/dashboard/umkm/dashboard/DashboardStats';
import GrowthCard from '@/app/components/dashboard/umkm/dashboard/GrowthCard';
import SalesAnalytics from '@/app/components/dashboard/umkm/dashboard/SalesAnalytics';
import TopProducts from '@/app/components/dashboard/umkm/dashboard/TopProducts';
import type { UmkmDashboardData } from '@/app/components/dashboard/umkm/dashboard/types';
import { SkeletonStats, SkeletonTable, UmkmDashboardSkeleton } from '@/app/components/dashboard/shared/DashboardSkeleton';

export default function UmkmDashboardPage() {
    const [dashboard, setDashboard] = useState<UmkmDashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const [selectedPeriod, setSelectedPeriod] = useState<7 | 30 | 90>(30);

    useEffect(() => {
        let cancelled = false;

        apiClient.get<UmkmDashboardData>('/umkm/dashboard-summary', {
            params: { period: selectedPeriod },
        })
            .then((response) => {
                if (!cancelled) {
                    setDashboard(response.data);
                    setError(null);
                }
            })
            .catch((requestError: unknown) => {
                if (cancelled) return;
                const message = axios.isAxiosError(requestError)
                    ? requestError.response?.data?.message || requestError.message
                    : requestError instanceof Error
                        ? requestError.message
                        : 'Gagal memuat data dashboard UMKM.';
                setError(message);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [refreshKey, selectedPeriod]);

    const refreshDashboard = () => {
        setLoading(true);
        setRefreshKey((key) => key + 1);
    };

    return (
        <div className="space-y-5 text-slate-900">
            {error && (
                <div role="alert" className="flex flex-col gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 sm:flex-row sm:items-center sm:justify-between">
                    <span>Data dashboard gagal dimuat: {error}</span>
                    <button type="button" onClick={refreshDashboard} className="font-bold underline underline-offset-2">
                        Coba lagi
                    </button>
                </div>
            )}

            {loading && !dashboard ? (
                <UmkmDashboardSkeleton />
            ) : dashboard ? (
                <>
                    {loading ? <SkeletonStats /> : <DashboardStats summary={dashboard.summary} />}
                    <SalesAnalytics
                        salesTrend={dashboard.sales_trend}
                        productComposition={dashboard.product_composition}
                        period={selectedPeriod}
                        isLoading={loading}
                        onPeriodChange={(period) => {
                            if (period === selectedPeriod) return;
                            setLoading(true);
                            setSelectedPeriod(period);
                        }}
                    />
                    <section className="grid grid-cols-1 items-stretch gap-4 xl:grid-cols-[0.95fr_2fr]">
                        <GrowthCard />
                        {loading ? (
                            <SkeletonTable columns={5} rows={4} className="min-h-64" />
                        ) : (
                            <TopProducts products={dashboard.top_products} />
                        )}
                    </section>
                </>
            ) : !error ? (
                <div className="rounded-2xl border border-slate-100 bg-white p-8 text-center text-sm text-slate-500">
                    Belum ada ringkasan dashboard untuk ditampilkan.
                </div>
            ) : null}
        </div>
    );
}
