'use client';

import { useState, useEffect } from 'react';
import { 
    Package, 
    ShoppingBag, 
    DollarSign, 
    AlertTriangle, 
    Plus, 
    Loader2, 
    RefreshCw 
} from 'lucide-react';
import { apiClient } from '@/app/lib/axios';
import { toast } from 'sonner';

export default function UmkmDashboardPage() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalProducts: 0,
        lowStockCount: 0,
        totalSold: 0,
        estimatedRevenue: 0
    });
    const [products, setProducts] = useState<any[]>([]);

    // Ambil data produk dan statistik UMKM saat halaman dimuat
    useEffect(() => {
        fetchUmkmData();
    }, []);

    const fetchUmkmData = async () => {
        try {
            setLoading(true);
            const res = await apiClient.get('/umkm/dashboard-summary');
            setStats(res.data.stats || {
                totalProducts: 4,
                lowStockCount: 1,
                totalSold: 28,
                estimatedRevenue: 1250000
            });
            setProducts(res.data.products || [
                { id: 1, name: 'Lempeng Karak Khas Ngoro-Oro', price: 15000, stock: 35, sold_count: 12, status: 'Aktif' },
                { id: 2, name: 'Tape Menir Spesial Fermentasi', price: 10000, stock: 4, sold_count: 20, status: 'Menipis' },
                { id: 3, name: 'Sambelan Bawang Pedas Mantap', price: 20000, stock: 25, sold_count: 15, status: 'Aktif' },
                { id: 4, name: 'Kembang Goyang Tradisional', price: 12000, stock: 30, sold_count: 8, status: 'Aktif' },
            ]);
        } catch (error) {
            toast.error('Gagal memuat data dasbor UMKM.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 text-slate-100">
            {/* Page Header Info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-sm">
                <div>
                    <h1 className="text-xl font-extrabold text-white tracking-tight">Dashboard UMKM Sedyo Maju</h1>
                    <p className="text-xs text-slate-400 mt-1">Kelola produk konsinyasi, stok, dan pantau bagi hasil bulanan (EOM).</p>
                </div>
                <button 
                    onClick={fetchUmkmData}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition border border-slate-700 cursor-pointer shadow-sm"
                >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Refresh Data</span>
                </button>
            </div>

            {/* Statistik Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-slate-400">Total Produk Terdaftar</p>
                        <h3 className="text-2xl font-extrabold text-white mt-1">{stats.totalProducts}</h3>
                    </div>
                    <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center text-blue-400">
                        <Package className="w-6 h-6" />
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-slate-400">Stok Menipis (Low Stock)</p>
                        <h3 className="text-2xl font-extrabold text-amber-400 mt-1">{stats.lowStockCount}</h3>
                    </div>
                    <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center text-amber-400">
                        <AlertTriangle className="w-6 h-6" />
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-slate-400">Produk Terjual (Bundling/OTS)</p>
                        <h3 className="text-2xl font-extrabold text-emerald-400 mt-1">{stats.totalSold}</h3>
                    </div>
                    <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400">
                        <ShoppingBag className="w-6 h-6" />
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-slate-400">Estimasi Pendapatan (EOM)</p>
                        <h3 className="text-xl font-extrabold text-purple-400 mt-1">
                            Rp {stats.estimatedRevenue.toLocaleString('id-ID')}
                        </h3>
                    </div>
                    <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center justify-center text-purple-400">
                        <DollarSign className="w-6 h-6" />
                    </div>
                </div>
            </div>

            {/* Tabel Manajemen Produk & Stok Konsinyasi */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-base font-bold text-white">Monitoring Stok & Produk Konsinyasi</h3>
                        <p className="text-xs text-slate-400">Daftar produk olahan pangan lokal UMKM Sedyo Maju yang dititipkan di pusat wisata.</p>
                    </div>
                    <button
                        onClick={() => toast.info('Fitur tambah produk akan segera dibuka.')}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-blue-600/20 cursor-pointer"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Tambah Produk Baru</span>
                    </button>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-2">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                        <span className="text-xs font-semibold">Memuat data produk...</span>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-slate-300">
                            <thead className="bg-slate-800/60 uppercase tracking-wider text-slate-400 font-semibold border-b border-slate-800">
                                <tr>
                                    <th className="py-3.5 px-4">Nama Produk / Hampers</th>
                                    <th className="py-3.5 px-4">Harga Satuan</th>
                                    <th className="py-3.5 px-4">Stok Konsinyasi</th>
                                    <th className="py-3.5 px-4">Terjual</th>
                                    <th className="py-3.5 px-4">Status Stok</th>
                                    <th className="py-3.5 px-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {products.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-800/40 transition">
                                        <td className="py-4 px-4 font-bold text-white">{item.name}</td>
                                        <td className="py-4 px-4 font-medium">Rp {item.price.toLocaleString('id-ID')}</td>
                                        <td className="py-4 px-4">
                                            <span className={`px-2.5 py-1 rounded-lg font-bold ${
                                                item.stock <= 5 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-slate-800 text-slate-200'
                                            }`}>
                                                {item.stock} Pcs
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-emerald-400 font-semibold">{item.sold_count} Pcs</td>
                                        <td className="py-4 px-4">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                item.stock <= 5 
                                                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                                                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                            }`}>
                                                {item.stock <= 5 ? '⚠️ Stok Menipis' : '✓ Aman'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-right">
                                            <button 
                                                onClick={() => toast.info(`Edit stok untuk ${item.name}`)}
                                                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-blue-400 font-semibold rounded-lg transition"
                                            >
                                                Perbarui Stok
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}