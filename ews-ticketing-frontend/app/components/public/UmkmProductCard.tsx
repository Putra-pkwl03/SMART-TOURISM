'use client';

import { MessageCircle } from 'lucide-react';
import { getBackendUrl } from '@/app/lib/backend-url';
import type { UmkmCatalogProduct } from './UmkmProductDetailModal';

interface UmkmProductCardProps {
    product: UmkmCatalogProduct;
    onSelectProduct: (product: UmkmCatalogProduct) => void;
}

export default function UmkmProductCard({ product, onSelectProduct }: UmkmProductCardProps) {
    const backendUrl = getBackendUrl();
    const primaryImage = product.images?.find((image) => image.is_primary) ?? product.images?.[0];
    const imagePath = primaryImage?.image_path;
    const imageUrl = imagePath
        ? imagePath.startsWith('http') ? imagePath : `${backendUrl}/storage/${imagePath.replace(/^\/+/, '')}`
        : '/images/placeholder.jpg';
    const message = `Halo, saya ingin bertanya mengenai produk ${product.name}. Apakah produk ini masih tersedia? Mohon informasi harga dan cara pembeliannya. Terima kasih.`;

    return (
        <article className="group min-w-0 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg">
            <button
                type="button"
                onClick={() => onSelectProduct(product)}
                aria-label={`Lihat detail ${product.name}`}
                className="relative block aspect-[4/3] w-full overflow-hidden bg-slate-100 text-left"
            >
                <span
                    role="img"
                    aria-label={product.name}
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url("${imageUrl}")` }}
                />
            </button>
            <div className="flex items-center justify-between gap-2 p-3 sm:p-3.5">
                <button
                    type="button"
                    onClick={() => onSelectProduct(product)}
                    className="min-w-0 flex-1 text-left"
                >
                    <h3 className="truncate text-sm font-bold text-slate-900 transition group-hover:text-emerald-800">
                        {product.name}
                    </h3>
                    <p className="mt-1 text-xs font-extrabold text-slate-700">
                        Rp {Number(product.price).toLocaleString('id-ID')}
                    </p>
                </button>
                <a
                    href={`https://wa.me/6282314969109?text=${encodeURIComponent(message)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Tanya ${product.name} via WhatsApp`}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-white shadow-sm transition hover:bg-emerald-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
                >
                    <MessageCircle className="h-4 w-4" />
                </a>
            </div>
        </article>
    );
}
