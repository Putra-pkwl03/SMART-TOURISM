'use client';

import { Activity, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function WeatherEwsWidget() {
    const router = useRouter();

    return (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
            <div>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Activity className="w-5 h-5 text-emerald-600" />
                        <h2 className="text-lg font-bold text-slate-900">Status EWS & Cuaca</h2>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                        SENSOR ONLINE
                    </span>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed mb-6">
                    Pemantauan sensor kelembapan, curah hujan di hulu sungai, dan ketinggian permukaan air sungai secara otomatis.
                </p>

                <div className="space-y-3">
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                        <span className="text-xs text-slate-500">Curah Hujan Hulu</span>
                        <span className="text-xs font-bold text-slate-800">0.2 mm/jam (Cerah)</span>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                        <span className="text-xs text-slate-500">Ketinggian Air Sungai</span>
                        <span className="text-xs font-bold text-emerald-600">45 cm (Normal)</span>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                        <span className="text-xs text-slate-500">Rekomendasi Aktivitas</span>
                        <span className="text-xs font-bold text-emerald-600">Jalur Canyoneering DIBUKA</span>
                    </div>
                </div>
            </div>

            <button 
                onClick={() => router.push('/dashboard/officer/ews')}
                className="w-full mt-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-2 border border-slate-200 cursor-pointer"
            >
                <span>Lihat Detail Telemetri EWS</span>
                <ArrowRight className="w-4 h-4" />
            </button>
        </div>
    );
}