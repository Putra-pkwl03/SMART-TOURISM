'use client';

import { Clock } from 'lucide-react';

interface LoketHeaderProps {
    currentTime: string;
}

export default function LoketHeader({ currentTime }: LoketHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
            <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-2 border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Loket Operasional: Gerbang Utama Jurug Gedhe
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard Petugas Loket</h1>
                <p className="text-sm text-slate-500 mt-1">
                    Validasi karcis e-ticket pengunjung dan pantau peringatan bahaya cuaca / EWS sungai secara langsung.
                </p>
            </div>

            <div className="flex items-center gap-3 bg-slate-50 px-4 py-3 rounded-2xl border border-slate-200">
                <Clock className="w-5 h-5 text-blue-600" />
                <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Waktu Real-time</p>
                    <p className="text-sm font-mono font-bold text-slate-800">{currentTime || '--:--:--'}</p>
                </div>
            </div>
        </div>
    );
}