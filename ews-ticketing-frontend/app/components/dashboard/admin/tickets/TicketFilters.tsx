import { Search, Calendar, Filter, CreditCard, ChevronDown } from 'lucide-react';

interface TicketFiltersProps {
    searchTerm: string;
    setSearchTerm: (val: string) => void;
    selectedDate: string;
    setSelectedDate: (val: string) => void;
    selectedStatus: string;
    setSelectedStatus: (val: string) => void;
    selectedPaymentMethod: string;
    setSelectedPaymentMethod: (val: string) => void;
}

export default function TicketFilters({ 
    searchTerm, 
    setSearchTerm, 
    selectedDate, 
    setSelectedDate, 
    selectedStatus, 
    setSelectedStatus,
    selectedPaymentMethod,
    setSelectedPaymentMethod
}: TicketFiltersProps) {
    return (
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 py-2">
            {/* Search Input (Memanjang Mengisi Ruang Agar Rapi) */}
            <div className="relative w-full flex-1">
                <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                <input 
                    type="text"
                    placeholder="Cari kode tiket, nama destinasi, atau nama pengunjung..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-white/90 hover:bg-white focus:bg-white border border-slate-200/80 rounded-2xl text-xs font-medium text-slate-700 shadow-sm focus:ring-2 focus:ring-emerald-600 outline-none transition"
                />
            </div>

            {/* Group Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
                
                {/* Filter Tanggal */}
                <div className="relative">
                    <div className="flex items-center gap-2 px-4 py-3 bg-white/90 hover:bg-white border border-slate-200/80 rounded-2xl text-xs font-semibold text-slate-700 shadow-sm transition cursor-pointer">
                        <Calendar className="w-4 h-4 text-slate-500 flex-shrink-0" />
                        <select 
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="bg-transparent outline-none cursor-pointer appearance-none pr-5 text-slate-700 font-semibold"
                        >
                            <option value="">Semua Tanggal</option>
                            <option value="today">Hari Ini</option>
                            <option value="this_week">Minggu Ini</option>
                            <option value="this_month">Bulan Ini</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 pointer-events-none" />
                    </div>
                </div>

                {/* Filter Status */}
                <div className="relative">
                    <div className="flex items-center gap-2 px-4 py-3 bg-white/90 hover:bg-white border border-slate-200/80 rounded-2xl text-xs font-semibold text-slate-700 shadow-sm transition cursor-pointer">
                        <Filter className="w-4 h-4 text-slate-500 flex-shrink-0" />
                        <select 
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="bg-transparent outline-none cursor-pointer appearance-none pr-5 text-slate-700 font-semibold"
                        >
                            <option value="">Semua Status</option>
                            <option value="pending">Pending</option>
                            <option value="paid">Lunas (Paid)</option>
                            <option value="cancelled">Ditolak / Cancelled</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 pointer-events-none" />
                    </div>
                </div>

                {/* Filter Metode Pembayaran */}
                <div className="relative">
                    <div className="flex items-center gap-2 px-4 py-3 bg-white/90 hover:bg-white border border-slate-200/80 rounded-2xl text-xs font-semibold text-slate-700 shadow-sm transition cursor-pointer">
                        <CreditCard className="w-4 h-4 text-slate-500 flex-shrink-0" />
                        <select 
                            value={selectedPaymentMethod}
                            onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                            className="bg-transparent outline-none cursor-pointer appearance-none pr-5 text-slate-700 font-semibold"
                        >
                            <option value="">Metode Bayar</option>
                            <option value="qris">QRIS / Instant</option>
                            <option value="bank_transfer">Transfer Bank</option>
                            <option value="cash">Tunai / Loket</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 pointer-events-none" />
                    </div>
                </div>

            </div>
        </div>
    );
}