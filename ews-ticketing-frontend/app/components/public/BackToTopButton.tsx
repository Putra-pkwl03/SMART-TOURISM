'use client';

import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

export default function BackToTopButton() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const updateVisibility = () => setIsVisible(window.scrollY > 400);
        const animationFrame = window.requestAnimationFrame(updateVisibility);
        window.addEventListener('scroll', updateVisibility, { passive: true });
        return () => {
            window.cancelAnimationFrame(animationFrame);
            window.removeEventListener('scroll', updateVisibility);
        };
    }, []);

    if (!isVisible) return null;

    return (
        <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Kembali ke atas"
            title="Kembali ke atas"
            className="fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-emerald-700 text-white shadow-lg shadow-emerald-950/20 transition hover:-translate-y-1 hover:bg-emerald-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300 sm:bottom-7 sm:right-7"
        >
            <ArrowUp className="h-5 w-5" />
        </button>
    );
}
