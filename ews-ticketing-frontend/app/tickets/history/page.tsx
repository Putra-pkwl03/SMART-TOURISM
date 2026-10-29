'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Ticket, ArrowLeft, Loader2 } from 'lucide-react';
import { apiClient } from '@/app/lib/axios';
import { toast } from 'sonner';

import PublicNavbar from '@/app/components/public/PublicNavbar';
import PublicFooter from '@/app/components/public/PublicFooter';
import TicketCard from '@/app/components/public/TicketCard';

interface TicketItem {
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

export default function TicketHistoryPage() {
    const router = useRouter();
    const [tickets, setTickets] = useState<TicketItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserTickets();
    }, []);

    const fetchUserTickets = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
            if (!token) {
                toast.error('Silakan login terlebih dahulu untuk melihat riwayat tiket.');
                router.push('/auth/users/login');
                return;
            }

            const res = await apiClient.get('/user/tickets');
            setTickets(res.data.data || res.data);
        } catch (error: any) {
            console.error(error);
            if (error.response?.status === 401) {
                toast.error('Sesi Anda telah berakhir, silakan login kembali.');
                router.push('/auth/users/login');
            } else {
                toast.error('Gagal memuat riwayat e-ticket.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <PublicNavbar />

            <main className="flex-1 max-w-7xl w-full mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <button 
                            onClick={() => router.push('/')}
                            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5 mb-2 transition cursor-pointer"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Kembali ke Beranda</span>
                        </button>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Riwayat E-Ticket & Pemesanan</h1>
                        <p className="text-xs text-slate-500 mt-1">Simpan dan tunjukkan e-ticket digital modern Anda kepada petugas loket wisata.</p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 text-slate-400 gap-2">
                        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                        <span className="text-xs font-semibold">Memuat e-ticket Anda...</span>
                    </div>
                ) : tickets.length === 0 ? (
                    <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 shadow-sm">
                        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                            <Ticket className="w-8 h-8" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-base font-extrabold text-slate-900">Belum Ada E-Ticket</h3>
                            <p className="text-xs text-slate-500 max-w-sm mx-auto">Anda belum pernah melakukan pemesanan tiket destinasi wisata. Yuk, jelajahi destinasi menarik sekarang!</p>
                        </div>
                        <button
                            onClick={() => router.push('/#destinasi')}
                            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer"
                        >
                            Pesan Destinasi Wisata
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {tickets.map((ticket) => (
                            <TicketCard key={ticket.id} ticket={ticket} />
                        ))}
                    </div>
                )}
            </main>

            <PublicFooter />
        </div>
    );
}