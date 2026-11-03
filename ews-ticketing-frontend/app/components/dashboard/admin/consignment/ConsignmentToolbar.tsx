// app/components/dashboard/consignment/ConsignmentToolbar.tsx
'use client';

import { Search, Filter } from 'lucide-react';

interface ConsignmentToolbarProps {
    searchQuery: string;
    setSearchQuery: (val: string) => void;
    selectedProductFilter: string;
    setSelectedProductFilter: (val: string) => void;
    productsList: any[];
}

export default function ConsignmentToolbar({
    searchQuery,
    setSearchQuery,
    selectedProductFilter,
    setSelectedProductFilter,
    productsList,
}: ConsignmentToolbarProps) {
    return (
        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
            {/* Kotak Pencarian */}
            <div className="relative w-full md:w-80">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                    <Search className="w-4 h-4" />
                </span>
                <input 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari kode tiket / wisatawan..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                />
            </div>

            {/* Filter Berdasarkan Produk UMKM */}
            <div className="flex items-center gap-2 w-full md:w-auto">
                <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <select
                    value={selectedProductFilter}
                    onChange={(e) => setSelectedProductFilter(e.target.value)}
                    className="w-full md:w-64 bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition cursor-pointer"
                >
                    <option value="ALL">Semua Produk UMKM</option>
                    {productsList.map((prod: any, index: number) => (
                        <option key={prod.id || index} value={prod.name}>
                            {prod.name}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}