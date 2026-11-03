'use client';

import { useState, useEffect } from 'react';
import { Menu, Bell, Loader2 } from 'lucide-react';
import { apiClient } from '@/app/lib/axios';

interface AdminNavbarProps {
    setSidebarOpen: (open: boolean) => void;
}

export default function AdminNavbar({ setSidebarOpen }: AdminNavbarProps) {
    const [userName, setUserName] = useState('Admin Pokdarwis');
    const [loading, setLoading] = useState(true);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        apiClient.get('/me')
            .then(res => {
                if (res.data?.name) {
                    setUserName(res.data.name);
                }
            })
            .catch(() => {
                setUserName('Operator');
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    // Mendeteksi event scroll dari area konten utama (<main>)
    useEffect(() => {
        const mainContainer = document.querySelector('main');
        
        const handleScroll = () => {
            if (mainContainer) {
                setIsScrolled(mainContainer.scrollTop > 10);
            }
        };

        mainContainer?.addEventListener('scroll', handleScroll);
        return () => mainContainer?.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`h-16 px-6 flex items-center justify-between flex-shrink-0 z-30 transition-all duration-300 bg-transparent ${
            isScrolled ? 'border-b border-slate-200 shadow-sm' : 'border-b border-transparent'
        }`}>
            {/* Sisi Kiri: Tombol Hamburger & Judul Sistem */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="lg:hidden p-2 rounded-xl bg-white/80 backdrop-blur-sm text-slate-700 hover:bg-white transition shadow-sm"
                    aria-label="Buka Menu"
                >
                    <Menu className="w-5 h-5" />
                </button>
                <div>
                    <h2 className="text-sm font-bold text-slate-900 tracking-wide drop-shadow-sm">SMART TOURISM POKDARWIS</h2>
                    <p className="text-[11px] text-slate-600 hidden sm:block font-medium">Desa Wisata Jurug Gedhe & Mitigasi EWS</p>
                </div>
            </div>

            {/* Sisi Kanan: Status Indikator, Notifikasi, & Profil Username */}
            <div className="flex items-center gap-3">
                {/* Indikator EWS */}
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white/80 backdrop-blur-sm border border-emerald-200 rounded-full text-xs font-medium text-emerald-700 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>EWS Normal</span>
                </div>

                {/* Tombol Notifikasi */}
                <button 
                    className="p-2.5 rounded-xl bg-white/80 backdrop-blur-sm text-slate-600 hover:bg-white transition relative shadow-sm"
                    aria-label="Notifikasi Sistem"
                >
                    <Bell className="w-4 h-4" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full" />
                </button>

                {/* Divider Pemisah */}
                <div className="h-6 w-px bg-slate-300/60 mx-1" />

                {/* Profil Pengguna (Username & Avatar dengan Indikator Loading) */}
                <div className="flex items-center gap-2.5 pl-1">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs shadow-md">
                        {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            userName.charAt(0).toUpperCase()
                        )}
                    </div>
                    <span className="text-xs font-semibold text-slate-800 hidden sm:inline-block max-w-[120px] truncate">
                        {loading ? 'Memuat...' : userName}
                    </span>
                </div>
            </div>
        </header>
    );
}