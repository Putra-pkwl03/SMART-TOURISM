'use client';

import Link from 'next/link';
import { ArrowRight, RefreshCw } from 'lucide-react';
import type { LoketDashboardData } from '@/app/lib/loket-dashboard';

interface TicketLogTableProps {
    logs: LoketDashboardData['recent_logs'];
    loading: boolean;
    onRefresh: () => void;
}

export default function TicketLogTable({ logs, loading, onRefresh }: TicketLogTableProps) {
    return (
        <section className="flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-sm font-extrabold text-slate-900">Log Verifikasi Tiket Terakhir</h2>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={onRefresh}
                        className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-500 hover:text-emerald-700"
                        aria-label="Refresh log verifikasi"
                    >
                        <RefreshCw className="h-3.5 w-3.5" />
                        Refresh
                    </button>
                    <Link href="/dashboard/officer/scan" className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-600 hover:underline">
                        Lihat Semua <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                </div>
            </div>

            <div className="flex-1 overflow-x-auto">
                <table className="w-full min-w-[560px] text-left text-xs">
                    <thead className="rounded-xl bg-slate-50 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                        <tr>
                            <th className="rounded-l-lg px-3 py-3">Kode E-Pass</th>
                            <th className="px-3 py-3">Nama Pemesan</th>
                            <th className="px-3 py-3">Destinasi</th>
                            <th className="px-3 py-3">Waktu Scan</th>
                            <th className="rounded-r-lg px-3 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading && logs.length === 0 ? (
                            <tr><td colSpan={5} className="py-10 text-center text-slate-400">Memuat log verifikasi...</td></tr>
                        ) : logs.length === 0 ? (
                            <tr><td colSpan={5} className="py-10 text-center text-slate-400">Belum ada tiket yang dipindai.</td></tr>
                        ) : logs.map((log) => (
                            <tr key={log.id} className="text-slate-700 hover:bg-slate-50/70">
                                <td className="whitespace-nowrap px-3 py-3 font-mono font-bold text-slate-900">{log.ticket_code}</td>
                                <td className="px-3 py-3 font-medium">{log.visitor_name}</td>
                                <td className="max-w-40 truncate px-3 py-3 text-slate-500">{log.destination_name}</td>
                                <td className="whitespace-nowrap px-3 py-3 text-slate-500">
                                    {new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit' }).format(new Date(log.used_at))} WIB
                                </td>
                                <td className="px-3 py-3">
                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                        Berhasil
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
