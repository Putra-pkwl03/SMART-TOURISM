'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import LoketStats from '@/app/components/dashboard/loket/LoketStats';
import TicketVerifier from '@/app/components/dashboard/loket/TicketVerifier';
import WeatherEwsWidget from '@/app/components/dashboard/loket/WeatherEwsWidget';
import TicketLogTable from '@/app/components/dashboard/loket/TicketLogTable';
import TicketValidationTrend from '@/app/components/dashboard/loket/TicketValidationTrend';
import { apiClient } from '@/app/lib/axios';
import type { LoketDashboardData } from '@/app/lib/loket-dashboard';
import { LoketDashboardSkeleton } from '@/app/components/dashboard/shared/DashboardSkeleton';

export default function LoketDashboardPage() {
    const [period, setPeriod] = useState<7 | 30 | 90>(7);
    const [dashboard, setDashboard] = useState<LoketDashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        let isActive = true;

        const loadDashboard = async () => {
            try {
                const response = await apiClient.get<LoketDashboardData>('/loket/dashboard-summary', {
                    params: { period },
                });
                if (!isActive) return;
                setDashboard(response.data);
                setError(null);
            } catch (requestError: unknown) {
                if (!isActive) return;
                console.error('Gagal memuat dashboard loket:', requestError);
                const message = axios.isAxiosError(requestError)
                    ? requestError.response?.data?.message || requestError.message
                    : requestError instanceof Error
                        ? requestError.message
                        : 'Gagal memuat data dashboard loket.';
                setError(message);
            } finally {
                if (isActive) setIsLoading(false);
            }
        };

        void loadDashboard();
        const refreshInterval = window.setInterval(() => void loadDashboard(), 60 * 1000);
        return () => {
            isActive = false;
            window.clearInterval(refreshInterval);
        };
    }, [period, refreshKey]);

    const refreshDashboard = () => {
        setIsLoading(true);
        setRefreshKey((key) => key + 1);
    };

    return (
        <div className="space-y-4 text-slate-900 sm:space-y-5">

            {error && (
                <div role="alert" className="flex flex-col gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-medium text-rose-700 sm:flex-row sm:items-center sm:justify-between">
                    <span>Data dashboard loket gagal dimuat: {error}</span>
                    <button type="button" onClick={refreshDashboard} className="font-bold underline underline-offset-2">Coba lagi</button>
                </div>
            )}

            {isLoading && !dashboard ? (
                <LoketDashboardSkeleton />
            ) : (
                <>
                    <LoketStats
                        summary={dashboard?.summary ?? { verified_tickets_today: 0, visitors_today: 0 }}
                        ews={dashboard?.ews ?? null}
                    />

                    <div className="grid min-w-0 grid-cols-1 items-stretch gap-4 xl:grid-cols-[1.05fr_0.95fr]">
                        <TicketVerifier onVerified={refreshDashboard} />
                        <WeatherEwsWidget ews={dashboard?.ews ?? null} />
                    </div>

                    <div className="grid min-w-0 grid-cols-1 items-stretch gap-4 xl:grid-cols-[1.05fr_0.95fr]">
                        <TicketValidationTrend
                            data={dashboard?.trend ?? []}
                            period={period}
                            isLoading={isLoading}
                            onPeriodChange={(nextPeriod) => {
                                if (nextPeriod === period) return;
                                setIsLoading(true);
                                setPeriod(nextPeriod);
                            }}
                        />
                        <TicketLogTable
                            logs={dashboard?.recent_logs ?? []}
                            loading={isLoading}
                            onRefresh={refreshDashboard}
                        />
                    </div>
                </>
            )}
        </div>
    );
}
