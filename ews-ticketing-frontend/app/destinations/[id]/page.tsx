'use client';

import { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { MapPin, Loader2, Images as ImageIcon, ShieldCheck, Boxes } from 'lucide-react';
import { apiClient } from '@/app/lib/axios';
import { getBackendUrl } from '@/app/lib/backend-url';
import { toast } from 'sonner';

import PublicNavbar from '@/app/components/public/PublicNavbar';
import PublicFooter from '@/app/components/public/PublicFooter';
import TicketBookingForm from '@/app/components/public/TicketBookingForm';
import PaymentModal from '@/app/components/public/PaymentModal';
import SuccessTicketModal from '@/app/components/public/SuccessTicketModal';

function DestinationDetailContent() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const id = params.id;

    const [destination, setDestination] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    
    const [ticketCount, setTicketCount] = useState<number>(
        Number(searchParams.get('visitors')) || 1
    );
    const [visitDate, setVisitDate] = useState<string>(
        searchParams.get('date') || ''
    );

    useEffect(() => {
        const dateParam = searchParams.get('date');
        const visitorsParam = searchParams.get('visitors');

        if (dateParam) setVisitDate(dateParam);
        if (visitorsParam) setTicketCount(Number(visitorsParam));
    }, [searchParams]);

    const [activeImageIndex, setActiveImageIndex] = useState(0);

    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [createdTicketData, setCreatedTicketData] = useState<any>(null);
    const [submitting, setSubmitting] = useState(false);

    const BACKEND_URL = getBackendUrl();

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

            // Menyertakan data produk UMKM bundling (jika ada)
            const linkedProducts = destination.umkm_products || destination.umkmProducts || [];
            if (linkedProducts.length > 0) {
                linkedProducts.forEach((prod: any, index: number) => {
                    // Sesuaikan kuantitas bundling: 
                    // Jika 1 paket bundling berlaku untuk setiap tiket, gunakan (1 * ticketCount).
                    // Jika paket bersifat tetap per transaksi, cukup gunakan nilai tetap (misal: 1).
                    const itemQuantity = 1 * ticketCount; 

                    formData.append(`items[${index}][umkm_product_id]`, String(prod.id));
                    formData.append(`items[${index}][quantity]`, String(itemQuantity)); 
                });
            }

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

    const getFullImageUrl = (url?: string) => {
        if (!url) return '';
        if (url.startsWith('blob:') || url.startsWith('http://') || url.startsWith('https://')) {
            return url;
        }
        const cleanPath = url.startsWith('/') ? url : `/${url}`;
        const finalPath = cleanPath.startsWith('/storage') ? cleanPath : `/storage/${url.replace(/^\/+/, '')}`;
        return `${BACKEND_URL}${finalPath}`;
    };

    const getProductImageUrl = (prod: any) => {
        if (!prod) return '';
        if (prod.images && Array.isArray(prod.images) && prod.images.length > 0) {
            const primaryImg = prod.images.find((img: any) => img.is_primary) || prod.images[0];
            const rawPath = primaryImg.image_url || primaryImg.image_path || '';
            if (rawPath) return getFullImageUrl(rawPath);
        }
        const rawPath = prod.image_url || prod.image_path || prod.image || '';
        return getFullImageUrl(rawPath);
    };

    // Gabungkan Foto Destinasi & Foto Produk UMKM ke dalam 1 Array Slides Universal (Tanpa Harga)
    const slides: { type: 'destination' | 'umkm'; url: string; title: string }[] = [];
    
    if (destination.image_url) {
        slides.push({ type: 'destination', url: getFullImageUrl(destination.image_url), title: destination.name });
    }
    if (destination.images && Array.isArray(destination.images)) {
        destination.images.forEach((img: any) => {
            const formattedUrl = getFullImageUrl(img.image_url);
            if (formattedUrl && !slides.some(s => s.url === formattedUrl)) {
                slides.push({ type: 'destination', url: formattedUrl, title: destination.name });
            }
        });
    }
    if (slides.length === 0) {
        slides.push({ type: 'destination', url: '/destinasi-jurug-gedhe.jpg', title: destination.name });
    }

    const umkmProductsList = destination.umkm_products || destination.umkmProducts || [];
    const totalUmkmProducts = umkmProductsList.length;
    const isBundling = totalUmkmProducts > 0;

    if (totalUmkmProducts > 0) {
        umkmProductsList.forEach((prod: any) => {
            const prodImg = getProductImageUrl(prod);
            if (prodImg) {
                slides.push({ 
                    type: 'umkm', 
                    url: prodImg, 
                    title: prod.name 
                });
            }
        });
    }

    const currentSlide = slides[activeImageIndex] || slides[0];
    const totalPrice = destination.ticket_price * ticketCount;

    return (
        <main className="flex-1 max-w-7xl w-full mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Kolom Kiri: Detail Destinasi */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden p-6 sm:p-8 space-y-6">
                        <div className="space-y-4">
                            <div className="h-72 sm:h-96 rounded-2xl bg-slate-900 relative overflow-hidden shadow-inner group">
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-all duration-500"
                                    style={{ backgroundImage: `url('${currentSlide.url}')` }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-80 pointer-events-none" />
                                <div className="absolute top-4 left-4 flex flex-col gap-1 z-10">
                                    <span className={`px-3 py-1.5 rounded-full backdrop-blur-md text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md ${
                                        destination.is_active ? 'bg-emerald-600/90' : 'bg-red-600/90'
                                    }`}>
                                        <ShieldCheck className="w-4 h-4" />
                                        {destination.is_active ? 'Aktif (Normal)' : 'Darurat Ditutup'}
                                    </span>
                                    {isBundling && (
                                        <span className="px-3 py-1 rounded-full bg-emerald-950/80 backdrop-blur-md text-emerald-300 font-bold text-[10px] uppercase tracking-wider shadow-md border border-emerald-500/30">
                                            📦 BUNDLING UMKM ({totalUmkmProducts})
                                        </span>
                                    )}
                                </div>
                                <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between text-white">
                                    <div>
                                        {currentSlide.type === 'umkm' ? (
                                            <div className="flex items-center gap-2 bg-emerald-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-emerald-500/30 w-fit">
                                                <Boxes className="w-3.5 h-3.5 text-emerald-400" />
                                                <span className="text-xs font-bold text-white">Suvenir Bundling: {currentSlide.title}</span>
                                            </div>
                                        ) : (
                                            <span className="text-xs font-semibold drop-shadow-md">{currentSlide.title}</span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/70 backdrop-blur-md text-xs font-medium">
                                        <ImageIcon className="w-4 h-4 text-emerald-400" />
                                        <span>Item {activeImageIndex + 1} dari {slides.length}</span>
                                    </div>
                                </div>
                            </div>
                            {slides.length > 1 && (
                                <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
                                    {slides.map((slide, index) => (
                                        <button
                                            key={`${slide.type}-${index}`}
                                            type="button"
                                            onClick={() => setActiveImageIndex(index)}
                                            aria-label={`Tampilkan foto ${index + 1}`}
                                            className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                                                activeImageIndex === index ? 'border-emerald-600 shadow-md scale-105 ring-2 ring-emerald-500/20' : 'border-transparent opacity-60 hover:opacity-100'
                                            }`}
                                            title={slide.title}
                                        >
                                            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${slide.url}')` }} />
                                            {slide.type === 'umkm' && (
                                                <span className="absolute inset-x-0 bottom-0 truncate bg-emerald-900/80 px-1 py-0.5 text-center text-[9px] font-bold text-white">UMKM</span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="space-y-3">
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{destination.name}</h1>
                            <p className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                                <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                                <span>{destination.location || 'Ngoro-Oro, Patuk, Gunungkidul'}</span>
                            </p>
                        </div>
                        <hr className="border-slate-100" />

                        <div className="space-y-2">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Tentang Destinasi & Aktivitas</h3>
                            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                                {destination.description || 'Nikmati keindahan panorama alam eksotis dan fasilitas wisata terpadu Pokdarwis Jurug Gedhe.'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Kolom Kanan: Form Pemesanan Tiket */}
                <div className="lg:col-span-1">
                    <div className="sticky top-6">
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