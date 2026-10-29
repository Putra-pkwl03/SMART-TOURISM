'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, User, LogOut, Ticket, ChevronDown, UserCircle } from 'lucide-react';
import { toast } from 'sonner';
import { apiClient } from '@/app/lib/axios';
import LogoutModal from '@/app/components/dashboard/admin/LogoutModal'; 

function NavbarContent() {
    const pathname = usePathname();
    const router = useRouter();

    const [activeHash, setActiveHash] = useState('');
    const [currentUser, setCurrentUser] = useState<{ id: number; name: string; email: string; role: string } | null>(null);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);
    
    // State untuk Dropdown User Menu
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // 1. Cek Sesi Login User saat Komponen Dimuat
    useEffect(() => {
        const checkUserSession = () => {
            const userStr = localStorage.getItem('user');
            const token = localStorage.getItem('token') || localStorage.getItem('auth_token');

            if (userStr && token) {
                try {
                    setCurrentUser(JSON.parse(userStr));
                } catch (e) {
                    console.error("Gagal membaca data user:", e);
                }
            } else {
                setCurrentUser(null);
            }
        };

        checkUserSession();

        window.addEventListener('storage', checkUserSession);
        return () => window.removeEventListener('storage', checkUserSession);
    }, [pathname]);

    // Tutup dropdown ketika klik di luar area dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // 2. Scroll Detection untuk Active Link
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setActiveHash(window.location.hash);
        }

        const handleScroll = () => {
            if (pathname !== '/') return;

            const sections = ['destinasi', 'booking', 'paket', 'umkm', 'tentang'];
            const scrollPosition = window.scrollY + 120;

            let currentSection = '';
            for (const sectionId of sections) {
                const element = document.getElementById(sectionId);
                if (element) {
                    const top = element.offsetTop;
                    const height = element.offsetHeight;
                    if (scrollPosition >= top && scrollPosition < top + height) {
                        currentSection = `#${sectionId}`;
                        break;
                    }
                }
            }

            if (window.scrollY < 200) {
                setActiveHash('');
            } else if (currentSection) {
                setActiveHash(currentSection);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [pathname]);

    // 3. Fungsi Konfirmasi & Eksekusi Logout
    const handleConfirmLogout = async () => {
        try {
            setLoggingOut(true);
            await apiClient.post('/auth/logout').catch(() => {});
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Hapus data dari LocalStorage
            localStorage.removeItem('token');
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');

            // Hapus Cookie
            document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
            document.cookie = 'user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';

            setCurrentUser(null);
            setIsLogoutModalOpen(false);
            setLoggingOut(false);
            setIsDropdownOpen(false);
            toast.success('Berhasil keluar dari akun.');
            router.push('/');
        }
    };

    const navLinks = [
        { name: 'Beranda', href: '/', hash: '' },
        { name: 'Destinasi', href: '/#destinasi', hash: '#destinasi', matchPrefix: '/destinations' },
        { name: 'E-Ticket', href: '/#booking', hash: '#booking' },
        { name: 'Paket Wisata', href: '/#paket', hash: '#paket' },
        { name: 'UMKM', href: '/#umkm', hash: '#umkm' },
        { name: 'Tentang', href: '/#tentang', hash: '#tentang' },
    ];

    const isLinkActive = (link: typeof navLinks[0]) => {
        if (link.matchPrefix && pathname.startsWith(link.matchPrefix)) {
            return true;
        }

        if (pathname === '/') {
            if (link.hash === '') {
                return activeHash === '';
            }
            return activeHash === link.hash;
        }

        return pathname === link.href;
    };

    return (
        <>
            <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    
                    {/* Logo & Brand */}
                    <Link href="/" className="flex items-center gap-3 cursor-pointer">
                        <div className="w-10 h-10 bg-emerald-700 rounded-xl flex items-center justify-center text-white font-bold shadow-md">
                            🌿
                        </div>
                        <div>
                            <h1 className="font-extrabold text-base text-slate-900 tracking-tight">Ngoro-Oro</h1>
                            <p className="text-[10px] text-slate-500 font-medium">Wisata Alam • Kuliner • UMKM</p>
                        </div>
                    </Link>

                    {/* Navigation Links */}
                    <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-600">
                        {navLinks.map((link) => {
                            const active = isLinkActive(link);

                            return (
                                <Link 
                                    key={link.name} 
                                    href={link.href} 
                                    onClick={() => setActiveHash(link.hash)}
                                    className={`transition pb-1 ${
                                        active 
                                            ? 'text-emerald-700 font-bold border-b-2 border-emerald-700' 
                                            : 'hover:text-emerald-700 text-slate-600'
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Right Actions */}
                    <div className="flex items-center gap-3">
                        <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-full transition" title="Cari">
                            <Search className="w-4 h-4" />
                        </button>

                        {/* Jika Sudah Login */}
                        {currentUser ? (
                            <div className="relative pl-2 border-l border-slate-200" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 transition cursor-pointer text-left"
                                >
                                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs border border-emerald-200 shadow-sm">
                                        {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                    <div className="hidden sm:block">
                                        <p className="text-xs font-bold text-slate-900 line-clamp-1">{currentUser.name}</p>
                                        <p className="text-[9px] text-emerald-700 font-semibold uppercase tracking-wider">{currentUser.role}</p>
                                    </div>
                                    <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Dropdown Menu */}
                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-fadeIn">
                                        <div className="px-4 py-2 border-b border-slate-100 sm:hidden">
                                            <p className="text-xs font-bold text-slate-900 line-clamp-1">{currentUser.name}</p>
                                            <p className="text-[9px] text-emerald-700 font-semibold uppercase">{currentUser.role}</p>
                                        </div>

                                        <div className="py-1">
                                            <Link
                                                href="/user/profile"
                                                onClick={() => setIsDropdownOpen(false)}
                                                className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition"
                                            >
                                                <UserCircle className="w-4 h-4 text-slate-400" />
                                                <span>Profil Saya</span>
                                            </Link>
                                            <Link
                                                href="/tickets/history"
                                                onClick={() => setIsDropdownOpen(false)}
                                                className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition"
                                            >
                                                <Ticket className="w-4 h-4 text-slate-400" />
                                                <span>Riwayat E-Ticket</span>
                                            </Link>
                                        </div>

                                        <div className="border-t border-slate-100 pt-1 mt-1">
                                            <button
                                                onClick={() => {
                                                    setIsDropdownOpen(false);
                                                    setIsLogoutModalOpen(true);
                                                }}
                                                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition cursor-pointer text-left"
                                            >
                                                <LogOut className="w-4 h-4 text-red-500" />
                                                <span>Keluar / Logout</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link 
                                href="/auth/users/login" 
                                className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-full shadow-md transition flex items-center gap-2 cursor-pointer"
                            >
                                <User className="w-3.5 h-3.5" />
                                <span>Masuk / Daftar</span>
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            {/* Modal Konfirmasi Keluar */}
            <LogoutModal 
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                onConfirm={handleConfirmLogout}
                loading={loggingOut}
            />
        </>
    );
}

export default function PublicNavbar() {
    return (
        <Suspense fallback={<div className="h-20 bg-white border-b border-slate-200 sticky top-0 z-40" />}>
            <NavbarContent />
        </Suspense>
    );
}