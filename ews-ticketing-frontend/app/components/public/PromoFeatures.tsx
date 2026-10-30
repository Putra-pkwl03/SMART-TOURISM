'use client';

import { ShoppingBag, QrCode, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function PromoFeatures() {
    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4">
            {/* Grid 12 Kolom: Kiri (7 Kolom) & Kanan (5 Kolom) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                
                {/* Banner 1: Paket Wisata & Bundling Hampers */}
                <div className="md:col-span-7 bg-gradient-to-r from-emerald-50/80 via-teal-50/40 to-white rounded-3xl p-6 sm:p-8 border border-emerald-100 flex flex-col sm:flex-row items-center justify-between relative overflow-hidden shadow-sm">
                    {/* Konten Teks: Menggunakan relative z-10 agar selalu berada di atas gambar */}
                    <div className="relative z-10 max-w-xs sm:max-w-sm mb-6 sm:mb-0 flex flex-col justify-between h-full">
                        <div>
                            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4">
                                <ShoppingBag className="w-5 h-5" />
                            </div>
                            <h4 className="text-xl font-bold text-slate-900 mb-2">Paket Wisata & Bundling Hampers</h4>
                            <p className="text-xs text-slate-600 leading-relaxed mb-6">
                                Nikmati pengalaman lengkap dengan paket wisata terintegrasi bersama produk UMKM lokal.
                            </p>
                        </div>
                        <div>
                            <button className="px-5 py-2.5 bg-emerald-900 hover:bg-emerald-950 text-white text-xs font-semibold rounded-full transition flex items-center gap-2 shadow-sm">
                                <span>Lihat Paket Wisata</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>

                    {/* Area Gambar Kiri (Diperbesar & diatur agar tidak menutupi teks) */}
                    <div className="relative w-full h-56 sm:w-64 sm:h-52 md:w-72 md:h-56 flex-shrink-0 flex items-center justify-center sm:justify-end z-0">
                        <Image 
                            src="/images/bundling-hampers1.png" 
                            alt="Paket Wisata & Bundling Hampers"
                            fill
                            className="object-contain object-right sm:scale-110 md:scale-125"
                        />
                    </div>
                </div>

                {/* Banner 2: E-Ticket & Riwayat Pesanan */}
                <div className="md:col-span-5 bg-gradient-to-r from-blue-50/80 via-sky-50/40 to-white rounded-3xl p-6 sm:p-8 border border-blue-100 flex flex-col sm:flex-row items-center justify-between relative overflow-hidden shadow-sm">
                    {/* Konten Teks: Menggunakan relative z-10 agar selalu berada di atas gambar */}
                    <div className="relative z-10 max-w-xs mb-6 sm:mb-0 flex flex-col justify-between h-full">
                        <div>
                            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center mb-4">
                                <QrCode className="w-5 h-5" />
                            </div>
                            <h4 className="text-xl font-bold text-slate-900 mb-2">E-Ticket & Riwayat Pesanan</h4>
                            <p className="text-xs text-slate-600 leading-relaxed mb-6">
                                Cek tiket Anda, unduh QR Code, dan lihat riwayat pemesanan dengan mudah.
                            </p>
                        </div>
                        <div>
                            {/* Tombol dibungkus Link menuju halaman e-ticket history */}
                            <Link href="/tickets/history">
                                <button className="px-5 py-2.5 bg-blue-900 hover:bg-blue-950 text-white text-xs font-semibold rounded-full transition flex items-center gap-2 shadow-sm cursor-pointer">
                                    <span>Lihat E-Ticket Saya</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                            </Link>
                        </div>
                    </div>

                    {/* Area Gambar Kanan (Diperbesar & diatur agar tidak menutupi teks) */}
                    <div className="relative w-full h-48 sm:w-44 sm:h-52 md:w-52 md:h-56 flex-shrink-0 flex items-center justify-center sm:justify-end z-0">
                        <Image 
                            src="/images/eticket-phone1.png" 
                            alt="E-Ticket & Riwayat Pesanan"
                            fill
                            className="object-contain object-right sm:scale-110 md:scale-125"
                        />
                    </div>
                </div>

            </div>
        </section>
    );
}