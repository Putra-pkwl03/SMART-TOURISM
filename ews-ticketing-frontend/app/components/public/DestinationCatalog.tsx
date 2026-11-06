'use client';

import { useState, useEffect, useCallback } from 'react';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getBackendUrl } from '@/app/lib/backend-url';
import DestinationCard from './DestinationCard';

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
    rating?: number;
    reviews_count?: number;
    badge_text?: string;
}

interface DestinationCatalogProps {
    destinations: DestinationItem[];
    loading: boolean;
    onSelectDestination?: (id: number) => void;
    limit?: number;
    showAllLink?: boolean;
    embedded?: boolean;
}

export default function DestinationCatalog({
    destinations,
    loading,
    limit,
    showAllLink = false,
    embedded = false,
}: DestinationCatalogProps) {
    const router = useRouter();
    const BACKEND_URL = getBackendUrl();
    const visibleDestinations = limit ? destinations.slice(0, limit) : destinations;

    const [activeImageIndexes, setActiveImageIndexes] = useState<{ [key: number]: number }>({});
    const [hoveredCardId, setHoveredCardId] = useState<number | null>(null);

    const getFullImageUrl = useCallback((url?: string) => {
        if (!url) return '';
        if (url.startsWith('blob:') || url.startsWith('http://') || url.startsWith('https://')) {
            return url;
        }
        const cleanPath = url.startsWith('/') ? url : `/${url}`;
        const finalPath = cleanPath.startsWith('/storage') ? cleanPath : `/storage/${url.replace(/^\/+/, '')}`;
        return `${BACKEND_URL}${finalPath}`;
    }, [BACKEND_URL]);

    const getProductImageUrl = useCallback((prod: UmkmProduct) => {
        if (!prod) return '';
        if (prod.images && prod.images.length > 0) {
            const primaryImg = prod.images.find(img => img.is_primary) || prod.images[0];
            const rawPath = primaryImg.image_url || primaryImg.image_path || '';
            return getFullImageUrl(rawPath);
        }
        const rawPath = prod.image_url || prod.image_path || prod.image || '';
        return getFullImageUrl(rawPath);
    }, [getFullImageUrl]);

    // Auto-slide effect
    useEffect(() => {
        const interval = setInterval(() => {
            destinations.forEach((dest) => {
                if (hoveredCardId === dest.id) return;
                const slides: any[] = [];
                if (dest.image_url) slides.push({ type: 'destination', url: getFullImageUrl(dest.image_url), title: dest.name });
                if (dest.images && Array.isArray(dest.images)) {
                    dest.images.forEach(img => {
                        const formattedUrl = getFullImageUrl(img.image_url);
                        if (!slides.some(s => s.url === formattedUrl)) slides.push({ type: 'destination', url: formattedUrl, title: dest.name });
                    });
                }
                if (slides.length === 0) slides.push({ type: 'destination', url: '/destinasi-jurug-gedhe.jpg', title: dest.name });

                if (dest.umkm_products && dest.umkm_products.length > 0) {
                    dest.umkm_products.forEach(prod => {
                        const prodImg = getProductImageUrl(prod);
                        if (prodImg) slides.push({ type: 'umkm', url: prodImg, title: prod.name });
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
    }, [destinations, hoveredCardId, getFullImageUrl, getProductImageUrl]);

    const handleNextSlide = (e: React.MouseEvent, destId: number, totalSlides: number) => {
        e.stopPropagation();
        setActiveImageIndexes(prev => {
            const currentIndex = prev[destId] || 0;
            return { ...prev, [destId]: (currentIndex + 1) % totalSlides };
        });
    };

    const handlePrevSlide = (e: React.MouseEvent, destId: number, totalSlides: number) => {
        e.stopPropagation();
        setActiveImageIndexes(prev => {
            const currentIndex = prev[destId] || 0;
            return { ...prev, [destId]: (currentIndex - 1 + totalSlides) % totalSlides };
        });
    };

    return (
        <section id="destinasi" className={embedded ? 'min-w-0 scroll-mt-24' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'}>
            <div className={`flex flex-col gap-4 md:flex-row md:items-end md:justify-between ${embedded ? 'mb-6' : 'mb-10'}`}>
                <div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                        Destinasi Wisata Unggulan
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                        Nikmati pesona alam Jurug Gedhe dan sekitarnya
                    </p>
                </div>
                {showAllLink && (
                    <Link href="/destinations" className="inline-flex w-fit shrink-0 items-center gap-1 text-sm font-bold text-emerald-600 hover:text-emerald-700 transition">
                        Lihat Semua <ArrowRight className="h-4 w-4" />
                    </Link>
                )}
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map((card) => (
                        <div key={card} className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm animate-pulse h-96">
                            <div className="h-56 bg-slate-200" />
                            <div className="p-5 space-y-3">
                                <div className="h-5 w-3/4 rounded bg-slate-200" />
                                <div className="h-3 w-1/2 rounded bg-slate-100" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : destinations.length === 0 ? (
                <div className="text-center py-16 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                    <p className="text-sm text-slate-500">Belum ada destinasi atau paket wisata yang tersedia.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {visibleDestinations.map((dest) => {
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
                                    slides.push({ type: 'umkm', url: prodImg, title: prod.name });
                                }
                            });
                        }

                        const currentSlideIndex = activeImageIndexes[dest.id] || 0;

                        return (
                            <DestinationCard
                                key={dest.id}
                                dest={dest}
                                currentSlideIndex={currentSlideIndex}
                                slides={slides}
                                embedded={embedded}
                                onCardClick={(id) => router.push(`/destinations/${id}`)}
                                onNextSlide={handleNextSlide}
                                onPrevSlide={handlePrevSlide}
                                onMouseEnter={(id) => setHoveredCardId(id)}
                                onMouseLeave={() => setHoveredCardId(null)}
                            />
                        );
                    })}
                </div>
            )}
        </section>
    );
}