'use client';

import { QrCode, Activity, CheckCircle2, ShieldAlert, Users } from 'lucide-react';

export default function LoketStats() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-xs text-slate-500 mb-1 font-medium">Tiket Diverifikasi</p>
                    <h3 className="text-2xl font-bold text-slate-900">142</h3>
                    <p className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Shift Pagi Aktif
                    </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                    <QrCode className="w-6 h-6" />
                </div>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-xs text-slate-500 mb-1 font-medium">Pengunjung di Area</p>
                    <h3 className="text-2xl font-bold text-slate-900">310 / 500</h3>
                    <p className="text-[11px] text-blue-600 mt-1 flex items-center gap-1 font-medium">
                        <Users className="w-3.5 h-3.5" /> Kuota Aman (62%)
                    </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                    <Users className="w-6 h-6" />
                </div>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-xs text-slate-500 mb-1 font-medium">Kondisi Debit Air</p>
                    <h3 className="text-2xl font-bold text-emerald-600">Normal</h3>
                    <p className="text-[11px] text-slate-500 mt-1">Aman untuk Canyoneering</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                    <Activity className="w-6 h-6" />
                </div>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-xs text-slate-500 mb-1 font-medium">Status EWS Cuaca</p>
                    <h3 className="text-2xl font-bold text-emerald-600">SIAGA 3 (AMAN)</h3>
                    <p className="text-[11px] text-slate-500 mt-1">Tingkat bahaya rendah</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                    <ShieldAlert className="w-6 h-6" />
                </div>
            </div>
        </div>
    );
}