'use client';

import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Search } from 'lucide-react';
import PublicNavbar from '@/app/components/public/PublicNavbar';
import PublicFooter from '@/app/components/public/PublicFooter';
import UmkmProductCatalog from '@/app/components/public/UmkmProductCatalog';
import CatalogImageHero from '@/app/components/public/CatalogImageHero';
import type { UmkmCatalogProduct } from '@/app/components/public/UmkmProductDetailModal';
import { getBackendUrl } from '@/app/lib/backend-url';
import { apiClient } from '@/app/lib/axios';

export default function UmkmProductsCatalogPage() {
    const [products, setProducts] = useState<UmkmCatalogProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const backendUrl = getBackendUrl();
    const imageSlides = useMemo(() => {
        const seen = new Set<string>();
        return products.flatMap((product) => {
            const rawPaths = [
                ...(product.images ?? []).map((image) => image.image_path || image.image_url),
                product.image_url,
                product.image_path,
                product.image,
            ].filter((path): path is string => Boolean(path));
            return rawPaths.flatMap((rawPath) => {
                if (!rawPath) return [];
                const url = rawPath.startsWith('http')
                    ? rawPath
                    : `${backendUrl}/storage/${rawPath.replace(/^\/+/, '')}`;
                if (seen.has(url)) return [];
                seen.add(url);
                return [{ src: url, title: product.name }];
            });
        });
    }, [backendUrl, products]);
    const filteredProducts = products.filter((product) =>
        product.name.toLocaleLowerCase('id-ID').includes(search.trim().toLocaleLowerCase('id-ID')),
    );

    useEffect(() => {
        let isActive = true;
        const timeoutId = window.setTimeout(() => {
            apiClient.get<{ data: UmkmCatalogProduct[] }>('/umkm/products')
                .then((response) => {
                    if (isActive) setProducts(response.data.data ?? []);
                })
                .catch((error: unknown) => {
                    console.error('Gagal memuat semua produk UMKM:', error);
                    if (isActive) toast.error('Gagal memuat katalog produk UMKM.');
                })
                .finally(() => {
                    if (isActive) setLoading(false);
                });
        }, 0);

        return () => {
            isActive = false;
            window.clearTimeout(timeoutId);
        };
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">
            <PublicNavbar />
            <main className="min-h-[65vh] pb-16">
                <CatalogImageHero
                    backHref="/"
                    eyebrow="Produk Lokal Ngoro-oro"
                    title="Katalog Produk UMKM"
                    description="Temukan camilan dan oleh-oleh khas dari produsen lokal. Hubungi penjual melalui WhatsApp untuk bertanya atau memesan."
                    itemCount={products.length}
                    countLabel="produk tersedia"
                    slides={imageSlides}
                    search={search}
                    onSearchChange={setSearch}
                    searchPlaceholder="Cari nama produk..."
                    searchLabel="Cari produk UMKM"
                />
                <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
                    <div className="mb-5 flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-slate-600">
                            {loading ? 'Memuat produk...' : `Menampilkan ${filteredProducts.length} dari ${products.length} produk`}
                        </p>
                    </div>
                    {!loading && search.trim() && filteredProducts.length === 0 ? (
                        <div className="rounded-3xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
                            <Search className="mx-auto h-10 w-10 text-slate-300" />
                            <h2 className="mt-4 text-lg font-bold text-slate-800">Produk tidak ditemukan</h2>
                            <p className="mt-1 text-sm text-slate-500">Coba gunakan kata kunci yang berbeda.</p>
                        </div>
                    ) : (
                        <UmkmProductCatalog products={filteredProducts} loading={loading} />
                    )}
                </div>
            </main>
            <PublicFooter />
        </div>
    );
}
