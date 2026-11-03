'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { apiClient } from '@/app/lib/axios';

import PublicNavbar from '@/app/components/public/PublicNavbar';
import HeroSection from '@/app/components/public/HeroSection';
import QuickBookingBar from '@/app/components/public/QuickBookingBar';
import DestinationCatalog from '@/app/components/public/DestinationCatalog';
import UmkmProductCatalog from '@/app/components/public/UmkmProductCatalog';
import PromoFeatures from '@/app/components/public/PromoFeatures';
import BookingSuccessModal from '@/app/components/public/BookingSuccessModal';
import PublicFooter from '@/app/components/public/PublicFooter';

export default function PublicLandingPage() {
    const [destinations, setDestinations] = useState<any[]>([]);
    const [umkmProducts, setUmkmProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingProducts, setLoadingProducts] = useState(true);
    
    // Booking Form State
    const [selectedDestination, setSelectedDestination] = useState<number | ''>('');
    const [visitorCount, setVisitorCount] = useState(1);
    const [visitDate, setVisitDate] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [bookedTicket, setBookedTicket] = useState<any | null>(null);

    useEffect(() => {
        fetchPublicDestinations();
        fetchUmkmProducts();
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

    const fetchUmkmProducts = async () => {
        try {
            setLoadingProducts(true);
            const response = await apiClient.get('/umkm/products');
            setUmkmProducts(response.data.data || []);
        } catch (error) {
            toast.error('Gagal memuat katalog produk UMKM.');
        } finally {
            setLoadingProducts(false);
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

            <DestinationCatalog 
                destinations={destinations}
                loading={loading}
                onSelectDestination={(id) => {
                    setSelectedDestination(id);
                    window.scrollTo({ top: 300, behavior: 'smooth' });
                }}
            />

            <UmkmProductCatalog 
                products={umkmProducts} 
                loading={loadingProducts} 
            />

            <PromoFeatures />

            <BookingSuccessModal 
                bookedTicket={bookedTicket} 
                onClose={() => setBookedTicket(null)} 
            />

            <PublicFooter />
        </div>
    );
}