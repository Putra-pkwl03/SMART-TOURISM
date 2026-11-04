'use client';

import { Search, Filter, Calendar, RotateCcw } from 'lucide-react';

interface SalesToolbarProps {
    searchQuery: string;
    setSearchQuery: (val: string) => void;
    saleType: string;
    setSaleType: (val: string) => void;
    statusFilter: string;
    setStatusFilter: (val: string) => void;
    selectedMonth: number;
    setSelectedMonth: (val: number) => void;
    selectedYear: number;
    setSelectedYear: (val: number) => void;
}

export default function SalesToolbar({
    searchQuery,
    setSearchQuery,
    saleType,
    setSaleType,
    statusFilter,
    setStatusFilter,
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
}: SalesToolbarProps) {
    const currentYear = new Date().getFullYear();
    const years = [currentYear - 1, currentYear, currentYear + 1];

    const months = [
        { value: 1, name: 'Januari' },
        { value: 2, name: 'Februari' },
        { value: 3, name: 'Maret' },
        { value: 4, name: 'April' },
        { value: 5, name: 'Mei' },
        { value: 6, name: 'Juni' },
        { value: 7, name: 'Juli' },
        { value: 8, name: 'Agustus' },
        { value: 9, name: 'September' },
        { value: 10, name: 'Oktober' },
        { value: 11, name: 'November' },
        { value: 12, name: 'Desember' },
    ];

    // Cek apakah ada filter aktif
    const hasActiveFilters = 
        searchQuery !== '' || 
        saleType !== 'ALL' || 
        statusFilter !== 'ALL' || 
        selectedMonth !== new Date().getMonth() + 1 || 
        selectedYear !== currentYear;

    const handleReset = () => {
        setSearchQuery('');
        setSaleType('ALL');
        setStatusFilter('ALL');
        setSelectedMonth(new Date().getMonth() + 1);
        setSelectedYear(currentYear);
    };

    return (
        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative w-full lg:w-[320px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                    type="text"
                    placeholder="Cari nama produk / hampers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                />
            </div>

            {/* Filter Bagian Kanan */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full lg:w-auto justify-end flex-wrap">
                
                {/* Filter Jenis Penjualan */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <select
                        value={saleType}
                        onChange={(e) => setSaleType(e.target.value)}
                        className="w-full sm:w-auto px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition cursor-pointer"
                    >
                        <option value="ALL">Semua Jenis Penjualan</option>
                        <option value="bundling">Bundling Tiket Wisata</option>
                        <option value="standalone">Standalone (Oleh-Oleh)</option>
                    </select>
                </div>

                {/* Filter Status Pencairan */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full sm:w-auto px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition cursor-pointer"
                    >
                        <option value="ALL">Semua Status (Paid/Pending)</option>
                        <option value="paid">Paid (Lunas)</option>
                        <option value="pending">Pending (EOM)</option>
                    </select>
                </div>

                {/* Filter Bulan & Tahun (EOM) */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <select
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(Number(e.target.value))}
                            className="bg-transparent text-[11px] font-semibold text-slate-700 focus:outline-none cursor-pointer"
                        >
                            {months.map((m) => (
                                <option key={m.value} value={m.value}>{m.name}</option>
                            ))}
                        </select>
                        <span className="text-slate-400">/</span>
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(Number(e.target.value))}
                            className="bg-transparent text-[11px] font-semibold text-slate-700 focus:outline-none cursor-pointer"
                        >
                            {years.map((y) => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Tombol Reset Filter */}
                {hasActiveFilters && (
                    <button
                        onClick={handleReset}
                        title="Reset Filter"
                        className="flex items-center gap-1.5 px-3.5 py-3 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-2xl text-xs font-bold transition duration-200 cursor-pointer w-full sm:w-auto justify-center"
                    >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset</span>
                    </button>
                )}
            </div>
        </div>
    );
}