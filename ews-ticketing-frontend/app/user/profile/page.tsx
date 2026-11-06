'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { ArrowRight, CalendarDays, Mail, Ticket, UserRound } from 'lucide-react';
import { toast } from 'sonner';
import PublicNavbar from '@/app/components/public/PublicNavbar';
import PublicFooter from '@/app/components/public/PublicFooter';
import TicketCard from '@/app/components/public/TicketCard';
import { Skeleton, SkeletonTable } from '@/app/components/dashboard/shared/DashboardSkeleton';
import { apiClient } from '@/app/lib/axios';

interface AccountUser {
    name: string;
    email: string;
    role?: string;
}

interface AccountTicket {
    id: number;
    ticket_code: string;
    destination: {
        id: number;
        name: string;
        location: string;
        image_url?: string;
    };
    visitor_count: number;
    visit_date: string;
    total_price: number;
    payment_method: string;
    payment_status: string;
    ticket_status: string;
    created_at: string;
}

export default function UserProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<AccountUser | null>(null);
    const [tickets, setTickets] = useState<AccountTicket[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isActive = true;
        const timeoutId = window.setTimeout(async () => {
            const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
            const userValue = localStorage.getItem('user');

            if (!token || !userValue) {
                toast.error('Silakan masuk untuk melihat akun dan riwayat pesanan.');
                router.push('/auth/users/login');
                return;
            }

            try {
                const parsedUser: unknown = JSON.parse(userValue);
                if (
                    typeof parsedUser === 'object'
                    && parsedUser !== null
                    && 'name' in parsedUser
                    && 'email' in parsedUser
                    && typeof parsedUser.name === 'string'
                    && typeof parsedUser.email === 'string'
                ) {
                    if (isActive) setUser({
                        name: parsedUser.name,
                        email: parsedUser.email,
                        role: 'role' in parsedUser && typeof parsedUser.role === 'string' ? parsedUser.role : undefined,
                    });
                }

                const response = await apiClient.get<{ data?: AccountTicket[] } | AccountTicket[]>('/user/tickets');
                if (!isActive) return;
                const data = response.data;
                setTickets(Array.isArray(data) ? data : data.data ?? []);
            } catch (requestError: unknown) {
                if (!isActive) return;
                console.error('Gagal memuat akun dan riwayat tiket:', requestError);
                if (axios.isAxiosError(requestError) && requestError.response?.status === 401) {
                    toast.error('Sesi Anda telah berakhir. Silakan masuk kembali.');
                    router.push('/auth/users/login');
                } else {
                    setError('Riwayat tiket sementara tidak dapat dimuat.');
                }
            } finally {
                if (isActive) setLoading(false);
            }
        }, 0);

        return () => {
            isActive = false;
            window.clearTimeout(timeoutId);
        };
    }, [router]);

    const pendingCount = tickets.filter((ticket) => ticket.payment_status === 'pending').length;
    const approvedCount = tickets.filter((ticket) => ticket.payment_status === 'paid').length;

    return (
        <div className="flex min-h-screen flex-col bg-slate-50 text-slate-800">
            <PublicNavbar />
            <main className="mx-auto w-full max-w-7xl flex-1 space-y-8 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
                <header>
                    <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-emerald-700">Ruang Wisatawan</span>
                    <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Akun & Riwayat Pesanan</h1>
                    <p className="mt-2 text-sm text-slate-500">Informasi akun dan tiket wisata Anda dalam satu tempat.</p>
                </header>

                <section className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
                    <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-700 p-6 text-white sm:p-8">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-2xl font-black backdrop-blur">
                                {user?.name?.trim().charAt(0).toUpperCase() || <UserRound className="h-7 w-7" />}
                            </div>
                            <div className="min-w-0 flex-1">
                                {loading && !user ? (
                                    <div className="space-y-3">
                                        <Skeleton className="h-6 w-52 bg-white/20" />
                                        <Skeleton className="h-4 w-64 max-w-full bg-white/15" />
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-xs font-semibold text-emerald-100">Selamat datang</p>
                                        <h2 className="mt-1 truncate text-xl font-extrabold sm:text-2xl">{user?.name || 'Wisatawan'}</h2>
                                        <p className="mt-1 flex items-center gap-2 text-sm text-emerald-50/90">
                                            <Mail className="h-4 w-4 shrink-0" />
                                            <span className="truncate">{user?.email || 'Email tidak tersedia'}</span>
                                        </p>
                                    </>
                                )}
                            </div>
                            {!loading && (
                                <span className="w-fit rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-50">
                                    {user?.role === 'visitor' ? 'Wisatawan' : user?.role || 'Pengguna'}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 divide-y divide-slate-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                        {[
                            { label: 'Total Pemesanan', value: tickets.length, icon: Ticket },
                            { label: 'Menunggu Validasi', value: pendingCount, icon: CalendarDays },
                            { label: 'Pembayaran Disetujui', value: approvedCount, icon: UserRound },
                        ].map(({ label, value, icon: Icon }) => (
                            <div key={label} className="flex items-center gap-3 p-5 sm:p-6">
                                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                                    <Icon className="h-5 w-5" />
                                </span>
                                <span>
                                    <span className="block text-xs font-semibold text-slate-500">{label}</span>
                                    {loading ? <Skeleton className="mt-2 h-5 w-12" /> : <span className="mt-1 block text-lg font-black text-slate-900">{value}</span>}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h2 className="text-lg font-extrabold text-slate-900">Pesanan Terbaru</h2>
                            <p className="mt-1 text-xs text-slate-500">Tiket dan status pemesanan terakhir Anda.</p>
                        </div>
                        <Link href="/tickets/history" className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-100 bg-white px-4 py-2 text-xs font-bold text-emerald-800 transition hover:bg-emerald-50">
                            Semua Riwayat Tiket
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>

                    {loading ? (
                        <SkeletonTable columns={4} rows={2} />
                    ) : error ? (
                        <div role="alert" className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">{error}</div>
                    ) : tickets.length ? (
                        <div className="space-y-4">
                            {tickets.slice(0, 2).map((ticket) => <TicketCard key={ticket.id} ticket={ticket} />)}
                        </div>
                    ) : (
                        <div className="rounded-3xl border border-slate-100 bg-white p-10 text-center shadow-sm">
                            <Ticket className="mx-auto h-10 w-10 text-slate-300" />
                            <h3 className="mt-3 text-base font-extrabold text-slate-900">Belum Ada Pesanan</h3>
                            <p className="mt-1 text-sm text-slate-500">Pilih destinasi wisata dan mulai rencanakan perjalanan Anda.</p>
                            <Link href="/#destinasi" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-800">
                                Jelajahi Destinasi <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    )}
                </section>
            </main>
            <PublicFooter />
        </div>
    );
}
