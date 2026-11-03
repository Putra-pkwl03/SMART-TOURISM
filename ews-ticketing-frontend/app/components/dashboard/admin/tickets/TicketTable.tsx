'use client';

import { useState } from 'react';
import { Eye, CheckCircle2, XCircle, Loader2, MapPin, Calendar, ChevronDown, ChevronUp, QrCode } from 'lucide-react';

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
        image_url?: string;
        images?: { image_url: string }[];
    };
}

interface TicketTableProps {
    tickets: TicketItem[];
    loading: boolean;
    backendUrl: string;
    onViewProof: (url: string) => void;
    onApprove: (id: number) => void;
    onRejectClick: (id: number) => void;
}

export default function TicketTable({
    tickets,
    loading,
    backendUrl,
    onViewProof,
    onApprove,
    onRejectClick,
}: TicketTableProps) {
    const [expandedRows, setExpandedRows] = useState<number[]>([]);

    const toggleRow = (id: number) => {
        if (expandedRows.includes(id)) {
            setExpandedRows(expandedRows.filter(rowId => rowId !== id));
        } else {
            setExpandedRows([...expandedRows, id]);
        }
    };

    if (loading) {
        return (
            <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-slate-100 shadow-sm p-16 flex flex-col items-center justify-center text-slate-400 gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
                <span className="text-xs font-medium">Memuat data tiket...</span>
            </div>
        );
    }

    if (tickets.length === 0) {
        return (
            <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-slate-100 shadow-sm p-16 text-center text-slate-400 text-xs font-medium">
                Belum ada data pemesanan tiket masuk.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                        <thead>
                            <tr className="bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                                <th className="p-4">KODE TIKET & DESTINASI</th>
                                <th className="p-4">PENGUNJUNG</th>
                                <th className="p-4">TOTAL HARGA</th>
                                <th className="p-4">METODE & BUKTI BAYAR</th>
                                <th className="p-4">STATUS PEMBAYARAN</th>
                                <th className="p-4">STATUS TIKET</th>
                                <th className="p-4 text-center">AKSI</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                            {tickets.map((ticket) => {
                                const isExpanded = expandedRows.includes(ticket.id);
                                const proofUrl = ticket.payment_proof 
                                    ? (ticket.payment_proof.startsWith('http') ? ticket.payment_proof : `${backendUrl}${ticket.payment_proof}`)
                                    : null;

                                // AMBIL FOTO LANGSUNG DARI DESTINASI (image_url atau galeri pertama)
                                let rawDestImg = ticket.destination?.image_url;
                                if (!rawDestImg && ticket.destination?.images && ticket.destination.images.length > 0) {
                                    rawDestImg = ticket.destination.images[0].image_url;
                                }

                                const destImage = rawDestImg 
                                    ? (rawDestImg.startsWith('http') ? rawDestImg : `${backendUrl}${rawDestImg}`)
                                    : 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=200&q=80';

                                return (
                                    <>
                                        <tr key={ticket.id} className="hover:bg-slate-50/50 transition">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
                                                        <img src={destImage} alt="Destinasi" className="w-full h-full object-cover" />
                                                    </div>
                                                    <div>
                                                        <span className="font-extrabold text-slate-900 block font-mono">{ticket.ticket_code}</span>
                                                        <span className="text-xs font-semibold text-emerald-700 block">{ticket.destination?.name || 'Destinasi Wisata'}</span>
                                                        <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                                                            <Calendar className="w-3 h-3" /> {ticket.created_at ? new Date(ticket.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) : '-'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="p-4 font-medium">
                                                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                                                    <span>👥</span> {ticket.visitor_count} Orang
                                                </div>
                                                <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md inline-block mt-1">
                                                    Dewasa
                                                </span>
                                            </td>

                                            <td className="p-4 font-extrabold text-emerald-700 text-sm">
                                                Rp {ticket.total_price?.toLocaleString('id-ID')}
                                            </td>

                                            <td className="p-4">
                                                <span className="uppercase font-bold text-[10px] px-2 py-1 bg-slate-100 rounded-md text-slate-600 block w-max mb-1">
                                                    {ticket.payment_method || 'QRIS'}
                                                </span>
                                                {proofUrl ? (
                                                    <button 
                                                        onClick={() => onViewProof(proofUrl)}
                                                        className="text-emerald-600 hover:underline font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                                                    >
                                                        <Eye className="w-3.5 h-3.5" /> Lihat Bukti ↗
                                                    </button>
                                                ) : (
                                                    <span className="text-[10px] text-slate-400">Tanpa Bukti</span>
                                                )}
                                            </td>

                                            <td className="p-4">
                                                <span className={`px-3 py-1 rounded-full font-bold text-[10px] uppercase inline-flex items-center gap-1 ${
                                                    ticket.payment_status === 'paid' 
                                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                                                        : ticket.payment_status === 'pending'
                                                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                                        : 'bg-red-50 text-red-700 border border-red-200'
                                                }`}>
                                                    <CheckCircle2 className="w-3 h-3" /> {ticket.payment_status === 'paid' ? 'Lunas' : ticket.payment_status}
                                                </span>
                                                {ticket.payment_status === 'cancelled' && ticket.rejection_reason && (
                                                    <p className="text-[10px] text-red-500 mt-1 italic max-w-xs">
                                                        Ket: {ticket.rejection_reason}
                                                    </p>
                                                )}
                                            </td>

                                            <td className="p-4">
                                                <span className={`px-3 py-1 rounded-full font-bold text-[10px] uppercase inline-flex items-center gap-1 ${
                                                    ticket.ticket_status === 'valid' 
                                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                                                        : ticket.ticket_status === 'used'
                                                        ? 'bg-slate-100 text-slate-600 border border-slate-200'
                                                        : 'bg-red-50 text-red-700 border border-red-200'
                                                }`}>
                                                    🎫 {ticket.ticket_status === 'valid' ? 'Aktif' : ticket.ticket_status}
                                                </span>
                                            </td>

                                            <td className="p-4 text-center">
                                                {ticket.payment_status === 'pending' ? (
                                                    <div className="flex items-center justify-center gap-1.5">
                                                        <button
                                                            onClick={() => onApprove(ticket.id)}
                                                            className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-bold shadow-sm transition inline-flex items-center gap-1 cursor-pointer"
                                                        >
                                                            <CheckCircle2 className="w-3.5 h-3.5" /> Setujui
                                                        </button>
                                                        <button
                                                            onClick={() => onRejectClick(ticket.id)}
                                                            className="px-2.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-[10px] font-bold shadow-sm transition inline-flex items-center gap-1 cursor-pointer"
                                                        >
                                                            <XCircle className="w-3.5 h-3.5" /> Tolak
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => toggleRow(ticket.id)}
                                                        className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-sm inline-flex items-center gap-1.5 transition cursor-pointer"
                                                    >
                                                        <Eye className="w-3.5 h-3.5 text-emerald-600" />
                                                        <span>Detail</span>
                                                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
                                                    </button>
                                                )}
                                            </td>
                                        </tr>

                                        {/* Baris Accordion Detail */}
                                        {isExpanded && (
                                            <tr className="bg-emerald-50/40 border-y border-emerald-100/60">
                                                <td colSpan={7} className="p-5">
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                                                        <div className="space-y-1.5">
                                                            <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
                                                                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                                                                <span>Detail Kunjungan</span>
                                                            </div>
                                                            <div className="text-[11px] text-slate-600 space-y-2.5 pl-5">
                                                                <p><span className="text-slate-400">Destinasi</span> : <strong className="text-slate-800">{ticket.destination?.name}</strong></p>
                                                                <p><span className="text-slate-400">Tanggal</span> : <strong className="text-slate-800">{ticket.created_at ? new Date(ticket.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) : '-'}</strong></p>
                                                                <p><span className="text-slate-400">Kode Tiket</span> : <strong className="text-slate-800 font-mono">{ticket.ticket_code}</strong></p>
                                                            </div>
                                                        </div>

                                                        <div className="space-y-1.5">
                                                            <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
                                                                <QrCode className="w-3.5 h-3.5 text-emerald-600" />
                                                                <span>Metode Pembayaran</span>
                                                            </div>
                                                            <div className="pl-5 space-y-1">
                                                                <p className="text-[11px] font-semibold text-slate-700">{ticket.payment_method ? ticket.payment_method.toUpperCase() : 'QRIS'}</p>
                                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-100/70 text-emerald-800 rounded-md text-[10px] font-bold border border-emerald-200">
                                                                    ✓ Terverifikasi
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center justify-between gap-4 bg-white/60 p-3 rounded-2xl border border-emerald-100">
                                                            <div className="space-y-1">
                                                                <span className="text-[11px] font-bold text-slate-900 block flex items-center gap-1">
                                                                    <span>💬</span> Catatan
                                                                </span>
                                                                <p className="text-[11px] text-slate-600 italic">
                                                                    Terima kasih telah berkunjung! 🌿
                                                                </p>
                                                            </div>
                                                            <div className="w-20 h-16 rounded-xl overflow-hidden shadow-sm border border-slate-200 flex-shrink-0">
                                                                <img src={destImage} alt="Preview Lokasi" className="w-full h-full object-cover" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between px-2 gap-4 text-xs text-slate-500">
                <span>Menampilkan {tickets.length} dari {tickets.length} data</span>
                <div className="flex items-center gap-1.5">
                    <button className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 transition shadow-sm disabled:opacity-50" disabled>&lt;</button>
                    <button className="px-3.5 py-2 rounded-xl bg-emerald-600 font-bold text-white shadow-sm">1</button>
                    <button className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 transition shadow-sm disabled:opacity-50" disabled>&gt;</button>
                </div>
            </div>
        </div>
    );
}