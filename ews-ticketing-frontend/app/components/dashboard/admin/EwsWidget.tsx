'use client';

import { Activity, Droplets, CloudRain, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface EwsWidgetProps {
    data: {
        water_level: string;
        rainfall: string;
        temperature: string;
        humidity: string;
        status: string;
        description: string;
    };
}

export default function EwsWidget({ data }: EwsWidgetProps) {
    const isNormal = data?.status === 'NORMAL';

    return (
        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl border border-slate-800 relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-600 rounded-xl text-white shadow-lg">
                        <Activity className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-sm tracking-wide">Monitoring EWS Hulu Sungai</h3>
                        <p className="text-xs text-slate-400">Sensor IoT Cibeet & Curah Hujan Otomatis</p>
                    </div>
                </div>
                <span className={`px-3 py-1 text-xs font-bold rounded-full border flex items-center gap-1.5 ${
                    isNormal 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                        : 'bg-red-500/10 text-red-400 border-red-500/20 animate-pulse'
                }`}>
                    {isNormal ? <CheckCircle2 className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />}
                    <span>{data?.status || 'NORMAL'}</span>
                </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/60">
                    <p className="text-[11px] text-slate-400 mb-1 flex items-center gap-1"><Droplets className="w-3.5 h-3.5 text-blue-400" /> Tinggi Muka Air</p>
                    <p className="text-xl font-bold text-white">{data?.water_level || '1.35 m'}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Ambang batas normal</p>
                </div>

                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/60">
                    <p className="text-[11px] text-slate-400 mb-1 flex items-center gap-1"><CloudRain className="w-3.5 h-3.5 text-indigo-400" /> Curah Hujan</p>
                    <p className="text-xl font-bold text-white">{data?.rainfall || '12.4 mm/h'}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Intensitas ringan</p>
                </div>

                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/60">
                    <p className="text-[11px] text-slate-400 mb-1">Suhu Udara</p>
                    <p className="text-xl font-bold text-white">{data?.temperature || '28.6 °C'}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Stasiun Klimatologi</p>
                </div>

                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/60">
                    <p className="text-[11px] text-slate-400 mb-1">Kelembapan</p>
                    <p className="text-xl font-bold text-white">{data?.humidity || '72.0 %'}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Relatif stabil</p>
                </div>
            </div>

            <p className="text-xs text-slate-400 bg-slate-950/40 p-3 rounded-xl border border-slate-800/40">
                <span className="font-semibold text-slate-300">Catatan Sistem:</span> {data?.description || 'Semua sistem operasional aman untuk aktivitas susur sungai (canyoneering).'}
            </p>
        </div>
    );
}