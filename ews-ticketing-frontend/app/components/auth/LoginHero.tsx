import Image from 'next/image';
import Link from 'next/link';
import { Activity, MapPin, ShieldCheck } from 'lucide-react';

const highlights = [
    { icon: ShieldCheck, label: 'Smart Tourism' },
    { icon: Activity, label: 'EWS Real-time' },
    { icon: MapPin, label: 'UMKM Lokal' },
];

export default function LoginHero() {
    return (
        <section className="relative z-10 flex min-h-[440px] flex-1 flex-col justify-between px-7 py-6 text-white sm:px-10 sm:py-8 lg:min-h-screen lg:px-12 lg:py-8">
            {/* Logo, Tagline, & Badge Lokasi Sejajar di Atas */}
            <div className="relative z-10 -ml-2.5 sm:-ml-8.5 flex flex-wrap items-center justify-between gap-4">
                <Link href="/" className="inline-flex items-center gap-4" aria-label="SmartMandala beranda">
                    <Image
                        src="/images/logo1.png"
                        alt="SmartMandala"
                        width={160}
                        height={90}
                        className="h-20 w-auto object-contain object-left drop-shadow-md"
                        priority
                    />
                    <div className="hidden items-center gap-3 border-l border-white/40 pl-4 sm:flex">
                        <span className="text-sm font-medium leading-relaxed text-white/95">
                            Wisata Cerdas, Ekonomi Mandiri
                        </span>
                        <span className="text-white/30">|</span>
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-200">
                            <MapPin className="h-3 w-3 text-emerald-300" />
                            Jurug Gedhe, Gunungkidul
                        </span>
                    </div>
                </Link>

                {/* Badge untuk Tampilan Mobile (jika layar kecil) */}
                <div className="flex items-center gap-1 text-xs font-medium text-emerald-200 sm:hidden">
                    <MapPin className="h-3 w-3 text-emerald-300" />
                    <span>Jurug Gedhe, Gunungkidul</span>
                </div>
            </div>

            {/* Bagian Tengah (Murni Teks & Fitur) */}
            <div className="relative z-10 mt-6 mb-auto max-w-[580px] lg:my-auto lg:py-12">
                <h1 className="max-w-[540px] text-[2.2rem] font-extrabold leading-[1.12] tracking-tight sm:text-[2.6rem] lg:text-[2.85rem]">
                    Mitigasi Bencana Dan Integrasi Ekonomi{' '}
                    <span className="text-emerald-300">Rantai Pasok.</span>
                </h1>
                <p className="mt-4 max-w-[500px] text-sm leading-[1.65] text-white/90 sm:text-base">
                    Smart system terpadu untuk pengelolaan desa wisata, pemantauan EWS secara real-time, dan pengembangan UMKM lokal.
                </p>

                <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3">
                    {highlights.map(({ icon: Icon, label }) => (
                        <div key={label} className="flex items-center gap-2.5 text-xs font-medium text-white sm:text-sm">
                            <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-emerald-200/30 bg-emerald-950/40 text-emerald-200 shadow-inner">
                                <Icon className="h-4 w-4" />
                            </span>
                            {label}
                        </div>
                    ))}
                </div>
            </div>

            {/* Bagian Bawah: Teks Miring + Garis Melengkung Cantik */}
            <div className="relative z-10 mt-6 sm:-mt-6 pb-6 flex items-end justify-between">
                <div className="relative inline-block -rotate-6 transform origin-bottom-left">
                    <span className="font-[family-name:var(--font-caveat)] text-2xl leading-tight text-gray-300 sm:text-5xl italic">
                        Jelajahi, Nikmati,<br />Dukung Lokal
                    </span>
                    <svg
                        className="absolute -bottom-2 left-0 w-full h-3 text-amber-400/90 overflow-visible"
                        viewBox="0 0 200 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M 5,12 Q 90,2 185,14"
                            stroke="currentColor"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                        />
                    </svg>
                </div>
            </div>
        </section>
    );
}