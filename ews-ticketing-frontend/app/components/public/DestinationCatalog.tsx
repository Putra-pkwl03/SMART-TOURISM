'use client';

import { useState, useEffect } from 'react';
import { MapPin, ArrowRight, Loader2, Images as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface DestinationItem {
    id: number;
    name: string;
    type?: string;
    location?: string;
    description?: string;
    image_url?: string;
    images?: { id: number; image_url: string }[];
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
    // State untuk mendeteksi card mana yang sedang di-hover mouse
    const [hoveredCardId, setHoveredCardId] = useState<number | null>(null);

    const getFullImageUrl = (url?: string) => {
        if (!url) return '/destinasi-jurug-gedhe.jpg';
        if (url.startsWith('http://') || url.startsWith('https://')) return url;
        const cleanPath = url.startsWith('/') ? url : `/${url}`;
        return `${BACKEND_URL}${cleanPath}`;
    };

    // Auto-slide effect setiap 4 detik (jika mouse TIDAK sedang di atas card tersebut)
    useEffect(() => {
        const interval = setInterval(() => {
            destinations.forEach((dest) => {
                // Jangan auto-slide jika user sedang meletakkan mouse di card ini
                if (hoveredCardId === dest.id) return;

                const allGalleryImages: string[] = [];
                if (dest.image_url) allGalleryImages.push(getFullImageUrl(dest.image_url));
                if (dest.images && Array.isArray(dest.images)) {
                    dest.images.forEach(img => {
                        const formattedUrl = getFullImageUrl(img.image_url);
                        if (!allGalleryImages.includes(formattedUrl)) allGalleryImages.push(formattedUrl);
                    });
                }
                if (allGalleryImages.length <= 1) return; // Kalau cuma 1 foto, tidak usah geser

                setActiveImageIndexes(prev => {
                    const currentIndex = prev[dest.id] || 0;
                    const nextIndex = (currentIndex + 1) % allGalleryImages.length;
                    return { ...prev, [dest.id]: nextIndex };
                });
            });
        }, 4000); // Ganti gambar setiap 4 detik

        return () => clearInterval(interval);
    }, [destinations, hoveredCardId]);

    const handleNextImage = (e: React.MouseEvent, destId: number, totalImages: number) => {
        e.stopPropagation();
        setActiveImageIndexes(prev => {
            const currentIndex = prev[destId] || 0;
            const nextIndex = (currentIndex + 1) % totalImages;
            return { ...prev, [destId]: nextIndex };
        });
    };

    const handlePrevImage = (e: React.MouseEvent, destId: number, totalImages: number) => {
        e.stopPropagation();
        setActiveImageIndexes(prev => {
            const currentIndex = prev[destId] || 0;
            const prevIndex = (currentIndex - 1 + totalImages) % totalImages;
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
                        const allGalleryImages: string[] = [];
                        if (dest.image_url) {
                            allGalleryImages.push(getFullImageUrl(dest.image_url));
                        }
                        if (dest.images && Array.isArray(dest.images)) {
                            dest.images.forEach(img => {
                                const formattedUrl = getFullImageUrl(img.image_url);
                                if (!allGalleryImages.includes(formattedUrl)) {
                                    allGalleryImages.push(formattedUrl);
                                }
                            });
                        }

                        if (allGalleryImages.length === 0) {
                            allGalleryImages.push('/destinasi-jurug-gedhe.jpg');
                        }

                        const currentImageIndex = activeImageIndexes[dest.id] || 0;

                        return (
                            <div 
                                key={dest.id} 
                                onClick={() => router.push(`/destinations/${dest.id}`)}
                                onMouseEnter={() => setHoveredCardId(dest.id)} // Jeda auto-slide saat kursor di atas card
                                onMouseLeave={() => setHoveredCardId(null)}   // Lanjut auto-slide saat kursor keluar
                                className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-emerald-200 overflow-hidden flex flex-col justify-between group cursor-pointer transition-all duration-300"
                            >
                                <div>
                                    <div className="relative h-64 bg-slate-900 overflow-hidden">
                                        <div 
                                            className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out group-hover:scale-105"
                                            style={{ backgroundImage: `url('${allGalleryImages[currentImageIndex]}')` }}
                                        />
                                        
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-slate-950/20 pointer-events-none" />

                                        <div className="absolute top-4 left-4 z-10">
                                            <span className="px-3 py-1 rounded-full bg-white/80 backdrop-blur-md text-emerald-800 font-bold text-[10px] uppercase tracking-wider shadow-sm">
                                                {dest.type || 'Alam / Air Terjun'}
                                            </span>
                                        </div>

                                        <div className="absolute top-4 right-4 z-10">
                                            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/60 backdrop-blur-md text-white font-medium text-[10px]">
                                                <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                                                {currentImageIndex + 1} / {allGalleryImages.length}
                                            </span>
                                        </div>

                                        {allGalleryImages.length > 1 && (
                                            <>
                                                <button
                                                    onClick={(e) => handlePrevImage(e, dest.id, allGalleryImages.length)}
                                                    className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/70 hover:bg-white text-slate-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-md backdrop-blur-sm z-20"
                                                    title="Foto Sebelumnya"
                                                >
                                                    <ChevronLeft className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={(e) => handleNextImage(e, dest.id, allGalleryImages.length)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/70 hover:bg-white text-slate-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-md backdrop-blur-sm z-20"
                                                    title="Foto Selanjutnya"
                                                >
                                                    <ChevronRight className="w-4 h-4" />
                                                </button>

                                                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
                                                    {allGalleryImages.map((_, idx) => (
                                                        <span
                                                            key={idx}
                                                            className={`h-1.5 rounded-full transition-all duration-300 ${
                                                                idx === currentImageIndex 
                                                                    ? 'w-5 bg-emerald-400' 
                                                                    : 'w-1.5 bg-white/60'
                                                            }`}
                                                        />
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    <div className="p-6">
                                        <h4 className="font-bold text-slate-900 text-lg mb-2 group-hover:text-emerald-700 transition line-clamp-1">
                                            {dest.name}
                                        </h4>
                                        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                                            {dest.description || 'Nikmati panorama tebing dan keindahan alam eksotis.'}
                                        </p>
                                    </div>
                                </div>

                                <div className="px-6 pb-6 pt-0 flex items-center justify-between border-t border-slate-50 mt-2 pt-4">
                                    <p className="text-xs text-slate-500 flex items-center gap-1.5 truncate pr-2">
                                        <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                                        <span className="truncate font-medium">{dest.location || 'Ngoro-Oro, Patuk'}</span>
                                    </p>
                                    <div className="p-2.5 bg-slate-50 group-hover:bg-emerald-600 group-hover:text-white rounded-2xl transition flex-shrink-0 shadow-sm">
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