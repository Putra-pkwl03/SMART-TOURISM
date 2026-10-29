'use client';

import { useState, useEffect } from 'react';
import { Scan, Search, CheckCircle2, UserCheck, Calendar, Users, ShieldAlert, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { apiClient } from '@/app/lib/axios';
import InlineScanner from '../../../components/dashboard/loket/sceener/InlineScanner';

interface ValidatedVisitor {
    id: number;
    ticket_code: string;
    destination_name: string;
    visit_date: string;
    visitor_count: number;
    used_at: string;
}

export default function OfficerScanPage() {
    const [manualCode, setManualCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingLogs, setIsFetchingLogs] = useState(true);
    const [visitorLogs, setVisitorLogs] = useState<ValidatedVisitor[]>([]);

    // 1. Ambil log riwayat dari database saat halaman dimuat
    const fetchScannedLogs = async () => {
        try {
            const response = await apiClient.get('/tickets/scanned-logs');
            const formattedLogs = (response.data.data || []).map((item: any) => ({
                id: item.id,
                ticket_code: item.ticket_code,
                destination_name: item.destination?.name || 'Destinasi Wisata',
                visit_date: item.visit_date,
                visitor_count: item.visitor_count,
                used_at: item.used_at 
                    ? new Date(item.used_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                    : '-'
            }));
            setVisitorLogs(formattedLogs);
        } catch (error) {
            console.error('Gagal memuat log scan:', error);
        } finally {
            setIsFetchingLogs(false);
        }
    };

    useEffect(() => {
        fetchScannedLogs();
    }, []);

    // 2. Tambah data ke tabel log secara lokal & real-time saat berhasil verifikasi (via kamera)
    const handleAddLog = (ticketData: any) => {
        const newLog: ValidatedVisitor = {
            id: ticketData.id || Date.now(),
            ticket_code: ticketData.ticket_code,
            destination_name: ticketData.destination?.name || 'Destinasi Wisata',
            visit_date: ticketData.visit_date,
            visitor_count: ticketData.visitor_count,
            used_at: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        };

        setVisitorLogs((prev) => [newLog, ...prev]);
    };

    // 3. Handler submit manual lewat input teks
    const handleManualSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const code = manualCode.trim().toUpperCase();
        if (!code) return;

        setIsLoading(true);
        try {
            const response = await apiClient.post('/tickets/verify', { ticket_code: code });
            const result = response.data;

            toast.success(result.message || 'Tiket sah!');
            handleAddLog(result.data);
            setManualCode('');
        } catch (error: any) {
            const msg = error.response?.data?.message || 'Gagal memverifikasi tiket.';
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header Halaman */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <div>
                    <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
                        <Scan className="w-6 h-6 text-emerald-600" />
                        <span>Validasi E-Ticket Gerbang Masuk</span>
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">
                        Gunakan kamera scanner di bawah atau ketik kode unik e-pass untuk memvalidasi pengunjung secara instan.
                    </p>
                </div>
                <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 w-fit">
                    <UserCheck className="w-4 h-4 text-emerald-600" />
                    <span>Total Masuk Sesi Ini: {visitorLogs.reduce((acc, curr) => acc + curr.visitor_count, 0)} Orang</span>
                </div>
            </div>

            {/* Layout 2 Kolom (Kiri: Kamera & Manual, Kanan: Tabel Log Pengunjung) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* SISI KIRI: Scanner Kamera Inline & Input Manual */}
                <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
                    <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Live Camera Scanner
                    </h2>

                    {/* Komponen Kamera Inline Tanpa Modal */}
                    <InlineScanner onScanSuccess={handleAddLog} />

                    <div className="relative flex py-2 items-center">
                        <div className="flex-grow border-t border-slate-200"></div>
                        <span className="flex-shrink mx-4 text-slate-400 text-[11px] uppercase tracking-widest font-bold">Atau Input Manual</span>
                        <div className="flex-grow border-t border-slate-200"></div>
                    </div>

                    {/* Form Input Kode Manual */}
                    <form onSubmit={handleManualSubmit} className="space-y-3">
                        <div className="relative">
                            <input 
                                type="text"
                                value={manualCode}
                                onChange={(e) => setManualCode(e.target.value)}
                                placeholder="Contoh: JT-261028-YXEI"
                                className="w-full pl-10 pr-28 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-xs font-mono uppercase font-bold outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition"
                            />
                            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                            <button 
                                type="submit"
                                disabled={isLoading}
                                className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-sm cursor-pointer disabled:opacity-50 flex items-center gap-1"
                            >
                                {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <span>Cek</span>}
                            </button>
                        </div>
                    </form>
                </div>

                {/* SISI KANAN: Tabel Data Log Pengunjung yang Masuk */}
                <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                                Log Pengunjung Masuk Real-Time
                            </h2>
                            <span className="text-xs text-slate-400 font-medium">
                                {visitorLogs.length} Tiket Tervalidasi
                            </span>
                        </div>

                        {isFetchingLogs ? (
                            <div className="py-20 text-center flex flex-col items-center justify-center">
                                <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mb-2" />
                                <p className="text-xs text-slate-400">Memuat riwayat log...</p>
                            </div>
                        ) : visitorLogs.length === 0 ? (
                            <div className="py-20 text-center flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-2xl">
                                <ShieldAlert className="w-10 h-10 text-slate-300 mb-2" />
                                <p className="text-xs font-semibold text-slate-600">Belum ada pengunjung yang divalidasi sesi ini.</p>
                                <p className="text-[11px] text-slate-400 mt-0.5">Arahkan kamera ke e-ticket atau masukkan kode untuk mulai.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto max-h-[380px] overflow-y-auto pr-1">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-100 text-[11px] text-slate-400 uppercase font-bold tracking-wider">
                                            <th className="py-3 px-2">Kode E-Pass</th>
                                            <th className="py-3 px-2">Destinasi</th>
                                            <th className="py-3 px-2">Jml / Tanggal</th>
                                            <th className="py-3 px-2 text-right">Jam Masuk</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-xs">
                                        {visitorLogs.map((log, idx) => (
                                            <tr key={idx} className="hover:bg-slate-50/80 transition">
                                                <td className="py-3 px-2 font-mono font-bold text-emerald-700 flex items-center gap-1.5">
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                                                    {log.ticket_code}
                                                </td>
                                                <td className="py-3 px-2 font-semibold text-slate-800">
                                                    {log.destination_name}
                                                </td>
                                                <td className="py-3 px-2 text-slate-600 space-y-0.5">
                                                    <div className="flex items-center gap-1">
                                                        <Users className="w-3 h-3 text-slate-400" /> {log.visitor_count} Orang
                                                    </div>
                                                    <div className="flex items-center gap-1 text-[10px] text-slate-400">
                                                        <Calendar className="w-3 h-3" /> {log.visit_date}
                                                    </div>
                                                </td>
                                                <td className="py-3 px-2 text-right font-bold font-mono text-slate-700">
                                                    {log.used_at}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                        <span>Data tersinkronisasi langsung dengan database server.</span>
                        <button 
                            type="button" 
                            onClick={fetchScannedLogs}
                            className="text-emerald-600 hover:underline font-semibold cursor-pointer"
                        >
                            Muat Ulang Log
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}