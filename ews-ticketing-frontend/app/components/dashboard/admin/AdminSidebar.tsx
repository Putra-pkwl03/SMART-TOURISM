'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { 
    LayoutDashboard, 
    MapPin, 
    Ticket, 
    Activity, 
    AlertTriangle, 
    PieChart, 
    Settings, 
    LogOut,
    ShieldCheck,
    X,
    QrCode as ScanIcon
} from 'lucide-react';
import { apiClient } from '@/app/lib/axios';
import LogoutModal from './LogoutModal';

interface AdminSidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

export default function AdminSidebar({ isOpen, setIsOpen }: AdminSidebarProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [loadingLogout, setLoadingLogout] = useState(false);
    const [userRole, setUserRole] = useState<string>('admin');

    // Mendapatkan role user yang sedang login saat komponen dimuat
    useEffect(() => {
        const storedRole = localStorage.getItem('user_role') || 'admin';
        setUserRole(storedRole);
    }, []);

    const executeLogout = async () => {
        setLoadingLogout(true);
        try {
            await apiClient.post('/logout');
        } catch (e) {
            // Abaikan error jaringan
        } finally {
            localStorage.clear();
            document.cookie = 'auth_token=; path=/; max-age=0';
            document.cookie = 'user_role=; path=/; max-age=0';
            router.push('/auth/login');
            router.refresh();
        }
    };

    // Daftar Menu untuk Admin / Pokdarwis (Akses Penuh)
    const adminMenuItems = [
        { name: 'Dashboard', href: '/dashboard/admin', icon: LayoutDashboard },
        { name: 'Destinasi', href: '/dashboard/admin/destinations', icon: MapPin },
        { name: 'Tiket', href: '/dashboard/admin/tickets', icon: Ticket },
        { name: 'EWS', href: '/dashboard/admin/ews', icon: Activity },
        { name: 'Peringatan', href: '/dashboard/admin/alerts', icon: AlertTriangle },
        { name: 'Konsinyasi', href: '/dashboard/admin/consignment', icon: PieChart },
        { name: 'Pengaturan', href: '/dashboard/admin/settings', icon: Settings },
    ];

    // Daftar Menu untuk Petugas Lapangan / Loket (Ticketing Officer) - Ditambahkan Dashboard Loket di awal
    const officerMenuItems = [
        { name: 'Dashboard Loket', href: '/dashboard/loket', icon: LayoutDashboard },
        { name: 'Validasi E-Ticket', href: '/dashboard/officer/scan', icon: ScanIcon },
        { name: 'Monitoring EWS & Cuaca', href: '/dashboard/officer/ews', icon: Activity },
    ];

    // Pengecekan disesuaikan dengan nilai dari database: 'ticketing_officer'
    const isOfficer = userRole === 'ticketing_officer';
    const menuItems = isOfficer ? officerMenuItems : adminMenuItems;

    return (
        <>
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-slate-950/60 z-40 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col justify-between border-r border-slate-800 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div>
                    <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2.5 mb-1">
                                <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-md">
                                    ST
                                </div>
                                <h1 className="text-white font-bold text-sm tracking-wider">SMART TOURISM</h1>
                            </div>
                            <p className="text-[11px] text-slate-400">Jurug Gedhe & EWS Terpadu</p>
                        </div>
                        <button 
                            onClick={() => setIsOpen(false)}
                            className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="px-4 py-6 overflow-y-auto max-h-[calc(100vh-140px)]">
                        <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-blue-400" />
                            <span>Role: {isOfficer ? 'Ticketing Officer' : 'Admin / Pokdarwis'}</span>
                        </p>
                        <nav className="space-y-2">
                            {menuItems.map((item, index) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href;
                                return (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            router.push(item.href);
                                            setIsOpen(false);
                                        }}
                                        className={`w-full cursor-pointer flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                                            isActive 
                                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                                                : 'hover:bg-slate-800 hover:text-white text-slate-300'
                                        }`}
                                    >
                                        <Icon className="w-5 h-5 flex-shrink-0" />
                                        <span className="text-left leading-snug">{item.name}</span>
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                </div>

                <div className="p-4 border-t border-slate-800 bg-slate-950/40">
                    <button
                        type="button"
                        onClick={() => setShowLogoutModal(true)}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition border border-red-500/20"
                    >
                        <LogOut className="w-5 h-5 flex-shrink-0" />
                        <span className="text-left leading-snug">Keluar</span>
                    </button>
                </div>
            </aside>

            <LogoutModal 
                isOpen={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onConfirm={executeLogout}
                loading={loadingLogout}
            />
        </>
    );
}