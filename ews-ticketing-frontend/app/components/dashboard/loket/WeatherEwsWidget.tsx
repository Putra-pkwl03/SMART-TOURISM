'use client';

import { useEffect, useState } from 'react';
import { Activity, ArrowRight, CloudRain, Droplet, Droplets, Thermometer, Wind } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { fetchWeatherData, type WeatherData } from '@/app/lib/weather';
import type { LoketDashboardData } from '@/app/lib/loket-dashboard';

export default function WeatherEwsWidget({ ews }: { ews: LoketDashboardData['ews'] }) {
    const router = useRouter();
    const [weather, setWeather] = useState<WeatherData | null>(null);

    useEffect(() => {
        let isActive = true;
        const loadWeather = async () => {
            const result = await fetchWeatherData();
            if (isActive) setWeather(result);
        };

        void loadWeather();
        const interval = window.setInterval(() => void loadWeather(), 10 * 60 * 1000);
        return () => {
            isActive = false;
            window.clearInterval(interval);
        };
    }, []);

    const isOnline = ews?.sensor_online ?? false;
    const statusColor = ews?.status === 'NORMAL'
        ? 'text-emerald-700'
        : ews?.status === 'WASPADA'
            ? 'text-amber-700'
            : ews?.status === 'AWAS'
                ? 'text-rose-700'
                : 'text-slate-500';
    const statusLabel = ews?.status === 'NORMAL'
        ? 'Normal'
        : ews?.status === 'WASPADA'
            ? 'Waspada'
            : ews?.status === 'AWAS'
                ? 'Awas'
                : 'Belum ada data';
    const rainfall = ews
        ? `${ews.rainfall.toLocaleString('id-ID')} mm/jam`
        : weather?.rainfall || 'Belum tersedia';
    const humidity = ews
        ? `${ews.humidity.toLocaleString('id-ID')}%`
        : weather?.humidity || 'Belum tersedia';

    return (
        <section className="flex h-full min-w-0 flex-col rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-emerald-600" />
                    <h2 className="text-sm font-extrabold text-slate-900 sm:text-base">Live EWS & Cuaca</h2>
                </div>
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                    isOnline ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                }`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                    {isOnline ? 'Sensor Online' : 'Sensor Offline'}
                </span>
            </div>

            <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-[0.9fr_1.1fr]">
                <div className="relative flex min-h-48 flex-col overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-700 via-teal-700 to-sky-800 p-4 text-white sm:min-h-0">
                    <div className="pointer-events-none absolute -bottom-9 -right-7 h-32 w-32 rounded-full border-[18px] border-white/5" />
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-white/90">
                            <Droplet className="h-4 w-4" />
                            Kondisi Sungai
                        </div>
                        <span className="rounded-full bg-white/15 px-2.5 py-1 text-[9px] font-bold text-white">
                            {statusLabel}
                        </span>
                    </div>
                    <div className="my-auto py-5">
                        <p className="text-[10px] font-medium text-white/75">Tinggi muka air</p>
                        <p className="mt-1 text-3xl font-extrabold tracking-tight">
                            {ews ? ews.water_level.toLocaleString('id-ID') : '—'}
                            {ews && <span className="ml-1 text-sm font-semibold text-white/80">m</span>}
                        </p>
                        <div className="mt-3 h-1 w-10 rounded-full bg-white/70" />
                    </div>
                    <p className="line-clamp-2 min-h-8 text-[10px] leading-relaxed text-white/85">
                        {ews?.description || 'Data telemetri sungai belum tersedia.'}
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-2 sm:grid-cols-1">
                    <div className="flex min-h-14 items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-2.5">
                        <span className="flex items-center gap-2 text-[11px] text-slate-600"><CloudRain className="h-4 w-4 shrink-0 text-sky-600" />Curah Hujan</span>
                        <span className="text-xs font-bold text-slate-800">{rainfall}</span>
                    </div>
                    <div className="flex min-h-14 items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-2.5">
                        <span className="flex items-center gap-2 text-[11px] text-slate-600"><Thermometer className="h-4 w-4 shrink-0 text-amber-600" />Suhu</span>
                        <span className="text-xs font-bold text-slate-800">{weather?.temperature || (ews ? `${ews.temperature} °C` : '—')}</span>
                    </div>
                    <div className="flex min-h-14 items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-2.5 min-[420px]:col-span-2 sm:col-span-1">
                        <span className="flex items-center gap-2 text-[11px] text-slate-600"><Droplets className="h-4 w-4 shrink-0 text-blue-600" />Kelembapan</span>
                        <span className="text-xs font-bold text-slate-800">{humidity}</span>
                    </div>
                    <div className="flex min-h-14 items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-2.5 min-[420px]:col-span-2 sm:col-span-1">
                        <span className="flex min-w-0 items-center gap-2 text-[11px] text-slate-600"><Wind className="h-4 w-4 shrink-0 text-blue-600" />Cuaca{weather?.city ? ` · ${weather.city}` : ''}</span>
                        <span className="max-w-[55%] break-words text-right text-xs font-bold capitalize leading-snug text-slate-800">
                            {weather?.description || 'Belum tersedia'}
                        </span>
                    </div>
                </div>
            </div>

            <div className={`mt-3 flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-[10px] font-semibold ${
                ews ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-50 text-slate-600'
            }`}>
                <span className="min-w-0 truncate">Status EWS: <span className={statusColor}>{statusLabel}</span></span>
                <button
                    type="button"
                    onClick={() => router.push('/dashboard/officer/ews')}
                    className="inline-flex shrink-0 cursor-pointer items-center gap-1 hover:underline"
                >
                    Detail EWS <ArrowRight className="h-3.5 w-3.5" />
                </button>
            </div>
        </section>
    );
}
