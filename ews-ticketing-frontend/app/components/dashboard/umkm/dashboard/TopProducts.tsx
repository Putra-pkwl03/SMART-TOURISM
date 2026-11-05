import Link from 'next/link';
import { ArrowRight, Box, ShoppingBag, Store } from 'lucide-react';
import { getBackendUrl } from '@/app/lib/backend-url';
import type { UmkmTopProduct } from './types';

const formatNumber = (value: number) => new Intl.NumberFormat('id-ID').format(value);
const formatRupiah = (value: number) => `Rp ${formatNumber(value)}`;

export default function TopProducts({ products }: { products: UmkmTopProduct[] }) {
    const backendUrl = getBackendUrl();

    return (
        <section className="min-w-0 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <h2 className="flex items-center gap-2 text-base font-extrabold text-slate-900">
                    <Store className="h-5 w-5 text-emerald-700" />
                    Produk Terlaris
                </h2>
                <Link href="/dashboard/umkm/products" className="inline-flex items-center gap-1 text-sm font-bold text-emerald-700 hover:text-emerald-800">
                    Lihat Semua <ArrowRight className="h-4 w-4" />
                </Link>
            </div>

            {products.length ? (
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[620px] text-left text-sm">
                        <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-500">
                            <tr>
                                <th className="rounded-l-lg px-3 py-3">#</th>
                                <th className="px-3 py-3">Nama Produk</th>
                                <th className="px-3 py-3">Terjual</th>
                                <th className="px-3 py-3">Total Penjualan</th>
                                <th className="rounded-r-lg px-3 py-3">Status Stok</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {products.map((product, index) => (
                                <tr key={product.id} className="text-slate-700">
                                    <td className="px-3 py-3.5 font-bold text-slate-500">{index + 1}</td>
                                    <td className="px-3 py-3.5">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 bg-cover bg-center text-slate-400"
                                                style={product.image_path ? { backgroundImage: `url("${backendUrl}/storage/${product.image_path}")` } : undefined}
                                                role="img"
                                                aria-label={product.name}
                                            >
                                                {!product.image_path && <Box className="h-5 w-5" />}
                                            </div>
                                            <span className="max-w-56 truncate font-bold text-slate-800">{product.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-3 py-3.5 font-semibold">{formatNumber(product.sold_quantity)} pcs</td>
                                    <td className="px-3 py-3.5 font-bold text-slate-800">{formatRupiah(product.gross_sales)}</td>
                                    <td className="px-3 py-3.5">
                                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${product.stock <= 5 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                                            <span className={`h-1.5 w-1.5 rounded-full ${product.stock <= 5 ? 'bg-amber-500' : 'bg-emerald-600'}`} />
                                            {product.stock <= 5 ? 'Hampir Habis' : 'Stok Aman'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="flex min-h-36 flex-col items-center justify-center gap-2 text-center text-sm text-slate-500">
                    <ShoppingBag className="h-7 w-7 text-slate-300" />
                    Belum ada penjualan pada bulan ini.
                </div>
            )}
        </section>
    );
}
