'use client';

import { useEffect, useRef, useState } from 'react';
import { apiClient } from '@/app/lib/axios';
import { fetchWeatherData } from '@/app/lib/weather';
import type { AdminDashboardData } from '@/app/lib/admin-dashboard';
import ConsignmentSummary from '@/app/components/dashboard/admin/ConsignmentSummary';
import DashboardAnalytics from '@/app/components/dashboard/admin/DashboardAnalytics';
import EwsWidget from '@/app/components/dashboard/admin/EwsWidget';
import RecentTicketsTable from '@/app/components/dashboard/admin/RecentTicketsTable';
import StatsOverview from '@/app/components/dashboard/admin/StatsOverview';
import { DashboardEwsSkeleton, Skeleton, SkeletonStats } from '@/app/components/dashboard/shared/DashboardSkeleton';

const emptySummary: AdminDashboardData['summary'] = {
    visitors: 0,
    visitor_change_percent: null,
    ticket_revenue: 0,
    bundling_revenue: 0,
    total_revenue: 0,
    bundling_sales: 0,
    pending_consignments: 0,
};

const emptyEwsData = {
    water_level: '—',
    rainfall: '—',
    temperature: '—',
    humidity: '—',
    status: 'TIDAK ADA DATA',
    description: 'Data sensor EWS belum tersedia.',
};

export default function AdminDashboardPage() {
    const [period, setPeriod] = useState(7);
    const [dashboard, setDashboard] = useState<AdminDashboardData | null>(null);
    const [dashboardLoading, setDashboardLoading] = useState(true);
    const [dashboardError, setDashboardError] = useState<string | null>(null);
    const [ewsData, setEwsData] = useState(emptyEwsData);
    const sensorConnected = useRef(false);

    useEffect(() => {
        let isActive = true;

        async function loadDashboardData() {
            try {
                const response = await apiClient.get<AdminDashboardData>('/admin/dashboard', {
                    params: { period },
                });
                if (!isActive) return;

                setDashboard(response.data);
                setDashboardError(null);
                if (response.data.ews) {
                    sensorConnected.current = true;
                    setEwsData(response.data.ews);
                } else {
                    sensorConnected.current = false;
                    setEwsData((previous) => ({
                        ...previous,
                        status: 'TIDAK ADA DATA',
                        description: 'Data sensor EWS belum tersedia. Suhu, hujan, dan kelembapan menggunakan data cuaca.',
                    }));
                }
            } catch (error) {
                if (!isActive) return;
                console.error('Gagal memuat ringkasan dashboard:', error);
                setDashboardError('Data dashboard gagal dimuat. Periksa koneksi dan sesi login, lalu coba lagi.');
            } finally {
                if (isActive) setDashboardLoading(false);
            }
        }

        void loadDashboardData();
        const refreshInterval = window.setInterval(() => {
            void loadDashboardData();
        }, 60 * 1000);

        return () => {
            isActive = false;
            window.clearInterval(refreshInterval);
        };
    }, [period]);

    useEffect(() => {
        let isActive = true;

        async function loadWeatherFallback() {
            const weather = await fetchWeatherData();
            if (!isActive || !weather || sensorConnected.current) return;

            setEwsData((previous) => ({
                ...previous,
                temperature: weather.temperature,
                rainfall: weather.rainfall,
                humidity: weather.humidity,
                description: `Cuaca ${weather.city}: ${weather.description}. Data tinggi muka air menunggu sensor EWS.`,
            }));
        }

        void loadWeatherFallback();
        const refreshInterval = window.setInterval(() => {
            void loadWeatherFallback();
        }, 10 * 60 * 1000);

        return () => {
            isActive = false;
            window.clearInterval(refreshInterval);
        };
    }, []);

    const summary = dashboard?.summary ?? emptySummary;

    return (
        <div className="space-y-4 sm:space-y-5">
            {dashboardError && (
                <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-medium text-rose-700">
                    {dashboardError}
                </div>
            )}

            {dashboardLoading && !dashboard ? (
                <DashboardEwsSkeleton />
            ) : (
                <EwsWidget data={ewsData} history={dashboard?.ews_history} />
            )}

            {dashboardLoading ? <SkeletonStats /> : <StatsOverview summary={summary} />}

            <DashboardAnalytics
                visitorTrend={dashboard?.visitor_trend ?? []}
                revenueComposition={dashboard?.revenue_composition ?? []}
                period={period}
                onPeriodChange={(nextPeriod) => {
                    if (nextPeriod === period) return;
                    setDashboardLoading(true);
                    setPeriod(nextPeriod);
                }}
                isLoading={dashboardLoading}
            />

            <div className="grid min-w-0 grid-cols-1 items-start gap-4 xl:grid-cols-[minmax(300px,0.95fr)_minmax(0,1.85fr)]">
                {dashboardLoading ? (
                    <>
                        <Skeleton className="h-64 rounded-2xl" />
                        <RecentTicketsTable tickets={[]} loading />
                    </>
                ) : (
                    <>
                        <ConsignmentSummary products={dashboard?.consignment_products ?? []} />
                        <RecentTicketsTable
                            tickets={dashboard?.recent_tickets ?? []}
                            loading={dashboardLoading}
                        />
                    </>
                )}
            </div>
        </div>
    );
}
