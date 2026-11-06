'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, BellRing, Compass, History, Ticket } from 'lucide-react';

const quickLinks = [
    { label: 'E-Ticket', href: '/#booking', icon: Ticket, tone: 'bg-emerald-50 text-emerald-700' },
    { label: 'Cek EWS', href: '/#ews-detail', icon: BellRing, tone: 'bg-blue-50 text-blue-700' },
    { label: 'Peta Wisata', href: '/#destinasi', icon: Compass, tone: 'bg-teal-50 text-teal-700' },
    { label: 'Riwayat Tiket', href: '/tickets/history', icon: History, tone: 'bg-indigo-50 text-indigo-700' },
];

export function PromoBanner() {
    return (
        <article className="relative isolate flex min-h-[380px] h-full flex-col justify-end overflow-hidden rounded-3xl border border-slate-200 bg-slate-900 p-6 text-white shadow-sm sm:min-h-[420px] sm:p-8">
            {/* Gambar Background */}
            <Image
                src="/images/bgcardlandingpage1.png"
                alt="Liburan Cerdas Bersama SmartMandala"
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="absolute inset-0 z-0 object-cover object-center"
            />
            
            {/* Soft Shadow / Gradient halus di bagian bawah agar tombol lebih kontras */}
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

            {/* Container Tombol di bawah teks gambar */}
            <div className="relative z-20 max-w-[60%] pb-2">
                <Link
                    href="/#booking"
                    className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-xs font-extrabold text-emerald-900 shadow-lg transition duration-200 hover:-translate-y-0.5 hover:bg-emerald-50 active:translate-y-0"
                >
                    Pesan Sekarang
                    <ArrowRight className="h-4 w-4" />
                </Link>
            </div>
        </article>
    );
}

export function QuickAccessCard() {
    return (
        <aside className="h-full rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-4">
                <h2 className="text-base font-extrabold text-slate-900">Akses Cepat</h2>
                <p className="mt-1 text-xs text-slate-500">Menu penting untuk perjalanan Anda</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
                {quickLinks.map(({ label, href, icon: Icon, tone }) => (
                    <Link
                        key={label}
                        href={href}
                        className="group flex min-h-24 flex-col items-center justify-center rounded-2xl border border-slate-100 bg-slate-50/70 p-3 text-center transition hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-white hover:shadow-md sm:min-h-28 sm:p-4"
                    >
                        <span className={`flex h-11 w-11 items-center justify-center rounded-full ${tone}`}>
                            <Icon className="h-5 w-5" />
                        </span>
                        <span className="mt-2 block text-xs font-extrabold text-slate-800 group-hover:text-emerald-800">{label}</span>
                    </Link>
                ))}
            </div>
        </aside>
    );
}