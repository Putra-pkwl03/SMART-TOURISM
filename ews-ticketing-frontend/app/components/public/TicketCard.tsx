'use client';

import { useState, useRef } from 'react';
import { Calendar, Users, Download, Clock, CheckCircle2, MapPin, ShieldCheck, Sparkles, QrCode, X } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { toast } from 'sonner';
import { getBackendUrl } from '@/app/lib/backend-url';

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

interface TicketCardProps {
    ticket: TicketItem;
}

export default function TicketCard({ ticket }: TicketCardProps) {
    const ticketRef = useRef<HTMLDivElement>(null);
    const [showScanModal, setShowScanModal] = useState(false); // State untuk modal scan kilat di layar

    const isPending = ticket.payment_status === 'pending';
    const isUsed = ticket.ticket_status === 'used';

    const rawImageUrl = ticket.destination?.image_url;
    const backendBaseUrl = getBackendUrl();
    
    const bgImageUrl = rawImageUrl 
        ? (rawImageUrl.startsWith('http') ? rawImageUrl : `${backendBaseUrl}${rawImageUrl.startsWith('/') ? '' : '/'}${rawImageUrl}`)
        : null;

    const handleDownloadImage = () => {
        try {
            toast.loading('Mempersiapkan cetak e-ticket...', { id: 'downloading' });
            window.print();
            toast.success('Silakan pilih "Save as PDF" pada jendela cetak.', { id: 'downloading' });
        } catch (error) {
            console.error('Error saat mencetak tiket:', error);
            toast.error('Gagal mencetak e-ticket.', { id: 'downloading' });
        }
    };

    return (
        <>
            {/* TAMPILAN UTAMA DI WEB (Desain Normal / Lebar) */}
            <div className="w-full flex justify-center py-3">
                <div 
                    ref={ticketRef} 
                    id="ticket-printable-card"
                    className="w-full max-w-7xl bg-slate-900 rounded-3xl print:rounded-none border border-slate-200 shadow-xl overflow-hidden flex flex-col md:flex-row relative group transition hover:shadow-2xl print:shadow-none print:border-0 print:m-0 print:max-w-xl print:flex-col print:items-center print:text-center print:bg-slate-900"
                >
                    {/* Latar Belakang Gambar Asli */}
                    {bgImageUrl && (
                        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                            <img 
                                src={bgImageUrl} 
                                alt="Background Destinasi" 
                                className="w-full h-full object-cover opacity-60 print:opacity-30"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/70 to-slate-900/90 print:bg-gradient-to-b print:from-slate-950/90 print:via-slate-900/95 print:to-slate-950/90" />
                        </div>
                    )}

                    {/* Aksen Hiasan Kiri (Sembunyi saat print) */}
                    <div className={`h-3.5 w-full md:h-auto md:w-3.5 z-10 flex-shrink-0 print:hidden ${
                        isPending ? 'bg-amber-500' : isUsed ? 'bg-slate-400' : 'bg-emerald-600'
                    }`} />

                    {/* Bagian Utama Tiket (Kiri pada Web, Berubah saat Print) */}
                    <div className="p-4 sm:p-8 flex-1 space-y-4 sm:space-y-6 relative z-10 print:w-full print:space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3 print:justify-center">
                            <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-200 shadow-sm print:bg-slate-800 print:border-slate-700">
                                <Sparkles className="w-3.5 h-3.5 text-emerald-700 print:text-emerald-400" />
                                <span className="break-all text-xs font-mono font-extrabold text-slate-900 tracking-wider sm:break-normal print:text-white">
                                    {ticket.ticket_code}
                                </span>
                            </div>

                            {isPending ? (
                                <span className="ml-auto inline-flex max-w-full items-center justify-end gap-1.5 px-3 py-1 rounded-full bg-amber-50/90 backdrop-blur-md text-amber-700 border border-amber-200 text-right text-xs font-bold leading-tight shadow-sm sm:ml-0 sm:justify-start sm:text-left">
                                    <Clock className="w-3.5 h-3.5" /> Menunggu Validasi Admin
                                </span>
                            ) : isUsed ? (
                                <span className="ml-auto inline-flex max-w-full items-center justify-end gap-1.5 px-3 py-1 rounded-full bg-slate-100/90 backdrop-blur-md text-slate-600 border border-slate-300 text-right text-xs font-bold leading-tight shadow-sm sm:ml-0 sm:justify-start sm:text-left">
                                    <CheckCircle2 className="w-3.5 h-3.5" /> Telah Digunakan
                                </span>
                            ) : (
                                <span className="ml-auto inline-flex max-w-full items-center justify-end gap-1.5 px-3 py-1 rounded-full bg-emerald-50/90 backdrop-blur-md text-emerald-700 border border-emerald-200 text-right text-xs font-bold leading-tight shadow-sm sm:ml-0 sm:justify-start sm:text-left">
                                    <ShieldCheck className="w-3.5 h-3.5" /> Disetujui
                                </span>
                            )}
                        </div>

                        <div className="min-w-0">
                            <h3 className="wrap-break-word text-xl sm:text-2xl font-black text-slate-900 tracking-tight drop-shadow-md print:text-white">
                                {ticket.destination?.name || 'Destinasi Wisata'}
                            </h3>
                            <p className="wrap-break-word min-w-0 text-xs text-slate-800 flex items-start sm:items-center gap-1 mt-1 font-bold drop-shadow-sm print:text-slate-300 print:justify-center">
                                <MapPin className="w-3.5 h-3.5 text-emerald-600 print:text-emerald-400 flex-shrink-0" />
                                <span className="min-w-0">{ticket.destination?.location || 'Ngoro-Oro, Patuk, Gunungkidul'}</span>
                            </p>
                        </div>

                        {/* Kotak Barcode Khusus Muncul Saat Dicetak/Print */}
                        <div className="hidden print:flex flex-col items-center justify-center bg-white p-4 rounded-3xl shadow-xl border-4 border-emerald-500/20 my-4 mx-auto w-fit">
                            <QRCodeCanvas 
                                value={ticket.ticket_code} 
                                size={150}
                                level="H"
                                includeMargin={false}
                            />
                            <span className="text-xs font-mono font-black text-slate-900 mt-2 tracking-wider">
                                {ticket.ticket_code}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 pt-4 border-t border-dashed border-slate-400 text-xs print:grid-cols-2">
                            <div className="bg-white/90 backdrop-blur-md p-3 rounded-2xl border border-slate-200 shadow-sm print:bg-slate-800/80 print:border-slate-700 print:text-left">
                                <span className="text-slate-600 print:text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Tanggal Kunjungan</span>
                                <span className="font-extrabold text-slate-900 print:text-white flex items-center gap-1.5 mt-1">
                                    <Calendar className="w-4 h-4 text-emerald-600 print:text-emerald-400" /> {ticket.visit_date}
                                </span>
                            </div>
                            <div className="bg-white/90 backdrop-blur-md p-3 rounded-2xl border border-slate-200 shadow-sm print:bg-slate-800/80 print:border-slate-700 print:text-left">
                                <span className="text-slate-600 print:text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Jumlah Pengunjung</span>
                                <span className="font-extrabold text-slate-900 print:text-white flex items-center gap-1.5 mt-1">
                                    <Users className="w-4 h-4 text-emerald-600 print:text-emerald-400" /> {ticket.visitor_count} Orang
                                </span>
                            </div>
                            <div className="bg-emerald-50/95 backdrop-blur-md p-3 rounded-2xl border border-emerald-200 col-span-2 sm:col-span-1 shadow-sm print:bg-slate-800/80 print:border-slate-700 print:text-left">
                                <span className="text-emerald-800 print:text-emerald-400 block text-[10px] uppercase font-bold tracking-wider">Total Pembayaran</span>
                                <span className="font-black text-emerald-700 print:text-white text-sm mt-1 block">
                                    Rp {Number(ticket.total_price).toLocaleString('id-ID')}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div aria-hidden="true" className="relative z-20 h-0 w-full shrink-0 border-t border-dashed border-slate-400/70 md:h-auto md:w-0 md:self-stretch md:border-t-0 md:border-l print:hidden">
                        <span className="absolute left-0 top-0 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-50 md:hidden" />
                        <span className="absolute right-0 top-0 h-6 w-6 translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-50 md:hidden" />
                        <span className="absolute left-0 top-1/2 hidden h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-50 md:block" />
                    </div>

                    {/* Bagian QR Code Sisi Kanan (Tampil di Web, Disembunyikan saat Print) */}
                    <div className="bg-slate-900/95 backdrop-blur-md p-4 md:p-8 grid grid-cols-[7rem_minmax(0,1fr)] items-center gap-x-4 gap-y-3 text-white relative w-full md:w-72 md:flex md:flex-col md:justify-center md:text-center z-10 print:hidden flex-shrink-0">
                        <div className="col-span-2 grid grid-cols-[7rem_minmax(0,1fr)] items-center gap-4 w-full md:flex md:flex-col md:space-y-3 md:my-auto">
                            <div className="w-28 h-28 bg-white p-2.5 rounded-2xl shadow-lg flex items-center justify-center mx-auto">
                                <QRCodeCanvas 
                                    value={ticket.ticket_code} 
                                    size={96}
                                    level="H"
                                    includeMargin={false}
                                />
                            </div>

                            <div className="space-y-0.5 text-left md:text-center">
                                <span className="text-[11px] font-bold tracking-widest uppercase text-emerald-300 block">E-Pass Resmi</span>
                                <span className="text-[10px] text-slate-300 font-medium block">Tunjukkan ke petugas gerbang</span>
                            </div>
                        </div>

                        {/* Tombol Aksi di Web */}
                        <div className="col-span-2 w-full space-y-2 md:mt-6">
                            {/* Tombol Lihat Barcode Full untuk Scan */}
                            <button
                                type="button"
                                disabled={isPending}
                                onClick={() => setShowScanModal(true)}
                                className="w-full py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white cursor-pointer shadow-md shadow-blue-600/20"
                            >
                                <QrCode className="w-4 h-4" />
                                <span>Tunjukkan untuk Scan</span>
                            </button>

                            {/* Tombol Unduh / Cetak */}
                            <button
                                type="button"
                                disabled={isPending}
                                onClick={handleDownloadImage}
                                className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-lg ${
                                    isPending 
                                        ? 'bg-slate-700 text-slate-400 cursor-not-allowed shadow-none' 
                                        : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black cursor-pointer shadow-emerald-500/30'
                                }`}
                            >
                                <Download className="w-4 h-4" />
                                <span>Unduh / Cetak E-Ticket</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL POPUP KHUSUS UNTUK DITUNJUKKAN KE PETUGAS LOKET TANPA DOWNLOAD */}
            {showScanModal && (
                <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 text-white shadow-2xl relative flex flex-col items-center text-center space-y-5">
                        <button 
                            onClick={() => setShowScanModal(false)}
                            className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="space-y-1">
                            <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">E-Pass Siap Scan</span>
                            <h3 className="text-lg font-black">{ticket.destination?.name}</h3>
                            <p className="text-[11px] text-slate-400">Tunjukkan QR Code ini langsung ke petugas loket.</p>
                        </div>

                        {/* Kotak QR Code Besar & Terang agar Mudah Di-scan dari Jauh */}
                        <div className="bg-white p-4 rounded-3xl shadow-2xl border-4 border-emerald-500/30 flex flex-col items-center space-y-2">
                            <QRCodeCanvas 
                                value={ticket.ticket_code} 
                                size={180}
                                level="H"
                                includeMargin={false}
                            />
                            <div className="flex items-center gap-1 bg-slate-100 px-3 py-1 rounded-xl border border-slate-200 mt-1">
                                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-xs font-mono font-black text-slate-900 tracking-wider">
                                    {ticket.ticket_code}
                                </span>
                            </div>
                        </div>

                        <div className="w-full text-xs text-slate-400 bg-slate-800/60 p-3 rounded-2xl border border-slate-700/50">
                            📅 {ticket.visit_date} &nbsp;|&nbsp; 👥 {ticket.visitor_count} Orang
                        </div>

                        <button 
                            onClick={() => setShowScanModal(false)}
                            className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition cursor-pointer"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}