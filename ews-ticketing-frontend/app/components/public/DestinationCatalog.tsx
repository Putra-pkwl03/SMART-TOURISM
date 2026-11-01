'use client';

import { useState, useEffect } from 'react';
import { MapPin, ArrowRight, Loader2, Images as ImageIcon, ChevronLeft, ChevronRight, Boxes, Ticket } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface UmkmProduct {
    id: number;
    name: string;
    price: number;
    image_url?: string;
    image_path?: string;
    image?: string;
    images?: { image_url?: string; image_path?: string; is_primary?: boolean }[];
}

interface DestinationItem {
    id: number;
    name: string;
    type?: string;
    location?: string;
    description?: string;
    ticket_price?: number;
    image_url?: string;
    images?: { id: number; image_url: string }[];
    umkm_products?: UmkmProduct[];
}

interface DestinationCatalogProps {
    destinations: DestinationItem[];
    loading: boolean;
    onSelectDestination?: (id: number) => void;
}

export default function DestinationCatalog({ destinations, loading }: DestinationCatalogProps) {
    const router = useRouter();
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000';

    const [activeImageIndexes, setActiveImageIndexes] = useState<{ [key: number]: number }>({});
    const [hoveredCardId, setHoveredCardId] = useState<number | null>(null);

    const getFullImageUrl = (url?: string) => {
        if (!url) return '';
        if (url.startsWith('blob:') || url.startsWith('http://') || url.startsWith('https://')) {
            return url;
        }
        const cleanPath = url.startsWith('/') ? url : `/${url}`;
        const finalPath = cleanPath.startsWith('/storage') ? cleanPath : `/storage/${url.replace(/^\/+/, '')}`;
        return `${BACKEND_URL}${finalPath}`;
    };

    const getProductImageUrl = (prod: UmkmProduct) => {
        if (!prod) return '';
        
        if (prod.images && prod.images.length > 0) {
            const primaryImg = prod.images.find(img => img.is_primary) || prod.images[0];
            const rawPath = primaryImg.image_url || primaryImg.image_path || '';
            return getFullImageUrl(rawPath);
        }

        const rawPath = prod.image_url || prod.image_path || prod.image || '';
        return getFullImageUrl(rawPath);
    };

    // Auto-slide effect untuk seluruh item (foto destinasi & produk UMKM yang dijadikan satu slide)
    useEffect(() => {
        const interval = setInterval(() => {
            destinations.forEach((dest) => {
                if (hoveredCardId === dest.id) return;

                const slides: { type: 'destination' | 'umkm'; url: string; title: string }[] = [];
                
                if (dest.image_url) {
                    slides.push({ type: 'destination', url: getFullImageUrl(dest.image_url), title: dest.name });
                }
                if (dest.images && Array.isArray(dest.images)) {
                    dest.images.forEach(img => {
                        const formattedUrl = getFullImageUrl(img.image_url);
                        if (!slides.some(s => s.url === formattedUrl)) {
                            slides.push({ type: 'destination', url: formattedUrl, title: dest.name });
                        }
                    });
                }
                if (slides.length === 0) {
                    slides.push({ type: 'destination', url: '/destinasi-jurug-gedhe.jpg', title: dest.name });
                }

                if (dest.umkm_products && dest.umkm_products.length > 0) {
                    dest.umkm_products.forEach(prod => {
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

                if (slides.length <= 1) return;

                setActiveImageIndexes(prev => {
                    const currentIndex = prev[dest.id] || 0;
                    const nextIndex = (currentIndex + 1) % slides.length;
                    return { ...prev, [dest.id]: nextIndex };
                });
            });
        }, 4000);

        return () => clearInterval(interval);
    }, [destinations, hoveredCardId]);

    const handleNextSlide = (e: React.MouseEvent, destId: number, totalSlides: number) => {
        e.stopPropagation();
        setActiveImageIndexes(prev => {
            const currentIndex = prev[destId] || 0;
            const nextIndex = (currentIndex + 1) % totalSlides;
            return { ...prev, [destId]: nextIndex };
        });
    };

    const handlePrevSlide = (e: React.MouseEvent, destId: number, totalSlides: number) => {
        e.stopPropagation();
        setActiveImageIndexes(prev => {
            const currentIndex = prev[destId] || 0;
            const prevIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            return { ...prev, [destId]: prevIndex };
        });
    };

    return (
        <section id="destinasi" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
                <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 mb-2 block">
                        Destinasi Populer
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                        Jelajahi Destinasi Wisata Unggulan
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                        Nikmati keindahan alam, tantangan petualangan, dan pengalaman tak terlupakan di Ngoro-Oro.
                    </p>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-2">
                    <Loader2 className="w-6 h-6 animate-spin text-emerald-700" />
                    <span className="text-xs">Memuat katalog destinasi...</span>
                </div>
            ) : destinations.length === 0 ? (
                <div className="text-center py-16 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                    <p className="text-sm text-slate-500">Belum ada destinasi atau paket wisata yang tersedia.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {destinations.map((dest) => {
                        const slides: { type: 'destination' | 'umkm'; url: string; title: string }[] = [];
                        
                        if (dest.image_url) {
                            slides.push({ type: 'destination', url: getFullImageUrl(dest.image_url), title: dest.name });
                        }
                        if (dest.images && Array.isArray(dest.images)) {
                            dest.images.forEach(img => {
                                const formattedUrl = getFullImageUrl(img.image_url);
                                if (!slides.some(s => s.url === formattedUrl)) {
                                    slides.push({ type: 'destination', url: formattedUrl, title: dest.name });
                                }
                            });
                        }
                        if (slides.length === 0) {
                            slides.push({ type: 'destination', url: '/destinasi-jurug-gedhe.jpg', title: dest.name });
                        }

                        const totalUmkmProducts = dest.umkm_products?.length || 0;
                        const isBundling = totalUmkmProducts > 0;

                        if (dest.umkm_products && dest.umkm_products.length > 0) {
                            dest.umkm_products.forEach(prod => {
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

                        const currentSlideIndex = activeImageIndexes[dest.id] || 0;
                        const currentSlide = slides[currentSlideIndex] || slides[0];

                        return (
                            <div 
                                key={dest.id} 
                                onClick={() => router.push(`/destinations/${dest.id}`)}
                                onMouseEnter={() => setHoveredCardId(dest.id)}
                                onMouseLeave={() => setHoveredCardId(null)}
                                className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-emerald-200 overflow-hidden flex flex-col justify-between group cursor-pointer transition-all duration-300"
                            >
                                <div>
                                    {/* Container Gambar Utama (Slider Universal: Foto & Produk UMKM) */}
                                    <div className="relative h-64 bg-slate-900 overflow-hidden">
                                        <div 
                                            className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out group-hover:scale-105"
                                            style={{ backgroundImage: `url('${currentSlide.url}')` }}
                                        />
                                        
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-slate-950/30 pointer-events-none" />

                                        {/* TOP LEFT: Badge Kategori Jenis Paket */}
                                        <div className="absolute top-4 left-4 z-10 flex flex-col gap-1">
                                            {isBundling ? (
                                                <span className="px-3 py-1 rounded-full bg-emerald-700/90 backdrop-blur-md text-white font-bold text-[10px] uppercase tracking-wider shadow-md border border-emerald-500/30">
                                                    📦 BUNDLING UMKM ({totalUmkmProducts})
                                                </span>
                                            ) : (
                                                <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-slate-700 font-bold text-[10px] uppercase tracking-wider shadow-sm border border-slate-200">
                                                    🏞️ WISATA BIASA
                                                </span>
                                            )}
                                        </div>

                                        {/* TOP RIGHT: Indikator Slide Aktif */}
                                        <div className="absolute top-4 right-4 z-10">
                                            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/60 backdrop-blur-md text-white font-medium text-[10px]">
                                                <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                                                {currentSlideIndex + 1} / {slides.length}
                                            </span>
                                        </div>

                                        {/* FLOATING OVERLAY DI ATAS GAMBAR */}
                                        {currentSlide.type === 'umkm' ? (
                                            <div className="absolute bottom-12 left-4 right-4 z-10 flex items-center gap-3 bg-emerald-950/75 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-emerald-500/40 shadow-lg animate-fadeIn">
                                                <div className="w-8 h-8 rounded-xl overflow-hidden bg-white/10 flex-shrink-0 border border-emerald-400/30 flex items-center justify-center">
                                                    <Boxes className="w-4 h-4 text-emerald-400" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wide block leading-none">
                                                        Suvenir Bundling Termasuk
                                                    </span>
                                                    <span className="text-xs font-bold text-white truncate block mt-0.5">
                                                        {currentSlide.title}
                                                    </span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="absolute bottom-12 left-4 right-4 z-10">
                                                <span className="text-[10px] font-semibold text-slate-300 uppercase tracking-widest block drop-shadow-sm">
                                                    Galeri Destinasi
                                                </span>
                                                <span className="text-xs font-bold text-white drop-shadow-md truncate block">
                                                    {dest.name}
                                                </span>
                                            </div>
                                        )}

                                        {/* Tombol Navigasi Geser (Next/Prev) */}
                                        {slides.length > 1 && (
                                            <>
                                                <button
                                                    onClick={(e) => handlePrevSlide(e, dest.id, slides.length)}
                                                    className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/70 hover:bg-white text-slate-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-md backdrop-blur-sm z-20"
                                                    title="Sebelumnya"
                                                >
                                                    <ChevronLeft className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={(e) => handleNextSlide(e, dest.id, slides.length)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/70 hover:bg-white text-slate-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-md backdrop-blur-sm z-20"
                                                    title="Selanjutnya"
                                                >
                                                    <ChevronRight className="w-4 h-4" />
                                                </button>

                                                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
                                                    {slides.map((_, idx) => (
                                                        <span
                                                            key={idx}
                                                            className={`h-1.5 rounded-full transition-all duration-300 ${
                                                                idx === currentSlideIndex 
                                                                    ? 'w-5 bg-emerald-400' 
                                                                    : 'w-1.5 bg-white/60'
                                                            }`}
                                                        />
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {/* Bagian Deskripsi & Harga Tiket (Padding dikurangi agar lebih rapat/pas) */}
                                    <div className="p-5 pb-3">
                                        <h4 className="font-bold text-slate-900 text-base mb-1.5 group-hover:text-emerald-700 transition line-clamp-1">
                                            {dest.name}
                                        </h4>
                                        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-3">
                                            {dest.description || 'Nikmati panorama tebing dan keindahan alam eksotis.'}
                                        </p>

                                        {/* Informasi Harga Tiket */}
                                        <div className="flex items-center justify-between bg-emerald-50/60 border border-emerald-100 px-3 py-1.5 rounded-xl">
                                            <span className="text-[11px] font-semibold text-slate-600 flex items-center gap-1">
                                                <Ticket className="w-3.5 h-3.5 text-emerald-600" />
                                                Harga Tiket:
                                            </span>
                                            <span className="text-xs font-bold text-emerald-700">
                                                {dest.ticket_price ? `Rp ${Number(dest.ticket_price).toLocaleString('id-ID')}` : 'Gratis'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer Card dengan jarak lebih rapat (py-3) */}
                                <div className="px-5 py-3 flex items-center justify-between border-t border-slate-50 mt-1">
                                    <p className="text-xs text-slate-500 flex items-center gap-1.5 truncate pr-2">
                                        <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                                        <span className="truncate font-medium">{dest.location || 'Ngoro-Oro, Patuk'}</span>
                                    </p>
                                    <div className="p-2 bg-slate-50 group-hover:bg-emerald-600 group-hover:text-white rounded-xl transition flex-shrink-0 shadow-sm">
                                        <ArrowRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
}