// app/components/dashboard/admin/consignment/ConsignmentToolbar.tsx
'use client';

import { Search, Filter, Calendar } from 'lucide-react';

interface ConsignmentToolbarProps {
    searchQuery: string;
    setSearchQuery: (val: string) => void;
    selectedProductFilter: string;
    setSelectedProductFilter: (val: string) => void;
    selectedStatusFilter: string;
    setSelectedStatusFilter: (val: string) => void;
    selectedMonth: number;
    setSelectedMonth: (val: number) => void;
    selectedYear: number;
    setSelectedYear: (val: number) => void;
    productsList: any[];
    onSearchSubmit: () => void;
}

export default function ConsignmentToolbar({
    searchQuery,
    setSearchQuery,
    selectedProductFilter,
    setSelectedProductFilter,
    selectedStatusFilter,
    setSelectedStatusFilter,
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
    productsList,
    onSearchSubmit,
}: ConsignmentToolbarProps) {
    
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

    const years = [2025, 2026, 2027];

    return (
        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-xs flex flex-wrap items-center justify-between gap-3">
            {/* 1. Kotak Pencarian */}
            <div className="relative flex-1 min-w-[220px]">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                    <Search className="w-4 h-4" />
                </span>
                <input 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && onSearchSubmit()}
                    placeholder="Cari kode tiket / wisatawan..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                />
            </div>

            {/* 2. Filter Berdasarkan Produk UMKM */}
            <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400 flex-shrink-0 hidden sm:block" />
                <select
                    value={selectedProductFilter}
                    onChange={(e) => setSelectedProductFilter(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition cursor-pointer"
                >
                    <option value="ALL">Semua Produk UMKM</option>
                    {productsList.map((prod: any, index: number) => (
                        <option key={prod.id || index} value={prod.name}>
                            {prod.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* 3. Filter Status EOM */}
            <div className="flex items-center gap-2">
                <select
                    value={selectedStatusFilter}
                    onChange={(e) => setSelectedStatusFilter(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition cursor-pointer font-medium"
                >
                    <option value="ALL">Status: Semua</option>
                    <option value="pending">Pending</option>
                    <option value="paid">Lunas (Paid)</option>
                </select>
            </div>

            {/* 4. Filter Periode Bulan & Tahun */}
            <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0 hidden sm:block" />
                <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(Number(e.target.value))}
                    className="bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition cursor-pointer"
                >
                    {months.map((m) => (
                        <option key={m.value} value={m.value}>
                            {m.name}
                        </option>
                    ))}
                </select>

                <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    className="bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition cursor-pointer"
                >
                    {years.map((y) => (
                        <option key={y} value={y}>
                            {y}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}