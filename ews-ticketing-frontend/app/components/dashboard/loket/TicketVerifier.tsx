'use client';

import { useState } from 'react';
import { Camera, CheckCircle2, Loader2, QrCode, Search, ShieldCheck, X, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import InlineScanner from './sceener/InlineScanner';
import { getApiUrl } from '@/app/lib/backend-url';

interface TicketVerifierProps {
    onVerified?: () => void;
}

export default function TicketVerifier({ onVerified }: TicketVerifierProps) {
    const [ticketCode, setTicketCode] = useState<string>('');
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [scanResult, setScanResult] = useState<{ 
        success: boolean; 
        message: string; 
        name?: string; 
        details?: string;
    } | null>(null);

    // Fungsi utama untuk memanggil API verifikasi backend Laravel
    const handleVerify = async (codeToVerify: string) => {
        const cleanCode = codeToVerify.trim().toUpperCase();
        if (!cleanCode) return;

        setIsLoading(true);
        setScanResult(null);

        try {
            const token = localStorage.getItem('token') || '';
            const response = await fetch(`${getApiUrl()}/tickets/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ ticket_code: cleanCode })
            });

            const result = await response.json();

            if (response.ok) {
                const ticketData = result.data;
                setScanResult({
                    success: true,
                    message: result.message || 'Tiket sah! Silakan izinkan pengunjung masuk.',
                    name: `Destinasi: ${ticketData.destination?.name || 'Wisata'}`,
                    details: `Kode: ${ticketData.ticket_code} — Kunjungan: ${ticketData.visit_date} (${ticketData.visitor_count} Orang)`,
                });
                toast.success('Tiket berhasil diverifikasi!');
                onVerified?.();
            } else {
                setScanResult({
                    success: false,
                    message: result.message || 'Verifikasi tiket gagal.',
                    details: `Kode "${cleanCode}" tidak valid, sudah digunakan, atau kedaluwarsa.`
                });
                toast.error(result.message || 'Tiket tidak valid.');
            }
        } catch (error) {
            console.error('Error verifying ticket:', error);
            setScanResult({
                success: false,
                message: 'Kesalahan Koneksi Server',
                details: 'Gagal menghubungi server backend. Pastikan server aktif.'
            });
            toast.error('Gagal terhubung ke server.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleVerify(ticketCode);
    };

    return (
        <section className="flex h-full flex-col justify-between rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
            <div>
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <QrCode className="h-5 w-5 text-emerald-700" />
                        <h2 className="text-sm font-extrabold text-slate-900 sm:text-base">Verifikasi Tiket Masuk</h2>
                    </div>
                    <button 
                        type="button"
                        onClick={() => setIsScannerOpen((open) => !open)}
                        className="inline-flex h-8 w-40 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-3 text-[10px] font-semibold text-emerald-800 transition hover:bg-emerald-100"
                    >
                        <Camera className="h-3.5 w-3.5" />
                        <span>{isScannerOpen ? 'Tutup Kamera' : 'Buka Kamera Scanner'}</span>
                    </button>
                </div>

                <p className="mb-4 text-[11px] text-slate-500">
                    Scan kode QR atau masukkan kode e-pass untuk memvalidasi tiket pengunjung.
                </p>

                <div className="grid items-stretch gap-4 md:grid-cols-[1.15fr_0.85fr]">
                    <div className="relative h-56 min-w-0 overflow-hidden rounded-xl md:h-64">
                        {isScannerOpen ? (
                            <InlineScanner
                                onScanSuccess={(ticketData) => {
                                    setTicketCode(ticketData.ticket_code || '');
                                    setScanResult({
                                        success: true,
                                        message: 'Tiket sah! Silakan izinkan pengunjung masuk.',
                                        name: `Destinasi: ${ticketData.destination?.name || 'Wisata'}`,
                                        details: `Kode: ${ticketData.ticket_code} — Kunjungan: ${ticketData.visit_date} (${ticketData.visitor_count} Orang)`,
                                    });
                                    onVerified?.();
                                }}
                            />
                        ) : (
                            <button
                                type="button"
                                onClick={() => setIsScannerOpen(true)}
                                className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-blue-200 bg-slate-50/80 px-4 py-5 text-center text-xs text-slate-600 transition hover:border-emerald-300 hover:bg-emerald-50/40"
                            >
                                <Camera className="h-8 w-8 text-slate-500" />
                                <span className="font-semibold">Klik untuk membuka kamera</span>
                                <span className="text-[10px] text-slate-400">atau gunakan input kode e-pass</span>
                            </button>
                        )}
                        {isScannerOpen && (
                            <button
                                type="button"
                                onClick={() => setIsScannerOpen(false)}
                                className="absolute right-3 top-3 inline-flex cursor-pointer items-center gap-1 rounded-lg bg-slate-950/75 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-950"
                            >
                                <X className="h-3.5 w-3.5" />
                                Tutup kamera
                            </button>
                        )}
                    </div>

                    <div className="flex min-w-0 flex-col justify-center rounded-xl border border-slate-100 bg-slate-50/70 p-4 sm:p-5">
                        <div className="mb-3 flex items-center gap-2 text-xs font-bold text-slate-700">
                            <ShieldCheck className="h-4 w-4 text-emerald-600" />
                            Validasi dengan kode tiket
                        </div>
                        <p className="mb-4 text-[11px] leading-relaxed text-slate-500">
                            Masukkan kode e-pass yang tertera pada tiket jika tidak menggunakan kamera.
                        </p>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={ticketCode}
                                    onChange={(e) => setTicketCode(e.target.value)}
                                    placeholder="Contoh: JT-261104-Z0ZO"
                                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-24 text-[11px] font-bold uppercase tracking-wider text-slate-900 outline-none transition placeholder:font-medium placeholder:normal-case placeholder:tracking-normal focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                                />
                                <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="absolute bottom-1.5 right-1.5 top-1.5 flex cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-emerald-700 px-3 text-[10px] font-bold text-white shadow-sm transition hover:bg-emerald-800 disabled:opacity-50"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            <span>Memeriksa...</span>
                                        </>
                                    ) : (
                                        <span>Verifikasi</span>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Hasil Validasi dari Backend */}
                {scanResult && (
                    <div className={`mt-4 p-4 rounded-2xl border flex items-start justify-between ${
                        scanResult.success 
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                            : 'bg-red-50 border-red-200 text-red-900'
                    }`}>
                        <div className="flex items-start gap-3">
                            {scanResult.success ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                            ) : (
                                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            )}
                            <div>
                                <p className="text-sm font-bold">{scanResult.message}</p>
                                {scanResult.name && <p className="text-xs font-semibold text-slate-800 mt-0.5">{scanResult.name}</p>}
                                {scanResult.details && <p className="text-[11px] text-slate-600 mt-1">{scanResult.details}</p>}
                            </div>
                        </div>
                        <button type="button" onClick={() => setScanResult(null)} className="text-slate-400 hover:text-slate-700">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>

            <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-3 text-[10px] text-slate-400">
                <span>Tiket harus berstatus disetujui / siap digunakan.</span>
                <button type="button" className="font-medium text-emerald-700 hover:underline" onClick={() => { setTicketCode(''); setScanResult(null); }}>Reset</button>
            </div>

        </section>
    );
}