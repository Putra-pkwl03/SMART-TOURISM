'use client';

import EwsWeatherWidget from './EwsWeatherWidget';

export default function HeroSection() {
    return (
        <section className="relative min-h-[460px] bg-slate-900 text-white flex items-center overflow-hidden">
            {/* Background Image */}
            <div 
                className="absolute inset-0 bg-cover bg-center z-0 opacity-85 transition-all duration-700"
                style={{ backgroundImage: `url('/hero-ngoro-oro.png')` }}
            />
            
            {/* Dark Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-slate-950/30 to-transparent z-0" />
            <div className="absolute inset-0 bg-black/20 z-0" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-4">
                    <span className="inline-block px-3 py-1 rounded-full bg-emerald-600/40 border border-emerald-400/50 text-emerald-200 text-[11px] font-bold uppercase tracking-wider shadow-sm">
                        ✨ Selamat Datang di
                    </span>
                    
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight drop-shadow-md">
                        Desa Wisata <span className="text-emerald-400">Ngoro-Oro</span>
                    </h2>
                    
                    <p className="text-slate-100 text-xs sm:text-sm leading-relaxed max-w-xl drop-shadow">
                        Keindahan Alam, Keberagaman Budaya, dan Produk Lokal dalam Satu Pengalaman.
                    </p>

                    {/* Kategori Badge */}
                    <div className="flex flex-wrap gap-2 pt-1">
                        {['Wisata Alam', 'Kuliner Lokal', 'UMKM', 'Budaya & Edukasi'].map((tag, idx) => (
                            <span 
                                key={idx} 
                                className="px-3 py-1 rounded-xl bg-slate-900/60 backdrop-blur-md border border-white/20 text-[11px] font-semibold text-white shadow"
                            >
                                🌿 {tag}
                            </span>
                        ))}
                    </div>

                    <div className="pt-1 text-xs font-bold text-emerald-300 italic tracking-wide drop-shadow">
                        Jelajahi, Nikmati, Dukung Lokal!
                    </div>
                </div>

                <div className="lg:col-span-5 flex justify-center lg:justify-end">
                    <EwsWeatherWidget />
                </div>
            </div>
        </section>
    );
}