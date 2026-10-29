'use client';

import { Ticket, Calendar, Users, ShieldCheck } from 'lucide-react';

interface TicketBookingFormProps {
    ticketPrice: number;
    ticketCount: number;
    setTicketCount: (val: number) => void;
    visitDate: string;
    setVisitDate: (val: string) => void;
    isActive: boolean;
    onSubmit: (e: React.FormEvent) => void;
    totalPrice: number;
}

export default function TicketBookingForm({
    ticketPrice,
    ticketCount,
    setTicketCount,
    visitDate,
    setVisitDate,
    isActive,
    onSubmit,
    totalPrice
}: TicketBookingFormProps) {
    return (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-6 sticky top-24">
            <div className="flex items-center gap-2.5 mb-4 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <Ticket className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="font-bold text-slate-900 text-sm">Pesan Tiket Masuk</h3>
                    <p className="text-[11px] text-slate-500">Konfirmasi instan & e-ticket</p>
                </div>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
                <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">Harga Tiket / Orang</label>
                    <div className="text-xl font-extrabold text-emerald-700">
                        Rp {ticketPrice?.toLocaleString('id-ID')}
                    </div>
                </div>

                <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">Tanggal Kunjungan</label>
                    <div className="relative">
                        <Calendar className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                        <input 
                            type="date"
                            required
                            value={visitDate}
                            onChange={(e) => setVisitDate(e.target.value)}
                            className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:bg-white focus:ring-2 focus:ring-emerald-600 outline-none transition"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">Jumlah Tiket (Orang)</label>
                    <div className="relative">
                        <Users className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                        <input 
                            type="number"
                            min={1}
                            max={20}
                            required
                            value={ticketCount}
                            onChange={(e) => setTicketCount(Number(e.target.value))}
                            className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:bg-white focus:ring-2 focus:ring-emerald-600 outline-none transition"
                        />
                    </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-600">Total Pembayaran</span>
                    <span className="text-base font-extrabold text-slate-900">
                        Rp {totalPrice.toLocaleString('id-ID')}
                    </span>
                </div>

                <button
                    type="submit"
                    disabled={!isActive}
                    className={`w-full py-3 rounded-2xl text-xs font-bold text-white shadow-lg transition flex items-center justify-center gap-2 ${
                        isActive 
                            ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/25 cursor-pointer' 
                            : 'bg-slate-400 cursor-not-allowed'
                    }`}
                >
                    <ShieldCheck className="w-4 h-4" />
                    <span>{isActive ? 'Lanjutkan Pembayaran' : 'Destinasi Ditutup (EWS)'}</span>
                </button>
            </form>
        </div>
    );
}