'use client';

import EwsWeatherWidget from './EwsWeatherWidget';

export default function HeroSection() {
    return (
        <section className="relative min-h-[480px] lg:min-h-[520px] bg-slate-900 text-white flex items-center overflow-hidden">
            {/* Background Image with Balanced Opacity */}
            <div 
                className="absolute inset-0 bg-cover bg-center z-0 opacity-65 scale-105 transition-transform duration-1000 ease-out"
                style={{ backgroundImage: `url('/hero-ngoro-oro.png')` }}
            />
            
       {/* Soft & Bright Overlay Gradients (Dibuat jauh lebih terang/tidak gelap) */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/50 via-emerald-950/10 to-transparent z-0" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent z-0" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-24 lg:pb-28 w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
                
                {/* Left Content Column */}
                <div className="lg:col-span-7 space-y-4">
                    
                    {/* Badge Top */}
                    <div>
                        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-white text-xs font-semibold uppercase tracking-wider backdrop-blur-md shadow-md">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                            </span>
                            Selamat Datang di
                        </span>
                    </div>

                    {/* Main Heading & Subtitle */}
                    <div className="space-y-2">
                        {/* Judul SmartMandala warna Putih Bersih */}
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white drop-shadow-md">
                            SmartMandala
                        </h1>
                        
                        {/* Subtitle warna putih */}
                        <p className="text-white text-sm sm:text-base font-normal tracking-wide max-w-lg leading-relaxed drop-shadow-md">
                            Smart system untuk manajemen desa wisata dan peringatan bencana
                        </p>
                    </div>

                    {/* Category Tags (Glassmorphism Pills) */}
                    <div className="flex flex-wrap gap-2 pt-1">
                        {[
                            { name: 'Wisata Alam', icon: '🌲' },
                            { name: 'Kuliner Lokal', icon: '🍲' },
                            { name: 'UMKM', icon: '🛍️' },
                            { name: 'Budaya & Edukasi', icon: '🏛️' }
                        ].map((tag, idx) => (
                            <span 
                                key={idx} 
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/70 backdrop-blur-md border border-slate-700 text-xs font-medium text-white shadow-sm hover:border-white hover:bg-slate-800 transition-all duration-300"
                            >
                                <span>{tag.icon}</span>
                                <span>{tag.name}</span>
                            </span>
                        ))}
                    </div>

                    {/* Tagline Putih dengan Variasi Cursive & Garis Bawah Putih */}
                    <div className="pt-2 relative inline-block">
                        <span className="text-base sm:text-lg font-bold text-white italic tracking-wide font-serif drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                            Jelajahi, Nikmati, Dukung Lokal!
                        </span>
                        
                        {/* Aksen Garis Bawah Putih Artistik */}
                        <svg 
                            className="absolute -bottom-1.5 left-0 w-full h-2 text-white/90 overflow-visible" 
                            viewBox="0 0 100 20" 
                            preserveAspectRatio="none"
                        >
                            <path 
                                d="M0,15 Q50,5 100,12" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="3" 
                                strokeLinecap="round" 
                            />
                        </svg>
                    </div>

                </div>

                {/* Right Widget Column */}
                <div className="lg:col-span-5 flex justify-center lg:justify-end">
                    <div className="w-full max-w-md transform hover:-translate-y-1 transition-transform duration-500">
                        <EwsWeatherWidget />
                    </div>
                </div>

            </div>
        </section>
    );
}