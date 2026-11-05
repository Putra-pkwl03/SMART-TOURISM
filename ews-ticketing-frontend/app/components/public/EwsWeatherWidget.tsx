'use client';

import { useEffect, useState } from 'react';
import { ShieldCheck, CloudSun, ArrowRight } from 'lucide-react';
import { fetchWeatherData, type WeatherData } from '@/app/lib/weather';

export default function EwsWeatherWidget() {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isActive = true;

        const loadWeather = async () => {
            const result = await fetchWeatherData();
            if (!isActive) return;
            setWeather(result);
            setLoading(false);
        };

        void loadWeather();
        const refreshInterval = window.setInterval(() => {
            void loadWeather();
        }, 10 * 60 * 1000);

        return () => {
            isActive = false;
            window.clearInterval(refreshInterval);
        };
    }, []);

    return (
        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 sm:p-7 shadow-2xl border border-emerald-100 text-slate-800 max-w-md w-full">
            {/* Header Status */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <span className="text-xs sm:text-xs font-bold uppercase tracking-wider text-slate-700">EWS & Status Cuaca</span>
                </div>
                <span className={`px-3 py-1 rounded-full border font-bold text-[10px] uppercase flex items-center gap-1.5 shadow-sm ${
                    weather
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-slate-50 text-slate-500 border-slate-200'
                }`}>
                    <span className={`w-2 h-2 rounded-full ${weather ? 'bg-emerald-500' : 'bg-slate-400'} ${weather ? 'animate-pulse' : ''}`} />
                    {loading ? 'Memuat' : weather ? 'Terkini' : 'Tidak tersedia'}
                </span>
            </div>

            {/* Weather Main Info */}
            <div className="flex items-center justify-between my-4">
                <div>
                    <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                        {weather?.temperature || (loading ? 'Memuat...' : '—')}
                    </div>
                    <p className="text-sm sm:text-base text-slate-600 font-semibold mt-1 capitalize">
                        {weather?.description || (loading ? 'Mengambil data cuaca...' : 'Data cuaca belum tersedia')}
                    </p>
                    {weather?.city && <p className="text-xs text-slate-400 mt-1">{weather.city}</p>}
                </div>
                <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 shadow-inner border border-amber-100/60">
                    <CloudSun className="w-9 h-9" />
                </div>
            </div>

            {/* Grid Metrics */}
            <div className="grid grid-cols-3 gap-2.5 py-3.5 bg-slate-50/80 rounded-2xl px-4 mb-4 text-center border border-slate-100">
                <div>
                    <span className="block text-[11px] text-slate-400 uppercase font-bold tracking-wider">Hujan</span>
                    <span className="text-sm sm:text-base font-extrabold text-slate-800">{weather?.rainfall || '—'}</span>
                </div>
                <div className="border-x border-slate-200">
                    <span className="block text-[11px] text-slate-400 uppercase font-bold tracking-wider">Angin</span>
                    <span className="text-sm sm:text-base font-extrabold text-slate-800">{weather?.wind_speed || '—'}</span>
                </div>
                <div>
                    <span className="block text-[11px] text-slate-400 uppercase font-bold tracking-wider">Kelembapan</span>
                    <span className="text-sm sm:text-base font-extrabold text-slate-800">{weather?.humidity || '—'}</span>
                </div>
            </div>

            {/* Description Note */}
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4 font-medium">
                {weather
                    ? 'Data cuaca diperbarui otomatis. Ikuti informasi dan arahan keselamatan di lokasi wisata.'
                    : loading
                        ? 'Data cuaca sedang dimuat.'
                        : 'Data cuaca sementara tidak tersedia. Silakan coba beberapa saat lagi.'}
            </p>

            {/* Footer Action Link */}
            <a href="#ews-detail" className="text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 flex items-center justify-between group pt-2 border-t border-slate-100">
                <span>Lihat Detail Cuaca & Peringatan Dini</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </a>
        </div>
    );
}