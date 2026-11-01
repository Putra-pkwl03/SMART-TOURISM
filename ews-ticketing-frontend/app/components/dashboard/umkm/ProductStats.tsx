import { Package, ShoppingBag, AlertTriangle } from 'lucide-react';

interface ProductStatsProps {
    totalProductsCount: number;
    totalStockCount: number;
    lowStockCount: number;
    totalSoldEstimated: number;
}

export default function ProductStats({
    totalProductsCount,
    totalStockCount,
    lowStockCount,
    totalSoldEstimated,
}: ProductStatsProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1 */}
            <div className="bg-white border border-gray-100 p-5 rounded-3xl shadow-xs flex items-center justify-between">
                <div>
                    <p className="text-xs font-medium text-gray-400">Total Produk</p>
                    <div className="flex items-baseline gap-2 mt-1">
                        <h3 className="text-2xl font-black text-gray-900">{totalProductsCount}</h3>
                        <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">Active</span>
                    </div>
                </div>
                <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner">
                    <Package className="w-6 h-6" />
                </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white border border-gray-100 p-5 rounded-3xl shadow-xs flex items-center justify-between">
                <div>
                    <p className="text-xs font-medium text-gray-400">Stok Tersedia</p>
                    <div className="flex items-baseline gap-2 mt-1">
                        <h3 className="text-2xl font-black text-gray-900">{totalStockCount.toLocaleString('id-ID')} Pcs</h3>
                    </div>
                </div>
                <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 shadow-inner">
                    <Package className="w-6 h-6" />
                </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white border border-gray-100 p-5 rounded-3xl shadow-xs flex items-center justify-between">
                <div>
                    <p className="text-xs font-medium text-gray-400">Stok Menipis</p>
                    <div className="flex items-baseline gap-2 mt-1">
                        <h3 className="text-2xl font-black text-amber-600">{lowStockCount} Produk</h3>
                    </div>
                </div>
                <div className="w-12 h-12 bg-amber-50 border border-amber-100 rounded-2xl flex items-center justify-center text-amber-600 shadow-inner">
                    <AlertTriangle className="w-6 h-6" />
                </div>
            </div>

            {/* Card 4 */}
            <div className="bg-white border border-gray-100 p-5 rounded-3xl shadow-xs flex items-center justify-between">
                <div>
                    <p className="text-xs font-medium text-gray-400">Produk Terjual</p>
                    <div className="flex items-baseline gap-2 mt-1">
                        <h3 className="text-2xl font-black text-purple-600">{totalSoldEstimated} Pcs</h3>
                    </div>
                </div>
                <div className="w-12 h-12 bg-purple-50 border border-purple-100 rounded-2xl flex items-center justify-center text-purple-600 shadow-inner">
                    <ShoppingBag className="w-6 h-6" />
                </div>
            </div>
        </div>
    );
}