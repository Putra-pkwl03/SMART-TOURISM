'use client';

import { ShieldCheck, CloudSun, ArrowRight } from 'lucide-react';

export default function EwsWeatherWidget() {
    return (
        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-5 shadow-xl border border-slate-100 text-slate-800 max-w-sm w-full">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700">EWS & Status Cuaca</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px] uppercase flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    Aman
                </span>
            </div>

            <div className="flex items-center justify-between my-3">
                <div>
                    <div className="text-3xl font-black text-slate-900">28°C</div>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">Cerah Berawan</p>
                </div>
                <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500">
                    <CloudSun className="w-7 h-7" />
                </div>
            </div>

            <div className="grid grid-cols-3 gap-2 py-2.5 bg-slate-50 rounded-xl px-3 mb-3 text-center">
                <div>
                    <span className="block text-[10px] text-slate-400 uppercase font-semibold">Hujan</span>
                    <span className="text-xs font-bold text-slate-700">0%</span>
                </div>
                <div className="border-x border-slate-200">
                    <span className="block text-[10px] text-slate-400 uppercase font-semibold">Angin</span>
                    <span className="text-xs font-bold text-slate-700">12 km/jam</span>
                </div>
                <div>
                    <span className="block text-[10px] text-slate-400 uppercase font-semibold">Kelembapan</span>
                    <span className="text-xs font-bold text-slate-700">68%</span>
                </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed mb-3">
                Kondisi wisata saat ini aman untuk berkunjung. Tetap utamakan keselamatan ya!
            </p>

            <a href="#ews-detail" className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 group">
                <span>Lihat Detail Cuaca & Peringatan Dini</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </a>
        </div>
    );
}