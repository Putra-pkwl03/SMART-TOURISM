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
    const stats = [
        {
            title: 'Total Produk',
            value: `${totalProductsCount}`,
            badge: 'Active',
            icon: Package,
            iconBg: 'bg-blue-100 text-blue-700 border-blue-200',
            cardBg: 'bg-gradient-to-br from-blue-100/80 via-white to-white',
            textColor: 'text-gray-900',
            badgeColor: 'text-emerald-600 bg-emerald-50',
        },
        {
            title: 'Stok Tersedia',
            value: `${totalStockCount.toLocaleString('id-ID')} Pcs`,
            badge: null,
            icon: Package,
            iconBg: 'bg-emerald-100 text-emerald-700 border-emerald-200',
            cardBg: 'bg-gradient-to-br from-emerald-100/80 via-white to-white',
            textColor: 'text-gray-900',
        },
        {
            title: 'Stok Menipis',
            value: `${lowStockCount} Produk`,
            badge: null,
            icon: AlertTriangle,
            iconBg: 'bg-amber-100 text-amber-700 border-amber-200',
            cardBg: 'bg-gradient-to-br from-amber-100/80 via-white to-white',
            textColor: 'text-amber-600',
        },
        {
            title: 'Produk Terjual',
            value: `${totalSoldEstimated} Pcs`,
            badge: null,
            icon: ShoppingBag,
            iconBg: 'bg-purple-100 text-purple-700 border-purple-200',
            cardBg: 'bg-gradient-to-br from-purple-100/80 via-white to-white',
            textColor: 'text-purple-600',
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                    <div 
                        key={index} 
                        className={`${stat.cardBg} backdrop-blur-md p-5 rounded-3xl border border-white/80 shadow-xs flex items-center justify-between relative overflow-hidden`}
                    >
                        {/* Teks Kiri */}
                        <div>
                            <p className="text-xs font-medium text-gray-400">{stat.title}</p>
                            <div className="flex items-baseline gap-2 mt-1">
                                <h3 className={`text-base sm:text-lg font-black ${stat.textColor}`}>{stat.value}</h3>
                                {stat.badge && (
                                    <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-md ${stat.badgeColor}`}>
                                        {stat.badge}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Ikon Kanan */}
                        <div className={`w-12 h-12 border rounded-2xl flex items-center justify-center shadow-inner flex-shrink-0 ${stat.iconBg}`}>
                            <Icon className="w-6 h-6" />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}