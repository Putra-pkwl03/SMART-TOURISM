'use client';

import { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MapPin, Loader2 } from 'lucide-react';
import { apiClient } from '@/app/lib/axios';
import { toast } from 'sonner';

import PublicNavbar from '@/app/components/public/PublicNavbar';
import PublicFooter from '@/app/components/public/PublicFooter';
import TicketBookingForm from '@/app/components/public/TicketBookingForm';
import PaymentModal from '@/app/components/public/PaymentModal';
import SuccessTicketModal from '@/app/components/public/SuccessTicketModal';

function DestinationDetailContent() {
    const params = useParams();
    const router = useRouter();
    const id = params.id;

    const [destination, setDestination] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [ticketCount, setTicketCount] = useState(1);
    const [visitDate, setVisitDate] = useState('');

    // Modal States
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [createdTicketData, setCreatedTicketData] = useState<any>(null);
    const [submitting, setSubmitting] = useState(false);

    const BACKEND_URL = 'http://127.0.0.1:8000';

    useEffect(() => {
        if (id) {
            fetchDetail();
        }
    }, [id]);

    const fetchDetail = async () => {
        try {
            setLoading(true);
            const res = await apiClient.get(`/destinations/${id}`);
            setDestination(res.data);
        } catch (error) {
            toast.error('Gagal memuat detail destinasi.');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenPaymentModal = (e: React.FormEvent) => {
        e.preventDefault();

        const token = localStorage.getItem('token') || document.cookie.includes('auth_token');

        if (!token) {
            toast.error('Silakan login terlebih dahulu untuk memesan tiket.');
            router.push('/auth/users/login');
            return;
        }

        if (!visitDate) {
            toast.error('Silakan pilih tanggal kunjungan terlebih dahulu.');
            return;
        }

        setIsPaymentModalOpen(true);
    };

    const handleConfirmPayment = async (selectedMethod: string, proofFile: File) => {
        try {
            setSubmitting(true);
            const formData = new FormData();
            formData.append('destination_id', String(destination.id));
            formData.append('visitor_count', String(ticketCount));
            formData.append('visit_date', visitDate);
            formData.append('payment_method', selectedMethod);
            formData.append('payment_proof', proofFile);

            const token = localStorage.getItem('token');

            const res = await apiClient.post('/tickets', formData, {
                headers: {
                    ...(token ? { Authorization: `Bearer ${token}` } : {})
                },
            });

            setCreatedTicketData(res.data.data);
            setIsPaymentModalOpen(false);
            setIsSuccessModalOpen(true);
        } catch (error: any) {
            console.error('Error detail:', error.response?.data);
            if (error.response?.status === 401) {
                toast.error('Sesi Anda telah berakhir, silakan login kembali.');
                router.push('/auth/users/login');
            } else {
                toast.error(error.response?.data?.message || 'Gagal mengirim pesanan tiket.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-2 py-32">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-700" />
                <span className="text-xs font-semibold">Memuat informasi tiket & destinasi...</span>
            </div>
        );
    }

    if (!destination) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center py-32">
                <p className="text-sm font-bold text-slate-700">Destinasi tidak ditemukan.</p>
            </div>
        );
    }

    const imageUrl = destination.image_url 
        ? (destination.image_url.startsWith('http') ? destination.image_url : `${BACKEND_URL}${destination.image_url}`)
        : '/destinasi-jurug-gedhe.jpg';

    const totalPrice = destination.ticket_price * ticketCount;

    return (
        <main className="flex-1 max-w-7xl w-full mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="h-72 sm:h-80 relative">
                            <img src={imageUrl} alt={destination.name} className="w-full h-full object-cover" />
                            <div className="absolute top-4 left-4">
                                <span className="px-3 py-1 rounded-full bg-slate-900/70 backdrop-blur-md text-white font-bold text-xs uppercase">
                                    {destination.is_active ? 'Aktif (Normal)' : 'Darurat Ditutup'}
                                </span>
                            </div>
                        </div>
                        <div className="p-6 sm:p-8 space-y-4">
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{destination.name}</h1>
                            <p className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                                <MapPin className="w-4 h-4 text-emerald-600" />
                                <span>{destination.location || 'Ngoro-Oro, Patuk, Gunungkidul'}</span>
                            </p>
                            <hr className="border-slate-100" />
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Tentang Destinasi & Aktivitas</h3>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    {destination.description || 'Nikmati keindahan panorama alam eksotis dan fasilitas wisata terpadu Pokdarwis Jurug Gedhe.'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <TicketBookingForm 
                        ticketPrice={destination.ticket_price}
                        ticketCount={ticketCount}
                        setTicketCount={setTicketCount}
                        visitDate={visitDate}
                        setVisitDate={setVisitDate}
                        isActive={destination.is_active}
                        onSubmit={handleOpenPaymentModal}
                        totalPrice={totalPrice}
                    />
                </div>
            </div>

            <PaymentModal 
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                totalPrice={totalPrice}
                destinationName={destination.name}
                ticketCount={ticketCount}
                onSubmit={handleConfirmPayment}
                submitting={submitting}
            />

            <SuccessTicketModal 
                isOpen={isSuccessModalOpen}
                ticketCode={createdTicketData?.ticket_code}
                destinationName={destination.name}
                ticketCount={ticketCount}
                onClose={() => {
                    setIsSuccessModalOpen(false);
                    router.push('/');
                }}
            />
        </main>
    );
}

export default function DestinationDetailPage() {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <PublicNavbar />
            <Suspense fallback={
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-2 py-32">
                    <Loader2 className="w-8 h-8 animate-spin text-emerald-700" />
                    <span className="text-xs font-semibold">Memuat halaman...</span>
                </div>
            }>
                <DestinationDetailContent />
            </Suspense>
            <PublicFooter />
        </div>
    );
}