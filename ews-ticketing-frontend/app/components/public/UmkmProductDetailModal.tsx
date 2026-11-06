'use client';

import { useEffect, useState } from 'react';
import { Image as ImageIcon, Package, ShoppingBag, X } from 'lucide-react';
import { getBackendUrl } from '@/app/lib/backend-url';

export interface UmkmCatalogProduct {
    id: number;
    name: string;
    stock: number;
    price: number;
    description?: string | null;
    image_url?: string;
    image_path?: string;
    image?: string;
    images?: Array<{
        id: number;
        image_path: string;
        is_primary: boolean;
        image_url?: string;
    }>;
}

interface UmkmProductDetailModalProps {
    product: UmkmCatalogProduct | null;
    onClose: () => void;
}

export default function UmkmProductDetailModal({ product, onClose }: UmkmProductDetailModalProps) {
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const backendUrl = getBackendUrl();
    const whatsappMessage = product
        ? `Halo, saya ingin bertanya mengenai produk ${product.name}. Apakah produk ini masih tersedia? Mohon informasi harga dan cara pembeliannya. Terima kasih.`
        : '';

    useEffect(() => {
        if (!product) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [product, onClose]);

    if (!product) return null;

    const images = product.images ?? [];
    const selectedImage = images[activeImageIndex] ?? images.find((image) => image.is_primary) ?? images[0];
    const imageUrl = selectedImage
        ? selectedImage.image_path.startsWith('http')
            ? selectedImage.image_path
            : `${backendUrl}/storage/${selectedImage.image_path.replace(/^\/+/, '')}`
        : '/images/placeholder.jpg';
    return (
        <div
            className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm"
            role="presentation"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
        >
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="umkm-product-modal-title"
                className="relative my-auto grid w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl md:grid-cols-2"
            >
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Tutup detail produk"
                    className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-600 shadow-md transition hover:bg-white hover:text-slate-900"
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="relative min-h-64 bg-slate-100 md:min-h-[26rem]">
                    {selectedImage ? (
                        <img src={imageUrl} alt={product.name} className="absolute inset-0 h-full w-full object-cover" />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                            <ImageIcon className="h-16 w-16" />
                        </div>
                    )}
                    <span className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-slate-700 backdrop-blur">
                        <Package className="h-3.5 w-3.5" />
                        Stok {product.stock}
                    </span>
                    {images.length > 1 && (
                        <div className="absolute bottom-4 right-4 flex max-w-[55%] gap-2 overflow-x-auto rounded-xl bg-slate-950/40 p-1.5">
                            {images.map((image, index) => (
                                <button
                                    key={image.id}
                                    type="button"
                                    onClick={() => setActiveImageIndex(index)}
                                    aria-label={`Lihat foto ${index + 1}`}
                                    aria-pressed={activeImageIndex === index}
                                    className={`h-11 w-11 shrink-0 overflow-hidden rounded-lg border-2 ${activeImageIndex === index ? 'border-white' : 'border-transparent opacity-75'}`}
                                >
                                    <img
                                        src={image.image_path.startsWith('http') ? image.image_path : `${backendUrl}/storage/${image.image_path.replace(/^\/+/, '')}`}
                                        alt=""
                                        className="h-full w-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex flex-col p-6 sm:p-8">
                    <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-emerald-700">Produk UMKM Sedyomaju</span>
                    <h2 id="umkm-product-modal-title" className="mt-2 text-2xl font-black leading-tight text-slate-900">{product.name}</h2>
                    <p className="mt-4 text-sm leading-6 text-slate-600">
                        {product.description || 'Camilan pilihan hasil olahan UMKM lokal Ngoro-oro, dikemas dengan rapi dan siap dinikmati.'}
                    </p>
                    <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
                        <p className="text-xs font-semibold text-slate-500">Harga</p>
                        <p className="mt-1 text-2xl font-black text-emerald-800">
                            Rp {Number(product.price).toLocaleString('id-ID')}
                        </p>
                    </div>
                    <div className="mt-auto pt-7">
                        <a
                            href={`https://wa.me/6282314969109?text=${encodeURIComponent(whatsappMessage)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-800"
                        >
                            <ShoppingBag className="h-4 w-4" />
                            Tanya & Pesan via WhatsApp
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
