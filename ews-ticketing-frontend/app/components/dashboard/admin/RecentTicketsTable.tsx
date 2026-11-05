import Link from 'next/link';
import { Ticket } from 'lucide-react';
import type { RecentDashboardTicket } from '@/app/lib/admin-dashboard';

interface RecentTicketsTableProps {
    tickets: RecentDashboardTicket[];
    loading: boolean;
}

const formatRupiah = (value: number) =>
    `Rp ${new Intl.NumberFormat('id-ID').format(value)}`;

const statusStyles: Record<string, string> = {
    valid: 'bg-emerald-50 text-emerald-700',
    used: 'bg-blue-50 text-blue-700',
    expired: 'bg-slate-100 text-slate-600',
    pending: 'bg-amber-50 text-amber-700',
    cancelled: 'bg-rose-50 text-rose-700',
};

const statusLabels: Record<string, string> = {
    valid: 'Valid',
    used: 'Digunakan',
    expired: 'Kedaluwarsa',
    pending: 'Menunggu',
    cancelled: 'Dibatalkan',
};

export default function RecentTicketsTable({ tickets, loading }: RecentTicketsTableProps) {
    return (
        <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 p-4 sm:px-5">
                <div>
                    <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                        <Ticket className="h-4 w-4 text-emerald-600" />
                        Pemesanan E-Ticketing Terbaru
                    </h3>
                    <p className="mt-1 text-[11px] text-slate-500">Transaksi tiket wisata terbaru</p>
                </div>
                <Link href="/dashboard/admin/tickets" className="shrink-0 text-[11px] font-semibold text-blue-600 hover:underline">
                    Lihat Semua →
                </Link>
            </div>

            {loading ? (
                <div className="p-8 text-center text-xs text-slate-400">Memuat transaksi tiket...</div>
            ) : tickets.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">Belum ada transaksi tiket.</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[680px] text-left text-xs">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                                <th className="px-4 py-3">Kode Tiket</th>
                                <th className="px-4 py-3">Wisatawan</th>
                                <th className="px-4 py-3">Jumlah</th>
                                <th className="px-4 py-3">Total Harga</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Tanggal</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                            {tickets.map((ticket) => (
                                <tr key={ticket.id} className="transition hover:bg-slate-50/70">
                                    <td className="whitespace-nowrap px-4 py-3 font-mono font-bold text-slate-900">{ticket.code}</td>
                                    <td className="px-4 py-3 font-medium">{ticket.visitor}</td>
                                    <td className="whitespace-nowrap px-4 py-3">{ticket.count} Orang</td>
                                    <td className="whitespace-nowrap px-4 py-3 font-semibold">{formatRupiah(ticket.total)}</td>
                                    <td className="px-4 py-3">
                                        <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase ${statusStyles[ticket.status] ?? statusStyles.pending}`}>
                                            {statusLabels[ticket.status] ?? ticket.status}
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                                        {new Intl.DateTimeFormat('id-ID', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        }).format(new Date(ticket.created_at))}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}
