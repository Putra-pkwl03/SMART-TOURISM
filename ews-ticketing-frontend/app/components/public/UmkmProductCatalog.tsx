'use client';

import { useState } from 'react';
import { ShoppingBag, Package, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

interface UmkmProductCatalogProps {
    products: any[];
    loading: boolean;
}

export default function UmkmProductCatalog({ products, loading }: UmkmProductCatalogProps) {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

    // State untuk melacak indeks gambar yang aktif untuk setiap produk (berdasarkan product.id)
    const [activeImageIndexes, setActiveImageIndexes] = useState<{ [key: number]: number }>({});

    const handleImageChange = (productId: number, index: number) => {
        setActiveImageIndexes(prev => ({ ...prev, [productId]: index }));
    };

    return (
        <section id="umkm" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 scroll-mt-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
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
            </div>

            {loading ? (
                <div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product) => {
                        const images = product.images || [];
                        const activeIndex = activeImageIndexes[product.id] || 0;
                        
                        // Pilih gambar aktif, fallback ke gambar utama (is_primary), atau placeholder
                        const currentImage = images[activeIndex] || images.find((img: any) => img.is_primary) || images[0];
                        const imageUrl = currentImage ? `${backendUrl}/storage/${currentImage.image_path}` : '/images/placeholder.jpg';

                        return (
                            <div key={product.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-emerald-200 overflow-hidden flex flex-col justify-between group transition-all duration-300">
                                <div>
                                    {/* Bagian Gambar Produk & Multi-Image Preview */}
                                    <div className="relative h-48 bg-slate-100 overflow-hidden">
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
                                            {images.map((img: any, idx: number) => (
                                                <button
                                                    key={img.id}
                                                    onClick={() => handleImageChange(product.id, idx)}
                                                    className={`w-10 h-10 rounded-lg overflow-hidden border-2 transition shrink-0 ${activeIndex === idx ? 'border-emerald-600 scale-95 shadow-sm' : 'border-transparent opacity-70 hover:opacity-100'}`}
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
                                    <button 
                                        onClick={() => {
                                            toast.info(`Fitur keranjang untuk produk "${product.name}" segera hadir!`);
                                        }}
                                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 hover:shadow-md text-white font-semibold text-xs rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                                    >
                                        <ShoppingBag className="w-4 h-4" /> Beli Produk
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
}