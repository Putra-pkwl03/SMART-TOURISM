'use client';

import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Search } from 'lucide-react';
import PublicNavbar from '@/app/components/public/PublicNavbar';
import PublicFooter from '@/app/components/public/PublicFooter';
import DestinationCatalog from '@/app/components/public/DestinationCatalog';
import CatalogImageHero from '@/app/components/public/CatalogImageHero';
import { getBackendUrl } from '@/app/lib/backend-url';
import { apiClient } from '@/app/lib/axios';

interface DestinationItem {
    id: number;
    name: string;
    type?: string;
    location?: string;
    description?: string;
    ticket_price?: number;
    image_url?: string;
    images?: { id: number; image_url: string }[];
    umkm_products?: {
        id: number;
        name: string;
        price: number;
        image_url?: string;
        image_path?: string;
        images?: { image_url?: string; image_path?: string; is_primary?: boolean }[];
    }[];
}

export default function DestinationsPage() {
    const [destinations, setDestinations] = useState<DestinationItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const backendUrl = getBackendUrl();
    const imageSlides = useMemo(() => {
        const seen = new Set<string>();
        return destinations.flatMap((destination) => {
            const rawImages = [
                destination.image_url,
                ...(destination.images ?? []).map((image) => image.image_url),
            ].filter((url): url is string => Boolean(url));

            return rawImages.flatMap((rawUrl) => {
                const url = rawUrl.startsWith('http')
                    ? rawUrl
                    : `${backendUrl}${rawUrl.startsWith('/storage') ? rawUrl : `/storage/${rawUrl.replace(/^\/+/, '')}`}`;
                if (seen.has(url)) return [];
                seen.add(url);
                return [{ src: url, title: destination.name }];
            });
        });
    }, [backendUrl, destinations]);
    const filteredDestinations = destinations.filter((destination) => {
        const query = search.trim().toLocaleLowerCase('id-ID');
        return !query || [destination.name, destination.location, destination.description]
            .some((value) => value?.toLocaleLowerCase('id-ID').includes(query));
    });

    useEffect(() => {
        let isActive = true;
        const timeoutId = window.setTimeout(() => {
            apiClient.get<DestinationItem[]>('/destinations')
                .then((response) => {
                    if (isActive) setDestinations(response.data);
                })
                .catch((error: unknown) => {
                    console.error('Gagal memuat semua destinasi:', error);
                    if (isActive) toast.error('Gagal memuat katalog destinasi.');
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
                    eyebrow="Jelajahi Ngoro-oro"
                    title="Destinasi Wisata"
                    description="Temukan pesona alam, pengalaman budaya, dan paket wisata unggulan di sekitar Ngoro-oro."
                    itemCount={destinations.length}
                    countLabel="destinasi tersedia"
                    slides={imageSlides}
                    search={search}
                    onSearchChange={setSearch}
                    searchPlaceholder="Cari nama atau lokasi destinasi..."
                    searchLabel="Cari destinasi wisata"
                />
                <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
                    <p className="mb-5 text-sm font-semibold text-slate-600">
                        {loading ? 'Memuat destinasi...' : `Menampilkan ${filteredDestinations.length} dari ${destinations.length} destinasi`}
                    </p>
                    {!loading && search.trim() && filteredDestinations.length === 0 ? (
                        <div className="rounded-3xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
                            <Search className="mx-auto h-10 w-10 text-slate-300" />
                            <h2 className="mt-4 text-lg font-bold text-slate-800">Destinasi tidak ditemukan</h2>
                            <p className="mt-1 text-sm text-slate-500">Coba gunakan kata kunci yang berbeda.</p>
                        </div>
                    ) : (
                        <DestinationCatalog destinations={filteredDestinations} loading={loading} />
                    )}
                </div>
            </main>
            <PublicFooter />
        </div>
    );
}
