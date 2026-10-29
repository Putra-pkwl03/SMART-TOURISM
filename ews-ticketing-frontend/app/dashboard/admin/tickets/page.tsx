'use client';

import { useState, useEffect } from 'react';
import { Ticket, Search, CheckCircle2, XCircle, Eye, Loader2, Calendar, ShieldCheck, MapPin } from 'lucide-react';
import { apiClient } from '@/app/lib/axios';
import { toast } from 'sonner';

interface TicketItem {
    id: number;
    ticket_code: string;
    visitor_count: number;
    total_price: number;
    payment_status: 'pending' | 'paid' | 'cancelled';
    ticket_status: 'valid' | 'used' | 'expired';
    payment_method?: string;
    payment_proof?: string;
    rejection_reason?: string;
    created_at: string;
    destination?: {
        name: string;
        location: string;
    };
    user?: {
        name: string;
        email: string;
    };
}

export default function AdminTicketsPage() {
    const [tickets, setTickets] = useState<TicketItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    
    // State untuk Modal Lihat Bukti Bayar
    const [selectedProof, setSelectedProof] = useState<string | null>(null);
    const [isProofModalOpen, setIsProofModalOpen] = useState(false);

    // State untuk Modal Tolak Pembayaran
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');

    const BACKEND_URL = 'http://127.0.0.1:8000';

    const fetchTickets = async () => {
        try {
            setLoading(true);
            const res = await apiClient.get('/tickets');
            setTickets(res.data);
        } catch (error) {
            toast.error('Gagal memuat data tiket dari server.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    // Fungsi untuk menyetujui pembayaran
    const handleApprovePayment = async (id: number) => {
        try {
            await apiClient.patch(`/tickets/${id}/approve`);
            toast.success('Pembayaran tiket berhasil diverifikasi dan disetujui!');
            fetchTickets();
        } catch (error) {
            toast.error('Gagal memverifikasi pembayaran.');
        }
    };

    // Fungsi untuk menolak pembayaran dengan alasan
    const handleRejectPayment = async () => {
        if (!selectedTicketId || !rejectionReason.trim()) {
            toast.error('Harap masukkan alasan penolakan terlebih dahulu.');
            return;
        }

        try {
            await apiClient.patch(`/tickets/${selectedTicketId}/reject`, {
                rejection_reason: rejectionReason
            });
            toast.success('Pembayaran tiket berhasil ditolak.');
            setIsRejectModalOpen(false);
            setRejectionReason('');
            setSelectedTicketId(null);
            fetchTickets();
        } catch (error) {
            toast.error('Gagal menolak pembayaran.');
        }
    };

    const filteredTickets = tickets.filter(ticket => 
        ticket.ticket_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.destination?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header Title */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">E-Ticketing & Bookings</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Kelola rekapitulasi kunjungan harian, verifikasi bukti pembayaran manual, dan pantau status tiket secara real-time.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200">
                        Total: {tickets.length} Tiket
                    </span>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input 
                        type="text"
                        placeholder="Cari berdasarkan kode tiket atau nama destinasi..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:bg-white focus:ring-2 focus:ring-emerald-600 outline-none transition"
                    />
                </div>
            </div>

            {/* Tabel Data Tiket */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-2">
                        <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
                        <span className="text-xs">Memuat data tiket...</span>
                    </div>
                ) : filteredTickets.length === 0 ? (
                    <div className="text-center py-16 text-slate-400 text-xs">
                        Belum ada data pemesanan tiket masuk.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                                    <th className="p-4">Kode Tiket & Destinasi</th>
                                    <th className="p-4">Pengunjung</th>
                                    <th className="p-4">Total Harga</th>
                                    <th className="p-4">Metode & Bukti Bayar</th>
                                    <th className="p-4">Status Pembayaran</th>
                                    <th className="p-4">Status Tiket</th>
                                    <th className="p-4 text-center">Aksi Verifikasi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-700">
                                {filteredTickets.map((ticket) => {
                                    const proofUrl = ticket.payment_proof 
                                        ? (ticket.payment_proof.startsWith('http') ? ticket.payment_proof : `${BACKEND_URL}${ticket.payment_proof}`)
                                        : null;

                                    return (
                                        <tr key={ticket.id} className="hover:bg-slate-50/50 transition">
                                            {/* Kode & Destinasi */}
                                            <td className="p-4">
                                                <span className="font-extrabold text-slate-900 block font-mono">{ticket.ticket_code}</span>
                                                <span className="text-xs font-semibold text-emerald-700 block">{ticket.destination?.name}</span>
                                                <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                                                    <MapPin className="w-3 h-3" /> {ticket.destination?.location}
                                                </span>
                                            </td>

                                            {/* Jumlah Pengunjung */}
                                            <td className="p-4 font-medium">
                                                {ticket.visitor_count} Orang
                                            </td>

                                            {/* Total Harga */}
                                            <td className="p-4 font-extrabold text-emerald-700">
                                                Rp {ticket.total_price?.toLocaleString('id-ID')}
                                            </td>

                                            {/* Metode & Bukti Bayar */}
                                            <td className="p-4">
                                                <span className="uppercase font-bold text-[10px] px-2 py-1 bg-slate-100 rounded-md text-slate-600 block w-max mb-1">
                                                    {ticket.payment_method || 'QRIS'}
                                                </span>
                                                {proofUrl ? (
                                                    <button 
                                                        onClick={() => {
                                                            setSelectedProof(proofUrl);
                                                            setIsProofModalOpen(true);
                                                        }}
                                                        className="text-emerald-600 hover:underline font-bold text-[11px] flex items-center gap-1"
                                                    >
                                                        <Eye className="w-3.5 h-3.5" /> Lihat Bukti
                                                    </button>
                                                ) : (
                                                    <span className="text-[10px] text-slate-400">Tanpa Bukti</span>
                                                )}
                                            </td>

                                            {/* Status Pembayaran */}
                                            <td className="p-4">
                                                <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] uppercase inline-block ${
                                                    ticket.payment_status === 'paid' 
                                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                                                        : ticket.payment_status === 'pending'
                                                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                                        : 'bg-red-50 text-red-700 border border-red-200'
                                                }`}>
                                                    {ticket.payment_status}
                                                </span>
                                                {ticket.payment_status === 'cancelled' && ticket.rejection_reason && (
                                                    <p className="text-[10px] text-red-500 mt-1 italic max-w-xs">
                                                        Ket: {ticket.rejection_reason}
                                                    </p>
                                                )}
                                            </td>

                                            {/* Status Tiket */}
                                            <td className="p-4">
                                                <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] uppercase inline-block ${
                                                    ticket.ticket_status === 'valid' 
                                                        ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                                                        : ticket.ticket_status === 'used'
                                                        ? 'bg-slate-100 text-slate-600 border border-slate-200'
                                                        : 'bg-red-50 text-red-700 border border-red-200'
                                                }`}>
                                                    {ticket.ticket_status}
                                                </span>
                                            </td>

                                            {/* Aksi Verifikasi */}
                                            <td className="p-4 text-center">
                                                {ticket.payment_status === 'pending' ? (
                                                    <div className="flex items-center justify-center gap-1.5">
                                                        <button
                                                            onClick={() => handleApprovePayment(ticket.id)}
                                                            className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-bold shadow-sm transition inline-flex items-center gap-1"
                                                        >
                                                            <CheckCircle2 className="w-3.5 h-3.5" /> Setujui
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setSelectedTicketId(ticket.id);
                                                                setIsRejectModalOpen(true);
                                                            }}
                                                            className="px-2.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-[10px] font-bold shadow-sm transition inline-flex items-center gap-1"
                                                        >
                                                            <XCircle className="w-3.5 h-3.5" /> Tolak
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-[11px] text-slate-400 font-medium">Terverifikasi</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* MODAL PREVIEW BUKTI TRANSFER */}
            {isProofModalOpen && selectedProof && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold text-slate-900">Bukti Pembayaran Wisatawan</h3>
                            <button 
                                onClick={() => setIsProofModalOpen(false)}
                                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition"
                            >
                                <XCircle className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="w-full h-80 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center">
                            <img src={selectedProof} alt="Bukti Transfer" className="w-full h-full object-contain" />
                        </div>

                        <button
                            onClick={() => setIsProofModalOpen(false)}
                            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            )}

            {/* MODAL INPUT ALASAN PENOLAKAN */}
            {isRejectModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold text-slate-900">Alasan Penolakan Pembayaran</h3>
                            <button 
                                onClick={() => setIsRejectModalOpen(false)}
                                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition"
                            >
                                <XCircle className="w-5 h-5" />
                            </button>
                        </div>

                        <textarea 
                            rows={3}
                            placeholder="Contoh: Bukti transfer tidak valid / Nominal pembayaran tidak sesuai..."
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:bg-white focus:ring-2 focus:ring-red-500 outline-none transition resize-none"
                        />

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setIsRejectModalOpen(false)}
                                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleRejectPayment}
                                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition"
                            >
                                Konfirmasi Tolak
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}