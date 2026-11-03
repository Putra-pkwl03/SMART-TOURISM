'use client';

import { useState } from 'react';
import { Toaster } from 'sonner';
import AdminSidebar from '@/app/components/dashboard/admin/AdminSidebar';
import AdminNavbar from '@/app/components/dashboard/admin/AdminNavbar';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            {/* Komponen Toast Notifikasi */}
            <Toaster position="top-right" richColors closeButton />

            {/* Sidebar di Kiri */}
            <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

            {/* Area Kanan (Navbar + Konten Utama) */}
            <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
                
                {/* 1. Header Hero Background dengan Gradasi Kiri & Merambat ke Kanan */}
                <div 
                    className="absolute top-0 left-0 right-0 h-80 bg-cover bg-center bg-no-repeat pointer-events-none z-0"
                    style={{ backgroundImage: `url('/images/bgdashboard.png')` }}
                >
                    {/* Gradasi dari kiri ke kanan: area putih/fade diperluas hingga melewati tengah */}
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-50/90 via-slate-50/50 to-transparent" />

                    {/* Gradasi Bawah (Menyatu mulus ke bg-slate-50) */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-50" />
                </div>

                {/* 2. Navbar Atas (Berada di atas background) */}
                <div className="relative z-10">
                    <AdminNavbar setSidebarOpen={setSidebarOpen} />
                </div>

                {/* 3. Konten Utama Halaman dengan Custom Scrollbar */}
                <main className="flex-1 overflow-y-auto p-4 lg:p-8 relative z-10 scrollbar-thin scrollbar-thumb-emerald-700/40 scrollbar-track-transparent [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-emerald-500/40 hover:[&::-webkit-scrollbar-thumb]:bg-emerald-600/60 transition-all">
                    {children}
                </main>
            </div>
        </div>
    );
}