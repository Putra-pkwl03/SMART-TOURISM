import { Ticket } from 'lucide-react';

export default function TicketHeader() {
    return (
        <div className="flex items-center gap-5 py-2">
            {/* Kotak Ikon Hijau Muda Melengkung */}
            <div className="w-16 h-16 bg-emerald-100/70 backdrop-blur-md rounded-3xl flex items-center justify-center text-emerald-700 shadow-sm flex-shrink-0 border border-emerald-200/50">
                <Ticket className="w-8 h-8" />
            </div>

            {/* Teks Judul & Deskripsi Langsung di atas Background */}
            <div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    E-Ticketing Dan Bookings
                </h1>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium max-w-2xl">
                    Kelola rekapitulasi kunjungan harian, verifikasi bukti pembayaran manual, <br className="hidden sm:inline" />
                    dan pantau status tiket secara real-time.
                </p>
            </div>
        </div>
    );
}