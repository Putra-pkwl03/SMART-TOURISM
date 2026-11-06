'use client';

import { Search, ShoppingBag } from 'lucide-react';
import { getBackendUrl } from '@/app/lib/backend-url';
import type { CashierProduct } from './types';
import { Skeleton } from '@/app/components/dashboard/shared/DashboardSkeleton';

interface CashierProductGridProps {
    products: CashierProduct[];
    loading: boolean;
    search: string;
    onSearchChange: (value: string) => void;
    onAdd: (product: CashierProduct) => void;
}

const formatRupiah = (amount: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);

export default function CashierProductGrid({
    products,
    loading,
    search,
    onSearchChange,
    onAdd,
}: CashierProductGridProps) {
    const backendUrl = getBackendUrl();
    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <section className="space-y-4">
            <div className="relative">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                    value={search}
                    onChange={(event) => onSearchChange(event.target.value)}
                    placeholder="Cari nama produk..."
                    aria-label="Cari produk"
                    className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
            </div>

            {loading ? (
                <div role="status" aria-label="Memuat produk kasir" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {Array.from({ length: 6 }, (_, index) => (
                        <div key={index} className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
                            <Skeleton className="h-36 rounded-none" />
                            <div className="space-y-3 p-4">
                                <div className="flex justify-between gap-3">
                                    <Skeleton className="h-4 w-2/3" />
                                    <Skeleton className="h-5 w-14 rounded-full" />
                                </div>
                                <Skeleton className="h-3 w-full" />
                                <Skeleton className="h-3 w-4/5" />
                                <div className="flex justify-between">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-8 w-20 rounded-xl" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : filteredProducts.length === 0 ? (
                <div className="rounded-2xl border border-slate-100 bg-white p-10 text-center text-sm text-slate-500">
                    {search ? 'Produk tidak ditemukan.' : 'Belum ada produk aktif untuk dijual.'}
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {filteredProducts.map((product) => {
                        const image = product.images?.find((item) => item.is_primary) ?? product.images?.[0];
                        return (
                            <article key={product.id} className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
                                <div className="h-36 bg-slate-100">
                                    {image ? (
                                        <img
                                            src={`${backendUrl}/storage/${image.image_path}`}
                                            alt={product.name}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-slate-300">
                                            <ShoppingBag className="h-8 w-8" />
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-3 p-4">
                                    <div className="flex items-start justify-between gap-2">
                                        <h2 className="font-bold text-slate-900">{product.name}</h2>
                                        <span className={`shrink-0 rounded-full px-2 py-1 text-[11px] font-bold ${product.stock > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                                            Stok {product.stock}
                                        </span>
                                    </div>
                                    <p className="line-clamp-2 min-h-8 text-xs text-slate-500">
                                        {product.description || 'Produk UMKM lokal'}
                                    </p>
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="text-sm font-extrabold text-emerald-700">{formatRupiah(product.price)}</span>
                                        <button
                                            type="button"
                                            onClick={() => onAdd(product)}
                                            disabled={product.stock < 1}
                                            className="rounded-xl bg-emerald-700 px-3 py-2 text-xs font-bold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                                        >
                                            Tambah
                                        </button>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}
        </section>
    );
}
