import { Search, Filter, Package } from 'lucide-react';

interface ProductToolbarProps {
    searchQuery: string;
    setSearchQuery: (val: string) => void;
    selectedStatus: string;
    setSelectedStatus: (val: string) => void;
}

export default function ProductToolbar({
    searchQuery,
    setSearchQuery,
    selectedStatus,
    setSelectedStatus,
}: ProductToolbarProps) {
    return (
        <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Input Pencarian Aktif */}
            <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari nama produk atau hampers..." 
                    className="w-full bg-white border border-gray-100 rounded-2xl pl-11 pr-4 py-3 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs transition"
                />
            </div>

            {/* Filter Dropdown Aktif */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
                <select 
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="bg-white border border-gray-100 px-4 py-3 rounded-2xl text-xs font-semibold text-gray-700 shadow-xs cursor-pointer hover:bg-gray-50 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="ALL">Semua Status Stok</option>
                    <option value="SAFE">Aman</option>
                    <option value="LOW">Stok Menipis</option>
                </select>

                <div className="flex items-center gap-2 bg-white border border-gray-100 px-4 py-3 rounded-2xl text-xs font-semibold text-gray-700 shadow-xs cursor-pointer hover:bg-gray-50 transition">
                    <Package className="w-3.5 h-3.5 text-gray-400" />
                    <span>Semua Kategori</span>
                </div>
            </div>
        </div>
    );
}