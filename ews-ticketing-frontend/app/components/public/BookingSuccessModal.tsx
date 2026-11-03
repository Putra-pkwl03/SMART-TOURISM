'use client';

import { CheckCircle2, QrCode } from 'lucide-react';

interface BookingSuccessModalProps {
    bookedTicket: any;
    onClose: () => void;
}

export default function BookingSuccessModal({ bookedTicket, onClose }: BookingSuccessModalProps) {
    if (!bookedTicket) return null;

    const totalPriceFormatted = bookedTicket.total_price ? bookedTicket.total_price.toLocaleString('id-ID') : '0';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 text-center">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">Pemesanan Berhasil!</h3>
                <p className="text-xs text-slate-500 mb-6">Tunjukkan QR Code berikut kepada Petugas Loket saat tiba di gerbang masuk.</p>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 mb-6 space-y-3 text-left">
                    <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Kode Tiket:</span>
                        <span className="font-bold text-emerald-700">{bookedTicket.ticket_code}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Destinasi:</span>
                        <span className="font-semibold text-slate-800">{bookedTicket.destination?.name}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Jumlah Orang:</span>
                        <span className="font-semibold text-slate-800">{bookedTicket.visitor_count} Orang</span>
                    </div>
                    <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Total Harga:</span>
                        <span className="font-bold text-emerald-700">Rp {totalPriceFormatted}</span>
                    </div>
                </div>

                <div className="p-4 bg-white border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center mb-6">
                    <QrCode className="w-32 h-32 text-slate-800" />
                    <span className="text-[10px] text-slate-400 mt-2 font-mono">{bookedTicket.ticket_code}</span>
                </div>

                <button
                    onClick={onClose}
                    className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition"
                >
                    Tutup & Selesai
                </button>
            </div>
        </div>
    );
}