'use client';

import { RefreshCw } from 'lucide-react';

export default function TicketLogTable() {
    return (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-900">Log Verifikasi Tiket Terakhir (Shift Ini)</h3>
                <button className="text-slate-500 hover:text-slate-800 text-xs flex items-center gap-1 font-medium cursor-pointer">
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Refresh Data</span>
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                    <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200">
                        <tr>
                            <th className="p-3 rounded-l-xl font-semibold">Kode E-Pass</th>
                            <th className="p-3 font-semibold">Nama Pemesan</th>
                            <th className="p-3 font-semibold">Kategori Paket</th>
                            <th className="p-3 font-semibold">Waktu Scan</th>
                            <th className="p-3 rounded-r-xl font-semibold">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        <tr className="hover:bg-slate-50/50">
                            <td className="p-3 font-mono text-blue-600 font-bold">JT-261028-YXEI</td>
                            <td className="p-3 font-medium text-slate-900">Budi Santoso</td>
                            <td className="p-3 text-slate-500">Air Terjun & Camping Ground (2 Pax)</td>
                            <td className="p-3 text-slate-500">10:42:15 WIB</td>
                            <td className="p-3">
                                <span className="px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                                    BERHASIL
                                </span>
                            </td>
                        </tr>
                        <tr className="hover:bg-slate-50/50">
                            <td className="p-3 font-mono text-blue-600 font-bold">JT-261028-SITI</td>
                            <td className="p-3 font-medium text-slate-900">Siti Nurhaliza</td>
                            <td className="p-3 text-slate-500">Tiket Masuk Reguler</td>
                            <td className="p-3 text-slate-500">10:35:01 WIB</td>
                            <td className="p-3">
                                <span className="px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                                    BERHASIL
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}