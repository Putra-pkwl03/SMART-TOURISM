'use client';

import { CheckCircle2, Ticket, ArrowRight, ShieldAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SuccessTicketModalProps {
    isOpen: boolean;
    ticketCode?: string;
    destinationName: string;
    ticketCount: number;
    onClose: () => void;
}

export default function SuccessTicketModal({ 
    isOpen, 
    ticketCode, 
    destinationName, 
    ticketCount, 
    onClose 
}: SuccessTicketModalProps) {
    const router = useRouter();

    if (!isOpen) return null;

    const handleGoToHistory = () => {
        onClose();
        router.push('/tickets/history'); // Sesuaikan dengan route halaman riwayat/e-ticket Anda
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 flex flex-col items-center text-center space-y-6">
                
                {/* Icon Sukses Berkelap-kelip / Animasi Lembut */}
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
                    <CheckCircle2 className="w-10 h-10" />
                </div>

                {/* Header Teks */}
                <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                        Pemesanan Berhasil
                    </span>
                    <h3 className="text-xl font-extrabold text-slate-900 mt-2">Tiket Anda Berhasil Dipesan!</h3>
                    {ticketCode && (
                        <p className="text-xs font-mono font-bold text-emerald-700 mt-1">
                            Kode: {ticketCode}
                        </p>
                    )}
                </div>

                {/* Ringkasan Detail */}
                <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                        <Ticket className="w-4 h-4 text-emerald-600" />
                        <span>{destinationName}</span>
                    </div>
                    <p className="text-xs text-slate-600">
                        Jumlah Tiket: <strong className="text-slate-800">{ticketCount} Orang</strong>
                    </p>
                    <div className="pt-2 border-t border-slate-200 flex items-start gap-2 text-[11px] text-slate-500 leading-relaxed">
                        <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <span>
                            Pembayaran Anda sedang divalidasi oleh admin. Silakan cek berkala di halaman <strong>E-Ticket & Riwayat</strong> untuk di-download dan dibawa saat masuk lokasi wisata.
                        </span>
                    </div>
                </div>

                {/* Tombol Aksi */}
                <div className="w-full flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
                    >
                        Tutup
                    </button>
                    <button
                        type="button"
                        onClick={handleGoToHistory}
                        className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white shadow-lg shadow-emerald-600/25 transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <span>Lihat Riwayat E-Ticket</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>

            </div>
        </div>
    );
}