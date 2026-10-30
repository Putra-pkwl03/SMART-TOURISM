'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Ticket, ShoppingBag, MapPin, Calendar, Users, Search, Compass } from 'lucide-react';
import { toast } from 'sonner';

interface QuickBookingBarProps {
    destinations: any[];
    selectedDestination: number | '';
    setSelectedDestination: (val: number | '') => void;
    visitorCount: number;
    setVisitorCount: (val: number) => void;
    visitDate: string;
    setVisitDate: (val: string) => void;
    onSubmit?: (e: React.FormEvent) => void;
    submitting?: boolean;
}

export default function QuickBookingBar({
    destinations,
    selectedDestination,
    setSelectedDestination,
    visitorCount,
    setVisitorCount,
    visitDate,
    setVisitDate,
}: QuickBookingBarProps) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'tiket' | 'paket' | 'hampers'>('tiket');

    // Logika Filter Berdasarkan Tab:
    // - 'tiket': Menampilkan SEMUA item tanpa terkecuali
    // - 'paket': Hanya menampilkan item bertipe 'package'
    // - 'hampers': Hanya menampilkan item bertipe 'hampers' atau 'product'
    const filteredDestinations = destinations.filter((dest) => {
        const itemType = dest.type_entry || dest.type;
        if (activeTab === 'tiket') {
            return true; // Menampilkan semua untuk tiket wisata
        }
        if (activeTab === 'paket') {
            return itemType === 'package';
        }
        if (activeTab === 'hampers') {
            return itemType === 'hampers' || itemType === 'product';
        }
        return true;
    });

    // Reset pilihan destinasi saat tab diganti agar sinkron
    const handleTabChange = (tab: 'tiket' | 'paket' | 'hampers') => {
        setActiveTab(tab);
        setSelectedDestination('');
    };

    const handleQuickSearch = (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedDestination) {
            const catalogElement = document.getElementById('destinasi');
            if (catalogElement) {
                catalogElement.scrollIntoView({ behavior: 'smooth' });
            } else {
                toast.error('Silakan pilih destinasi atau produk terlebih dahulu!');
            }
            return;
        }

        const queryParams = new URLSearchParams();
        if (visitDate) queryParams.append('date', visitDate);
        if (visitorCount) queryParams.append('visitors', String(visitorCount));
        queryParams.append('tab', activeTab);

        const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
        router.push(`/destinations/${selectedDestination}${queryString}`);
    };

    return (
        <div id="booking" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 sm:-mt-18 relative z-20">
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 sm:p-8">
                
                {/* Header Title Section */}
                <div className="flex items-center gap-2 mb-4">
                    <Compass className="w-5 h-5 text-green-900" />
                    <h3 className="text-lg font-bold text-black">Rencanakan Perjalanan Anda</h3>
                </div>

                {/* Tabs Header dengan Gaya Aktif Hijau Gelap */}
                <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-6">
                    <button
                        type="button"
                        onClick={() => handleTabChange('tiket')}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                            activeTab === 'tiket' 
                                ? 'bg-green-900 text-white shadow-md' 
                                : 'text-slate-500 hover:bg-slate-100'
                        }`}
                    >
                        <Ticket className="w-4 h-4" />
                        <span>Tiket Wisata</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => handleTabChange('paket')}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                            activeTab === 'paket' 
                                ? 'bg-emerald-950 text-white shadow-md' 
                                : 'text-slate-500 hover:bg-slate-100'
                        }`}
                    >
                        <MapPin className="w-4 h-4" />
                        <span>Paket Wisata</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => handleTabChange('hampers')}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                            activeTab === 'hampers' 
                                ? 'bg-emerald-950 text-white shadow-md' 
                                : 'text-slate-500 hover:bg-slate-100'
                        }`}
                    >
                        <ShoppingBag className="w-4 h-4" />
                        <span>Hampers UMKM</span>
                    </button>
                </div>

                {/* Booking Form */}
                <form onSubmit={handleQuickSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                            {activeTab === 'tiket' ? 'Pilih Destinasi' : activeTab === 'paket' ? 'Pilih Paket Wisata' : 'Pilih Produk / Hampers'}
                        </label>
                        <select
                            value={selectedDestination}
                            onChange={(e) => setSelectedDestination(e.target.value ? Number(e.target.value) : '')}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-700 focus:bg-white focus:ring-2 focus:ring-emerald-900 outline-none transition"
                        >
                            <option value="">
                                {activeTab === 'tiket' ? 'Semua Destinasi' : activeTab === 'paket' ? 'Semua Paket Wisata' : 'Semua Hampers UMKM'}
                            </option>
                            {filteredDestinations.map((dest) => (
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
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-700 focus:bg-white focus:ring-2 focus:ring-emerald-900 outline-none transition"
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
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-700 focus:bg-white focus:ring-2 focus:ring-emerald-900 outline-none transition"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="w-full py-3.5 bg-emerald-950 hover:bg-emerald-900 text-white font-bold text-xs rounded-2xl shadow-lg shadow-emerald-950/20 transition flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <Search className="w-4 h-4" />
                            <span>
                                {activeTab === 'tiket' ? 'Cari Tiket' : activeTab === 'paket' ? 'Cari Paket' : 'Cari Hampers'}
                            </span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}