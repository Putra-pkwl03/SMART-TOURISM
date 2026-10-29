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

    useEffect(() => {
        apiClient.get('/me')
            .then(res => {
                if (res.data?.name) {
                    setUserName(res.data.name);
                }
            })
            .catch(() => {
                // Callback jika gagal / token kedaluwarsa, biarkan menggunakan fallback
                setUserName('Operator');
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between flex-shrink-0 z-30 shadow-sm">
            {/* Sisi Kiri: Tombol Hamburger & Judul Sistem */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="lg:hidden p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
                    aria-label="Buka Menu"
                >
                    <Menu className="w-5 h-5" />
                </button>
                <div>
                    <h2 className="text-sm font-bold text-slate-900 tracking-wide">SMART TOURISM POKDARWIS</h2>
                    <p className="text-[11px] text-slate-500 hidden sm:block">Desa Wisata Jurug Gedhe & Mitigasi EWS</p>
                </div>
            </div>

            {/* Sisi Kanan: Status Indikator, Notifikasi, & Profil Username */}
            <div className="flex items-center gap-3">
                {/* Indikator EWS */}
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full text-xs font-medium text-emerald-700">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>EWS Normal</span>
                </div>

                {/* Tombol Notifikasi */}
                <button 
                    className="p-2.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition relative"
                    aria-label="Notifikasi Sistem"
                >
                    <Bell className="w-4 h-4" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full" />
                </button>

                {/* Divider Pemisah */}
                <div className="h-6 w-px bg-slate-200 mx-1" />

                {/* Profil Pengguna (Username & Avatar dengan Indikator Loading) */}
                <div className="flex items-center gap-2.5 pl-1">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs shadow-sm">
                        {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            userName.charAt(0).toUpperCase()
                        )}
                    </div>
                    <span className="text-xs font-semibold text-slate-700 hidden sm:inline-block max-w-[120px] truncate">
                        {loading ? 'Memuat...' : userName}
                    </span>
                </div>
            </div>
        </header>
    );
}