'use client';

import React from 'react';
import { MapPin, ArrowRight, Images as ImageIcon, ChevronLeft, ChevronRight, Boxes, Star } from 'lucide-react';

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

interface DestinationCardProps {
    dest: DestinationItem;
    currentSlideIndex: number;
    slides: { type: 'destination' | 'umkm'; url: string; title: string }[];
    embedded?: boolean;
    onCardClick: (id: number) => void;
    onNextSlide: (e: React.MouseEvent, id: number, total: number) => void;
    onPrevSlide: (e: React.MouseEvent, id: number, total: number) => void;
    onMouseEnter: (id: number) => void;
    onMouseLeave: () => void;
}

export default function DestinationCard({
    dest,
    currentSlideIndex,
    slides,
    embedded = false,
    onCardClick,
    onNextSlide,
    onPrevSlide,
    onMouseEnter,
    onMouseLeave,
}: DestinationCardProps) {
    const currentSlide = slides[currentSlideIndex] || slides[0];
    const totalUmkmProducts = dest.umkm_products?.length || 0;
    const isBundling = totalUmkmProducts > 0;

    return (
        <div
            onClick={() => onCardClick(dest.id)}
            onMouseEnter={() => onMouseEnter(dest.id)}
            onMouseLeave={onMouseLeave}
            className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-emerald-200 overflow-hidden flex flex-col justify-between group cursor-pointer transition-all duration-300 p-0"
        >
            <div>
                {/* Container Gambar Utama Full Menempel di Sisi Luar Kartu (Tanpa Padding)[cite: 3, 4] */}
                <div className={`relative bg-slate-900 overflow-hidden ${embedded ? 'h-48 xl:h-56' : 'h-60 sm:h-64'}`}>
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out group-hover:scale-105"
                        style={{ backgroundImage: `url('${currentSlide.url}')` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-slate-950/30 pointer-events-none" />

                    {/* TOP LEFT: Badge Kategori / Status[cite: 3, 4] */}
                    <div className="absolute top-4 left-4 z-10 flex flex-col gap-1">
                        {isBundling ? (
                            <span className="px-3 py-1 rounded-full bg-emerald-700/90 backdrop-blur-md text-white font-bold text-[10px] uppercase tracking-wider shadow-md border border-emerald-500/30">
                                📦 BUNDLING ({totalUmkmProducts})
                            </span>
                        ) : (
                            <span className="px-3 py-1 rounded-full bg-emerald-600/90 backdrop-blur-md text-white font-bold text-[10px] uppercase tracking-wider shadow-sm border border-emerald-500/30 flex items-center gap-1">
                                ⭐ {dest.badge_text || 'Populer'}
                            </span>
                        )}
                    </div>

                    {/* TOP RIGHT: Indikator Slide Foto */}
                    <div className="absolute top-4 right-4 z-10">
                        <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/60 backdrop-blur-md text-white font-medium text-[10px]">
                            <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                            {currentSlideIndex + 1} / {slides.length}
                        </span>
                    </div>

                    {/* Informasi Overlay Produk UMKM */}
                    {currentSlide.type === 'umkm' ? (
                        <div className="absolute bottom-12 left-4 right-4 z-10 flex items-center gap-3 bg-emerald-950/75 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-emerald-500/40 shadow-lg">
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
                    ) : null}

                    {/* Tombol Navigasi Slider (Next/Prev) */}
                    {slides.length > 1 && (
                        <>
                            <button
                                onClick={(e) => onPrevSlide(e, dest.id, slides.length)}
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/70 hover:bg-white text-slate-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-md backdrop-blur-sm z-20"
                                title="Sebelumnya"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                                onClick={(e) => onNextSlide(e, dest.id, slides.length)}
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
                                            idx === currentSlideIndex ? 'w-5 bg-emerald-400' : 'w-1.5 bg-white/60'
                                        }`}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Bagian Konten Kartu Putih di Bawah (Menumpuk di atas bagian bawah gambar)[cite: 3, 4] */}
                <div className="relative -mt-5 bg-white rounded-t-[18px] p-5 pt-4 pb-4 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
                    <h4 className="font-bold text-slate-900 text-base mb-1 group-hover:text-emerald-700 transition line-clamp-1">
                        {dest.name}
                    </h4>
                    
                    {/* Lokasi */}
                    <p className="text-xs text-slate-500 flex items-center gap-1 mb-3">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span className="truncate font-medium">{dest.location || 'Ngoro-Oro, Patuk'}</span>
                    </p>

                    {/* Rating & Tombol Aksi Bulat di Kanan Bawah[cite: 3, 4] */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                            <span>{dest.rating || '4.8'}</span>
                            <span className="text-slate-400 font-normal">({dest.reviews_count || '1.2k'})</span>
                        </div>

                        {/* Tombol Panah Bulat Hijau */}
                        <div className="w-9 h-9 bg-emerald-700 text-white rounded-full flex items-center justify-center group-hover:bg-emerald-800 transition shadow-sm">
                            <ArrowRight className="w-4 h-4" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}