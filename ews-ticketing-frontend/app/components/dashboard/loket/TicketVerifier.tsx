'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { QrCode, Camera, Search, CheckCircle2, AlertTriangle, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import CameraScannerModal from './CameraScannerModal';

export default function TicketVerifier() {
    const router = useRouter();
    const [ticketCode, setTicketCode] = useState<string>('');
    const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [scanResult, setScanResult] = useState<{ 
        success: boolean; 
        message: string; 
        name?: string; 
        details?: string;
        data?: any;
    } | null>(null);

    // Fungsi utama untuk memanggil API verifikasi backend Laravel
    const handleVerify = async (codeToVerify: string) => {
        const cleanCode = codeToVerify.trim().toUpperCase();
        if (!cleanCode) return;

        setIsLoading(true);
        setScanResult(null);

        try {
            const token = localStorage.getItem('token') || '';
            const backendBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000';

            const response = await fetch(`${backendBaseUrl}/api/tickets/verify`, {
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
                    data: ticketData
                });
                toast.success('Tiket berhasil diverifikasi!');
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
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
            <div>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <QrCode className="w-5 h-5 text-blue-600" />
                        <h2 className="text-lg font-bold text-slate-900">Verifikasi Tiket Masuk</h2>
                    </div>
                    <button 
                        type="button"
                        onClick={() => setIsCameraOpen(true)}
                        className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold rounded-lg border border-blue-200 transition flex items-center gap-1.5 cursor-pointer"
                    >
                        <Camera className="w-3.5 h-3.5" />
                        <span>Buka Kamera Scanner</span>
                    </button>
                </div>

                <p className="text-xs text-slate-500 mb-6">
                    Ketik kode unik e-pass pengunjung (contoh: <code className="text-blue-600 font-semibold">JT-261028-YXEI</code>) atau scan langsung menggunakan kamera.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <input 
                            type="text" 
                            value={ticketCode}
                            onChange={(e) => setTicketCode(e.target.value)}
                            placeholder="Masukkan Kode Tiket (Cth: JT-261028-YXEI)"
                            className="w-full pl-11 pr-32 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 uppercase tracking-wider transition font-medium"
                        />
                        <Search className="w-5 h-5 text-slate-400 absolute left-4 top-4" />
                        <button 
                            type="submit"
                            disabled={isLoading}
                            className="absolute right-2 top-2 bottom-2 px-5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Memeriksa...</span>
                                </>
                            ) : (
                                <span>Verifikasi</span>
                            )}
                        </button>
                    </div>
                </form>

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

            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>Pastikan status e-pass bertuliskan "Disetujui / Siap Digunakan".</span>
                <span className="text-blue-600 font-medium cursor-pointer hover:underline" onClick={() => { setTicketCode(''); setScanResult(null); }}>Reset</span>
            </div>

            {/* Modal Kamera Scanner yang Terhubung Langsung ke Backend */}
            <CameraScannerModal 
                isOpen={isCameraOpen}
                onClose={() => setIsCameraOpen(false)}
                onScanSuccess={(ticketData) => {
                    // Ketika kamera sukses memverifikasi lewat API, tampilkan hasilnya di card verifier
                    setTicketCode(ticketData.ticket_code || '');
                    setScanResult({
                        success: true,
                        message: 'Tiket sah! Silakan izinkan pengunjung masuk.',
                        name: `Destinasi: ${ticketData.destination?.name || 'Wisata'}`,
                        details: `Kode: ${ticketData.ticket_code} — Kunjungan: ${ticketData.visit_date} (${ticketData.visitor_count} Orang)`,
                        data: ticketData
                    });
                }}
            />
        </div>
    );
}