'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';
import { apiClient } from '@/app/lib/axios';

import PublicNavbar from '@/app/components/public/PublicNavbar';
import HeroSection from '@/app/components/public/HeroSection';
import QuickBookingBar from '@/app/components/public/QuickBookingBar';
import DestinationCatalog from '@/app/components/public/DestinationCatalog';
import UmkmProductShowcase from '@/app/components/public/UmkmProductShowcase';
import { PromoBanner, QuickAccessCard } from '@/app/components/public/PromoFeatures';
import BookingSuccessModal from '@/app/components/public/BookingSuccessModal';
import PublicFooter from '@/app/components/public/PublicFooter';
import BackToTopButton from '@/app/components/public/BackToTopButton';
import AboutCallout from '@/app/components/public/AboutCallout';
import type { UmkmCatalogProduct } from '@/app/components/public/UmkmProductDetailModal';

type PublicDestination = Parameters<typeof DestinationCatalog>[0]['destinations'][number];
type PublicUmkmProduct = UmkmCatalogProduct;
type BookedTicket = {
    ticket_code: string;
    total_price: number;
    destination?: { name?: string };
    visitor_count: number;
};

export default function PublicLandingPage() {
    const [destinations, setDestinations] = useState<PublicDestination[]>([]);
    const [umkmProducts, setUmkmProducts] = useState<PublicUmkmProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingProducts, setLoadingProducts] = useState(true);
    
    // Booking Form State
    const [selectedDestination, setSelectedDestination] = useState<number | ''>('');
    const [visitorCount, setVisitorCount] = useState(1);
    const [visitDate, setVisitDate] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [bookedTicket, setBookedTicket] = useState<BookedTicket | null>(null);

    useEffect(() => {
        const fetchPublicDestinations = async () => {
            try {
                setLoading(true);
                const response = await apiClient.get<PublicDestination[]>('/destinations');
                setDestinations(response.data);
                if (response.data.length > 0) {
                    setSelectedDestination(response.data[0].id);
                }
            } catch {
                toast.error('Gagal memuat informasi destinasi dari server.');
            } finally {
                setLoading(false);
            }
        };

        const fetchUmkmProducts = async () => {
            try {
                setLoadingProducts(true);
                const response = await apiClient.get<{ data: PublicUmkmProduct[] }>('/umkm/products');
                setUmkmProducts(response.data.data || []);
            } catch {
                toast.error('Gagal memuat katalog produk UMKM.');
            } finally {
                setLoadingProducts(false);
            }
        };

        void fetchPublicDestinations();
        void fetchUmkmProducts();
    }, []);

    const handleBookingSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDestination || !visitDate) {
            toast.error('Mohon lengkapi destinasi dan tanggal kunjungan!');
            return;
        }

        try {
            setSubmitting(true);
            const response = await apiClient.post<{ data: BookedTicket }>('/tickets', {
                destination_id: selectedDestination,
                visitor_name: 'Wisatawan Publik',
                visitor_count: Number(visitorCount),
                visit_date: visitDate,
            });

            setBookedTicket(response.data.data);
            toast.success('Tiket berhasil dipesan! Silakan simpan QR Code Anda.');
        } catch (error: unknown) {
            const msg = isAxiosError<{ message?: string }>(error)
                ? error.response?.data?.message || 'Gagal melakukan pemesanan tiket.'
                : 'Gagal melakukan pemesanan tiket.';
            toast.error(msg);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans scrollbar-thin scrollbar-thumb-emerald-500/40 scrollbar-track-transparent [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-emerald-500/40 hover:[&::-webkit-scrollbar-thumb]:bg-emerald-600/60 transition-all">
            <PublicNavbar />
            <HeroSection />
            
            <QuickBookingBar 
                destinations={destinations}
                umkmProducts={umkmProducts}
                selectedDestination={selectedDestination}
                setSelectedDestination={setSelectedDestination}
                visitorCount={visitorCount}
                setVisitorCount={setVisitorCount}
                visitDate={visitDate}
                setVisitDate={setVisitDate}
                onSubmit={handleBookingSubmit}
                submitting={submitting}
            />

            <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
                <div className="grid items-stretch gap-6 lg:grid-cols-[minmax(0,2.4fr)_minmax(280px,1fr)]">
                    <div className="min-w-0 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5 lg:p-6">
                        <DestinationCatalog
                            destinations={destinations}
                            loading={loading}
                            limit={3}
                            showAllLink
                            embedded
                            onSelectDestination={(id) => {
                                setSelectedDestination(id);
                                window.scrollTo({ top: 300, behavior: 'smooth' });
                            }}
                        />
                    </div>
                    <div className="min-w-0">
                        <PromoBanner />
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8 lg:pb-16 -mt-6">
                <div className="grid items-stretch gap-6 lg:grid-cols-[minmax(0,2.4fr)_minmax(280px,1fr)]">
                    <div className="min-w-0 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5 lg:p-6">
                        <UmkmProductShowcase
                            products={umkmProducts}
                            loading={loadingProducts}
                            limit={4}
                            showAllLink
                        />
                    </div>
                    <div className="min-w-0">
                        <QuickAccessCard />
                    </div>
                </div>
            </section>

            <BookingSuccessModal 
                bookedTicket={bookedTicket} 
                onClose={() => setBookedTicket(null)} 
            />

            <AboutCallout />
            <PublicFooter />
            <BackToTopButton />
        </div>
    );
}