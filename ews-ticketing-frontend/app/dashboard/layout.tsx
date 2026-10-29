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
            {/* Komponen Toast Notifikasi (Posisi di Pojok Kanan Atas) */}
            <Toaster position="top-right" richColors closeButton />

            {/* Sidebar di Kiri (Responsif untuk Mobile & Desktop) */}
            <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

            {/* Area Kanan (Navbar + Konten Utama) */}
            <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
                {/* Navbar Atas */}
                <AdminNavbar setSidebarOpen={setSidebarOpen} />

                {/* Konten Utama Halaman (Bisa di-scroll secara mandiri) */}
                <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-slate-50">
                    {children}
                </main>
            </div>
        </div>
    );
}