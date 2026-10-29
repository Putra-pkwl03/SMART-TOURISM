'use client';

import { useState } from 'react';
import { Ticket, ShoppingBag, MapPin, Calendar, Users, Search } from 'lucide-react';

interface QuickBookingBarProps {
    destinations: any[];
    selectedDestination: number | '';
    setSelectedDestination: (val: number | '') => void;
    visitorCount: number;
    setVisitorCount: (val: number) => void;
    visitDate: string;
    setVisitDate: (val: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    submitting: boolean;
}

export default function QuickBookingBar({
    destinations,
    selectedDestination,
    setSelectedDestination,
    visitorCount,
    setVisitorCount,
    visitDate,
    setVisitDate,
    onSubmit,
    submitting
}: QuickBookingBarProps) {
    const [activeTab, setActiveTab] = useState<'tiket' | 'paket' | 'hampers'>('tiket');

    return (
        <div id="booking" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 sm:p-8">
                {/* Tabs Header */}
                <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-6">
                    <button
                        onClick={() => setActiveTab('tiket')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                            activeTab === 'tiket' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'text-slate-500 hover:bg-slate-50'
                        }`}
                    >
                        <Ticket className="w-4 h-4" />
                        <span>Tiket Wisata</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('paket')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                            activeTab === 'paket' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'text-slate-500 hover:bg-slate-50'
                        }`}
                    >
                        <MapPin className="w-4 h-4" />
                        <span>Paket Wisata</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('hampers')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                            activeTab === 'hampers' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'text-slate-500 hover:bg-slate-50'
                        }`}
                    >
                        <ShoppingBag className="w-4 h-4" />
                        <span>Hampers UMKM</span>
                    </button>
                </div>

                <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Pilih Destinasi</label>
                        <select
                            value={selectedDestination}
                            onChange={(e) => setSelectedDestination(Number(e.target.value))}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-700 focus:bg-white focus:ring-2 focus:ring-emerald-600 outline-none transition"
                        >
                            <option value="">Semua Destinasi</option>
                            {destinations.map((dest) => (
                                <option key={dest.id} value={dest.id}>
                                    {dest.name} — Rp {dest.ticket_price?.toLocaleString('id-ID')}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Tanggal Kunjungan</label>
                        <div className="relative">
                            <Calendar className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                            <input
                                type="date"
                                required
                                value={visitDate}
                                onChange={(e) => setVisitDate(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-700 focus:bg-white focus:ring-2 focus:ring-emerald-600 outline-none transition"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Jumlah Pengunjung</label>
                        <div className="relative">
                            <Users className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                            <input
                                type="number"
                                min="1"
                                required
                                value={visitorCount}
                                onChange={(e) => setVisitorCount(Number(e.target.value))}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-700 focus:bg-white focus:ring-2 focus:ring-emerald-600 outline-none transition"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-2xl shadow-lg shadow-emerald-700/20 transition flex items-center justify-center gap-2"
                        >
                            <Search className="w-4 h-4" />
                            <span>{submitting ? 'Memproses...' : 'Cari & Pesan Tiket'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}