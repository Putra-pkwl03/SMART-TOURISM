'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { apiClient } from '@/app/lib/axios';
import { CheckCircle2, QrCode } from 'lucide-react';

import PublicNavbar from '@/app/components/public/PublicNavbar';
import HeroSection from '@/app/components/public/HeroSection';
import QuickBookingBar from '@/app/components/public/QuickBookingBar';
import DestinationCatalog from '@/app/components/public/DestinationCatalog';
import PromoFeatures from '@/app/components/public/PromoFeatures';
import PublicFooter from '@/app/components/public/PublicFooter';

export default function PublicLandingPage() {
    const [destinations, setDestinations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Booking Form State
    const [selectedDestination, setSelectedDestination] = useState<number | ''>('');
    const [visitorCount, setVisitorCount] = useState(1);
    const [visitDate, setVisitDate] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [bookedTicket, setBookedTicket] = useState<any | null>(null);

    useEffect(() => {
        fetchPublicDestinations();
    }, []);

    const fetchPublicDestinations = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get('/destinations');
            setDestinations(response.data);
            if (response.data.length > 0) {
                setSelectedDestination(response.data[0].id);
            }
        } catch (error) {
            toast.error('Gagal memuat informasi destinasi dari server.');
        } finally {
            setLoading(false);
        }
    };

    const handleBookingSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDestination || !visitDate) {
            toast.error('Mohon lengkapi destinasi dan tanggal kunjungan!');
            return;
        }

        try {
            setSubmitting(true);
            const response = await apiClient.post('/tickets', {
                destination_id: selectedDestination,
                visitor_name: 'Wisatawan Publik',
                visitor_count: Number(visitorCount),
                visit_date: visitDate,
            });

            setBookedTicket(response.data.data);
            toast.success('Tiket berhasil dipesan! Silakan simpan QR Code Anda.');
        } catch (error: any) {
            const msg = error.response?.data?.message || 'Gagal melakukan pemesanan tiket.';
            toast.error(msg);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
            <PublicNavbar />
            <HeroSection />
            
            <QuickBookingBar 
                destinations={destinations}
                selectedDestination={selectedDestination}
                setSelectedDestination={setSelectedDestination}
                visitorCount={visitorCount}
                setVisitorCount={setVisitorCount}
                visitDate={visitDate}
                setVisitDate={setVisitDate}
                onSubmit={handleBookingSubmit}
                submitting={submitting}
            />

            <DestinationCatalog 
                destinations={destinations}
                loading={loading}
                onSelectDestination={(id) => {
                    setSelectedDestination(id);
                    window.scrollTo({ top: 300, behavior: 'smooth' });
                }}
            />

            <PromoFeatures />

            {/* Modal Sukses Booking & QR Code */}
            {bookedTicket && (
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
                                <span className="font-bold text-emerald-700">Rp {bookedTicket.total_price?.toLocaleString('id-ID')}</span>
                            </div>
                        </div>

                        <div className="p-4 bg-white border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center mb-6">
                            <QrCode className="w-32 h-32 text-slate-800" />
                            <span className="text-[10px] text-slate-400 mt-2 font-mono">{bookedTicket.ticket_code}</span>
                        </div>

                        <button
                            onClick={() => setBookedTicket(null)}
                            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition"
                        >
                            Tutup & Selesai
                        </button>
                    </div>
                </div>
            )}

            <PublicFooter />
        </div>
    );
}