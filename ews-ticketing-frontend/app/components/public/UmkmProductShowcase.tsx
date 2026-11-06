'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import UmkmProductDetailModal, { type UmkmCatalogProduct } from './UmkmProductDetailModal';
import UmkmProductCard from './UmkmProductCard';

interface UmkmProductShowcaseProps {
    products: UmkmCatalogProduct[];
    loading: boolean;
    limit?: number;
    showAllLink?: boolean;
}

export default function UmkmProductShowcase({
    products,
    loading,
    limit = 4,
    showAllLink = false,
}: UmkmProductShowcaseProps) {
    const visibleProducts = products.slice(0, limit);
    const [selectedProduct, setSelectedProduct] = useState<UmkmCatalogProduct | null>(null);

    return (
        <section id="umkm" className="min-w-0 scroll-mt-24">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h2 className="text-xl font-extrabold text-slate-900 sm:text-2xl">
                        Produk UMKM Unggulan
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Dukung produk lokal dan bawa pulang cita rasa khas Ngoro-oro.
                    </p>
                </div>
                {showAllLink && (
                    <Link
                        href="/umkm/produk"
                        className="inline-flex w-fit shrink-0 items-center gap-1 text-sm font-bold text-emerald-700 transition hover:text-emerald-800"
                    >
                        Lihat Semua <ArrowRight className="h-4 w-4" />
                    </Link>
                )}
            </div>

            {loading ? (
                <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4" role="status" aria-label="Memuat produk UMKM">
                    {[1, 2, 3, 4].map((item) => (
                        <div key={item} className="overflow-hidden rounded-2xl border border-slate-100 bg-white animate-pulse">
                            <div className="aspect-[4/3] bg-slate-200" />
                            <div className="flex items-center justify-between gap-2 p-3">
                                <div className="space-y-2">
                                    <div className="h-3 w-24 rounded bg-slate-200" />
                                    <div className="h-3 w-16 rounded bg-slate-100" />
                                </div>
                                <div className="h-9 w-9 rounded-full bg-emerald-100" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : visibleProducts.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
                    Belum ada produk UMKM yang tersedia saat ini.
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
                    {visibleProducts.map((product) => (
                        <UmkmProductCard
                            key={product.id}
                            product={product}
                            onSelectProduct={setSelectedProduct}
                        />
                    ))}
                </div>
            )}
            <UmkmProductDetailModal
                key={selectedProduct?.id ?? 'closed'}
                product={selectedProduct}
                onClose={() => setSelectedProduct(null)}
            />
        </section>
    );
}
