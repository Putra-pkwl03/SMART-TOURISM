'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Package, Image as ImageIcon, ArrowRight } from 'lucide-react';
import { getBackendUrl } from '@/app/lib/backend-url';
import UmkmProductDetailModal, { type UmkmCatalogProduct } from './UmkmProductDetailModal';

interface UmkmProductCatalogProps {
    products: UmkmCatalogProduct[];
    loading: boolean;
    showAllLink?: boolean;
    limit?: number;
    embedded?: boolean;
}

export default function UmkmProductCatalog({
    products,
    loading,
    showAllLink = false,
    limit,
    embedded = false,
}: UmkmProductCatalogProps) {
    const backendUrl = getBackendUrl();
    const whatsappNumber = '6282314969109';
    const [selectedProduct, setSelectedProduct] = useState<UmkmCatalogProduct | null>(null);

    // State untuk melacak indeks gambar yang aktif untuk setiap produk (berdasarkan product.id)
    const [activeImageIndexes, setActiveImageIndexes] = useState<{ [key: number]: number }>({});

    const handleImageChange = (productId: number, index: number) => {
        setActiveImageIndexes(prev => ({ ...prev, [productId]: index }));
    };

    return (
        <section id="umkm" className={embedded ? 'min-w-0 scroll-mt-24' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 scroll-mt-24 '}>
            <div className={`flex flex-col gap-4 md:flex-row md:items-end md:justify-between ${embedded ? 'mb-6' : 'mb-8'}`}>
                <div>
                   <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 mb-2 block">
                        Produk Lokal dan Oleh-Oleh
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">
                        Oleh-Oleh dan Hampers UMKM
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                        Beli langsung produk khas warga lokal secara mandiri tanpa harus membeli tiket wisata.
                    </p>
                </div>
                {showAllLink && (
                    <Link href="/umkm/produk" className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full border border-emerald-100 bg-white px-4 py-2.5 text-xs font-bold text-emerald-800 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50">
                        Lihat Semua Produk
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                )}
            </div>

            {loading ? (
                <div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    role="status"
                    aria-label="Memuat produk UMKM"
                >
                    {[1, 2, 3].map((card) => (
                        <div key={card} className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm animate-pulse">
                            <div className="relative h-48 bg-slate-200">
                                <div className="absolute right-3 top-3 h-6 w-16 rounded-full bg-white/80" />
                            </div>
                            <div className="space-y-3 p-5">
                                <div className="h-4 w-3/4 rounded bg-slate-200" />
                                <div className="space-y-2">
                                    <div className="h-3 w-full rounded bg-slate-100" />
                                    <div className="h-3 w-5/6 rounded bg-slate-100" />
                                </div>
                                <div className="h-4 w-1/3 rounded bg-emerald-100" />
                            </div>
                            <div className="px-5 pb-5">
                                <div className="h-10 rounded-xl bg-emerald-100" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : products.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-3xl border border-slate-200">
                    <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-sm font-medium text-slate-600">Belum ada produk UMKM yang tersedia saat ini.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(limit ? products.slice(0, limit) : products).map((product) => {
                        const images = product.images || [];
                        const activeIndex = activeImageIndexes[product.id] || 0;
                        
                        // Pilih gambar aktif, fallback ke gambar utama (is_primary), atau placeholder
                        const currentImage = images[activeIndex] || images.find((img) => img.is_primary) || images[0];
                        const imageUrl = currentImage ? `${backendUrl}/storage/${currentImage.image_path}` : '/images/placeholder.jpg';

                        return (
                            <article key={product.id} className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl">
                                <button
                                    type="button"
                                    onClick={() => setSelectedProduct(product)}
                                    aria-label={`Lihat detail ${product.name}`}
                                    className="absolute inset-0 z-0 cursor-pointer"
                                />
                                <div className="relative z-10 pointer-events-none">
                                    {/* Bagian Gambar Produk & Multi-Image Preview */}
                                    <div className={`relative bg-slate-100 overflow-hidden ${embedded ? 'h-40 xl:h-44' : 'h-48'}`}>
                                        <img 
                                            src={imageUrl} 
                                            alt={product.name} 
                                            className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105"
                                        />
                                        
                                        {/* Badge Stok */}
                                        <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-slate-800 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm z-10">
                                            Stok: {product.stock}
                                        </span>

                                        {/* Badge Indikator Jumlah Foto (jika > 1) */}
                                        {images.length > 1 && (
                                            <div className="absolute bottom-3 left-3 bg-slate-900/70 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded-md flex items-center gap-1">
                                                <ImageIcon className="w-3 h-3" /> {images.length} Foto
                                            </div>
                                        )}
                                    </div>

                                    {/* Thumbnail Kecil Jika Ada Lebih dari 1 Foto */}
                                    {images.length > 1 && (
                                        <div className="flex gap-1.5 px-4 pt-3 overflow-x-auto">
                                            {images.map((img, idx) => (
                                                <button
                                                    key={img.id}
                                                    type="button"
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                        handleImageChange(product.id, idx);
                                                    }}
                                                    className={`pointer-events-auto relative z-20 w-10 h-10 rounded-lg overflow-hidden border-2 transition shrink-0 ${activeIndex === idx ? 'border-emerald-600 scale-95 shadow-sm' : 'border-transparent opacity-70 hover:opacity-100'}`}
                                                >
                                                    <img 
                                                        src={`${backendUrl}/storage/${img.image_path}`} 
                                                        alt="Thumbnail" 
                                                        className="w-full h-full object-cover"
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    <div className="p-5">
                                        <h3 className="font-bold text-slate-900 text-base line-clamp-1 mb-1 group-hover:text-emerald-700 transition">{product.name}</h3>
                                        <p className="text-xs text-slate-500 line-clamp-2 mb-4">{product.description || 'Produk unggulan hasil karya mitra UMKM lokal.'}</p>
                                        <div className="text-emerald-700 font-bold text-sm">
                                            Rp {product.price?.toLocaleString('id-ID')}
                                        </div>
                                    </div>
                                </div>
                                <div className="p-5 pt-0">
                                    <a
                                        href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Halo, saya ingin bertanya mengenai produk ${product.name}. Apakah produk ini masih tersedia? Mohon informasi harga dan cara pembeliannya. Terima kasih.`)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(event) => event.stopPropagation()}
                                        className="pointer-events-auto relative z-20 w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 hover:shadow-md text-white font-semibold text-xs rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                                    >
                                        <ShoppingBag className="w-4 h-4" /> Beli Produk
                                    </a>
                                </div>
                            </article>
                        );
                    })}
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