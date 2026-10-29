'use client';

import { MapPin, ArrowRight, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation'; // Import router

interface DestinationCatalogProps {
    destinations: any[];
    loading: boolean;
}

export default function DestinationCatalog({ destinations, loading }: DestinationCatalogProps) {
    const router = useRouter();
    const BACKEND_URL = 'http://127.0.0.1:8000';

    return (
        <section id="destinasi" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
                <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 mb-2 block">Destinasi Populer</span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Jelajahi Destinasi Wisata Unggulan</h3>
                    <p className="text-sm text-slate-500 mt-1">Nikmati keindahan alam, tantangan petualangan, dan pengalaman tak terlupakan di Ngoro-Oro.</p>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-2">
                    <Loader2 className="w-6 h-6 animate-spin text-emerald-700" />
                    <span className="text-xs">Memuat katalog destinasi...</span>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {destinations.map((dest) => {
                        const imageUrl = dest.image_url 
                            ? (dest.image_url.startsWith('http') ? dest.image_url : `${BACKEND_URL}${dest.image_url}`)
                            : '/destinasi-jurug-gedhe.jpg';

                        return (
                            <div 
                                key={dest.id} 
                                onClick={() => router.push(`/destinations/${dest.id}`)} // Pindah ke New Page berdasarkan ID
                                className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between group hover:shadow-xl hover:border-emerald-200 cursor-pointer transition duration-300"
                            >
                                <div>
                                    <div className="h-48 bg-slate-200 relative overflow-hidden">
                                        <div 
                                            className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition duration-500"
                                            style={{ backgroundImage: `url('${imageUrl}')` }}
                                        />
                                        <div className="absolute top-3 left-3">
                                            <span className="px-2.5 py-1 rounded-full bg-slate-900/60 backdrop-blur-md text-white font-bold text-[10px] uppercase">
                                                Alam / Air Terjun
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <h4 className="font-bold text-slate-900 text-base mb-1 group-hover:text-emerald-700 transition">{dest.name}</h4>
                                        <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">{dest.description || 'Nikmati panorama tebing dan keindahan alam eksotis.'}</p>
                                    </div>
                                </div>

                                <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-50 mt-4">
                                    <p className="text-xs text-slate-500 flex items-center gap-1">
                                        <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                                        <span>{dest.location || 'Ngoro-Oro, Patuk'}</span>
                                    </p>
                                    <div className="p-2 bg-slate-100 group-hover:bg-emerald-600 group-hover:text-white rounded-xl transition">
                                        <ArrowRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
}