'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
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
    QrCode as ScanIcon,
    Package,
    ShoppingBag,
    ShoppingCart,
    DollarSign
} from 'lucide-react';
import { apiClient } from '@/app/lib/axios';
import { clearAuthSession } from '@/app/lib/auth-session';
import LogoutModal from './LogoutModal';
import { toast } from 'sonner';

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

    // Mendapatkan role user yang sedang login (Sinkron dengan Cookie & LocalStorage)
    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            const getCookie = (name: string) => {
                const value = `; ${document.cookie}`;
                const parts = value.split(`; ${name}=`);
                if (parts.length === 2) return parts.pop()?.split(';').shift();
                return null;
            };

            const roleFromCookie = getCookie('user_role');
            const roleFromStorage = localStorage.getItem('user_role');
            setUserRole(roleFromCookie || roleFromStorage || 'admin');
        }, 0);

        return () => window.clearTimeout(timeoutId);
    }, [pathname]);

    const executeLogout = async () => {
        setLoadingLogout(true);
        let logoutFailed = false;

        try {
            await apiClient.post('/logout');
        } catch (error) {
            logoutFailed = true;
            console.error('Logout request failed:', error);
        } finally {
            clearAuthSession();
            setShowLogoutModal(false);
            setLoadingLogout(false);
            if (logoutFailed) {
                toast.error('Sesi di perangkat ini diakhiri, tetapi server gagal membatalkan token.');
            }
            router.replace('/auth/login');
        }
    };

    // Daftar Menu untuk Admin / Pokdarwis (Akses Penuh)
    const adminMenuItems = [
        { name: 'Dashboard', href: '/dashboard/admin', icon: LayoutDashboard },
        { name: 'Destinasi', href: '/dashboard/admin/destinations', icon: MapPin },
        { name: 'Tiket', href: '/dashboard/admin/tickets', icon: Ticket },
        { name: 'EWS', href: '/dashboard/admin/ews', icon: Activity },
        { name: 'Konsinyasi dan Laporan', href: '/dashboard/admin/consignment', icon: PieChart },
    ];

    // Daftar Menu untuk Petugas Lapangan / Loket (Ticketing Officer)
    const officerMenuItems = [
        { name: 'Dashboard Loket', href: '/dashboard/loket', icon: LayoutDashboard },
        { name: 'Validasi E-Ticket', href: '/dashboard/officer/scan', icon: ScanIcon },
        { name: 'Monitoring EWS & Cuaca', href: '/dashboard/officer/ews', icon: Activity },
    ];

    // Daftar Menu untuk Mitra / Pengurus UMKM (UMKM Sedyo Maju)
    const umkmMenuItems = [
        { name: 'Dashboard UMKM', href: '/dashboard/umkm', icon: LayoutDashboard },
        { name: 'Produk dan Stok', href: '/dashboard/umkm/products', icon: Package },
        { name: 'Kasir Offline', href: '/dashboard/umkm/cashier', icon: ShoppingCart },
        { name: 'Laporan Penjualan', href: '/dashboard/umkm/sales', icon: ShoppingBag },
    ];

    // Pengecekan role aktif
    const isOfficer = userRole === 'ticketing_officer';
    const isUmkm = userRole === 'umkm_mitra';

    // Penentuan menu yang akan dirender berdasarkan role
    let menuItems = adminMenuItems;
    let roleLabel = 'Admin / Pokdarwis';

    if (isOfficer) {
        menuItems = officerMenuItems;
        roleLabel = 'Ticketing Officer';
    } else if (isUmkm) {
        menuItems = umkmMenuItems;
        roleLabel = 'Mitra UMKM Sedyo Maju';
    }

    return (
        <>
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-slate-950/60 z-40 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <aside className={`
                fixed inset-y-0 left-0 z-50 w-[min(18rem,85vw)] text-slate-200 flex flex-col justify-between border-r border-emerald-950 transition-transform duration-300 ease-in-out lg:relative lg:inset-auto lg:z-auto lg:w-64 lg:flex-shrink-0 lg:translate-x-0 bg-no-repeat overflow-hidden
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}
            style={{ 
                backgroundImage: `url('/images/bgsedebar.png')`,
                backgroundSize: '160% auto', // Memperkecil gambar (zoom out) agar area lanskapnya pas
                backgroundPosition: '50% bottom' // Memposisikan gambar agar berada di tengah secara horizontal dan menempel di bawah
            }}
            >
                {/* Overlay gradasi: Bagian atas dibuat hijau pekat lebih panjang/tebal, dan hanya transparan di bagian paling bawah */}
                <div className="absolute inset-0 bg-gradient-to-b from-emerald-950 via-emerald-950/95 to-emerald-950/50 pointer-events-none -z-0" />

                {/* Konten Utama Sidebar (Berada di atas overlay) */}
                <div className="relative z-10 flex flex-col h-full justify-between">
                    <div>
                        <div className="p-6 border-b border-emerald-900/60 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white p-1 shadow-md">
                                    <Image
                                        src="/images/logo1.png"
                                        alt="Logo SmartMandala"
                                        width={56}
                                        height={48}
                                        className="h-full w-full object-contain"
                                    />
                                </div>
                                <div>
                                    <h1 className="text-sm font-bold tracking-tight text-white">SmartMandala</h1>
                                    <p className="mt-1 text-[10px] leading-relaxed text-emerald-100/80">
                                        Smart system desa wisata &amp; EWS
                                    </p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="lg:hidden p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-emerald-900/50 transition"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="px-4 py-6 overflow-y-auto max-h-[calc(100vh-140px)]">
                            <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-emerald-300/80 mb-3 flex items-center gap-1.5">
                                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                <span>Role: {roleLabel}</span>
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
                                                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950 font-semibold' 
                                                    : 'hover:bg-emerald-900/60 hover:text-white text-slate-200'
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

                    <div className="p-4 border-t border-emerald-900/60 bg-emerald-950/9oomla">
                        <button
                            type="button"
                            onClick={() => setShowLogoutModal(true)}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-300 hover:bg-red-500/20 hover:text-red-200 transition border border-red-500/30 cursor-pointer"
                        >
                            <LogOut className="w-5 h-5 flex-shrink-0" />
                            <span className="text-left leading-snug">Keluar</span>
                        </button>
                    </div>
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