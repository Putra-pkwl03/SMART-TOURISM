'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronLeft, ChevronRight, Image as ImageIcon, Search } from 'lucide-react';

export interface CatalogImageSlide {
    src: string;
    title: string;
}

interface CatalogImageHeroProps {
    eyebrow: string;
    title: string;
    description: string;
    itemCount: number;
    countLabel: string;
    slides: CatalogImageSlide[];
    backHref: string;
    search: string;
    onSearchChange: (value: string) => void;
    searchPlaceholder: string;
    searchLabel: string;
}

export default function CatalogImageHero({
    eyebrow,
    title,
    description,
    itemCount,
    countLabel,
    slides,
    backHref,
    search,
    onSearchChange,
    searchPlaceholder,
    searchLabel,
}: CatalogImageHeroProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const activeSlideIndex = slides.length ? activeIndex % slides.length : 0;
    const activeSlide = slides[activeSlideIndex];

    useEffect(() => {
        if (slides.length < 2) return;
        const interval = window.setInterval(() => {
            setActiveIndex((index) => (index + 1) % slides.length);
        }, 5000);
        return () => window.clearInterval(interval);
    }, [slides.length]);

    const changeSlide = (direction: -1 | 1) => {
        if (!slides.length) return;
        setActiveIndex((index) => (index + direction + slides.length) % slides.length);
    };

    return (
        <section className="relative isolate overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-800 text-white">
            <div className="absolute -right-20 -top-20 -z-10 h-80 w-80 rounded-full bg-emerald-300/10 blur-3xl" />
            <div className="absolute -bottom-28 left-1/4 -z-10 h-72 w-72 rounded-full bg-teal-200/10 blur-3xl" />
            <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-20">
                <div>
                    <Link href={backHref} className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-emerald-100 transition hover:text-white">
                        <ArrowLeft className="h-4 w-4" /> Kembali ke Beranda
                    </Link>
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold tracking-wide text-emerald-100 backdrop-blur">
                        <ImageIcon className="h-4 w-4" />
                        {eyebrow}
                    </span>
                    <h1 className="mt-5 max-w-2xl text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                        {title}
                    </h1>
                    <p className="mt-4 max-w-xl text-sm leading-7 text-emerald-50/90 sm:text-base">
                        {description}
                    </p>

                    <div className="mt-6 inline-flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
                        <span className="text-2xl font-black text-white">{itemCount}</span>
                        <span className="text-xs font-semibold text-emerald-50/85">{countLabel}</span>
                    </div>

                    <label className="mt-7 flex max-w-xl items-center gap-3 rounded-2xl border border-white/30 bg-white px-4 py-3.5 shadow-lg shadow-emerald-950/10 focus-within:ring-4 focus-within:ring-emerald-200/40">
                        <Search className="h-5 w-5 shrink-0 text-emerald-700" />
                        <input
                            type="search"
                            value={search}
                            onChange={(event) => onSearchChange(event.target.value)}
                            placeholder={searchPlaceholder}
                            aria-label={searchLabel}
                            className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                        />
                    </label>
                </div>

                <div className="relative mx-auto w-full max-w-xl lg:ml-auto">
                    <div className="absolute -inset-3 rotate-3 rounded-[2rem] bg-emerald-300/15" />
                    <div
                        role={activeSlide ? 'img' : undefined}
                        aria-label={activeSlide?.title}
                        className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] border border-white/20 bg-emerald-950/40 bg-cover bg-center shadow-2xl transition-[background-image] duration-500"
                        style={activeSlide ? { backgroundImage: `url("${activeSlide.src}")` } : undefined}
                    >
                        {!activeSlide && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <ImageIcon className="h-16 w-16 text-white/40" />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/75 via-transparent to-emerald-950/10" />
                        {slides.length > 1 && (
                            <>
                                <button
                                    type="button"
                                    onClick={() => changeSlide(-1)}
                                    aria-label="Foto sebelumnya"
                                    className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-slate-800 shadow transition hover:bg-white"
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => changeSlide(1)}
                                    aria-label="Foto berikutnya"
                                    className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-slate-800 shadow transition hover:bg-white"
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </button>
                            </>
                        )}
                        {activeSlide && (
                            <div className="absolute bottom-5 left-5 right-5 z-10 flex items-end justify-between gap-4">
                                <p className="truncate text-sm font-bold text-white drop-shadow-md">{activeSlide.title}</p>
                                {slides.length > 1 && (
                                    <div className="flex shrink-0 gap-1.5">
                                        {slides.map((slide, index) => (
                                            <button
                                                key={`${slide.src}-${index}`}
                                                type="button"
                                                onClick={() => setActiveIndex(index)}
                                                aria-label={`Tampilkan foto ${index + 1}`}
                                                aria-pressed={activeSlideIndex === index}
                                                className={`h-2 rounded-full transition-all ${activeSlideIndex === index ? 'w-6 bg-white' : 'w-2 bg-white/55 hover:bg-white/80'}`}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
