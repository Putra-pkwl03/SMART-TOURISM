'use client';

import { ShieldCheck, CloudSun, ArrowRight } from 'lucide-react';

export default function EwsWeatherWidget() {
    return (
        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 sm:p-7 shadow-2xl border border-emerald-100 text-slate-800 max-w-md w-full">
            {/* Header Status */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <span className="text-xs sm:text-xs font-bold uppercase tracking-wider text-slate-700">EWS & Status Cuaca</span>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px] uppercase flex items-center gap-1.5 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    Aman
                </span>
            </div>

            {/* Weather Main Info */}
            <div className="flex items-center justify-between my-4">
                <div>
                    <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">28°C</div>
                    <p className="text-sm sm:text-base text-slate-600 font-semibold mt-1">Cerah Berawan</p>
                </div>
                <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 shadow-inner border border-amber-100/60">
                    <CloudSun className="w-9 h-9" />
                </div>
            </div>

            {/* Grid Metrics */}
            <div className="grid grid-cols-3 gap-2.5 py-3.5 bg-slate-50/80 rounded-2xl px-4 mb-4 text-center border border-slate-100">
                <div>
                    <span className="block text-[11px] text-slate-400 uppercase font-bold tracking-wider">Hujan</span>
                    <span className="text-sm sm:text-base font-extrabold text-slate-800">0%</span>
                </div>
                <div className="border-x border-slate-200">
                    <span className="block text-[11px] text-slate-400 uppercase font-bold tracking-wider">Angin</span>
                    <span className="text-sm sm:text-base font-extrabold text-slate-800">12 <span className="text-xs font-semibold text-slate-500">km/j</span></span>
                </div>
                <div>
                    <span className="block text-[11px] text-slate-400 uppercase font-bold tracking-wider">Kelembapan</span>
                    <span className="text-sm sm:text-base font-extrabold text-slate-800">68%</span>
                </div>
            </div>

            {/* Description Note */}
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4 font-medium">
                Kondisi wisata saat ini aman untuk berkunjung. Tetap utamakan keselamatan ya!
            </p>

            {/* Footer Action Link */}
            <a href="#ews-detail" className="text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 flex items-center justify-between group pt-2 border-t border-slate-100">
                <span>Lihat Detail Cuaca & Peringatan Dini</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </a>
        </div>
    );
}