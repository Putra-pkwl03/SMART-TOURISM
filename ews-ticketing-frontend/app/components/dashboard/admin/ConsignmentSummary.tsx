import Link from 'next/link';
import { Package } from 'lucide-react';
import type { ConsignmentDashboardProduct } from '@/app/lib/admin-dashboard';
import { getBackendUrl } from '@/app/lib/backend-url';

interface ConsignmentSummaryProps {
    products: ConsignmentDashboardProduct[];
}

export default function ConsignmentSummary({ products }: ConsignmentSummaryProps) {
    const backendUrl = getBackendUrl();

    return (
        <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
            <div className="flex items-center justify-between gap-2 border-b border-slate-100 p-6 sm:px-5">
                <div>
                    <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                        <Package className="h-4 w-4 shrink-0 text-emerald-600" />
                        Ringkasan Konsinyasi UMKM
                    </h3>
                    <p className="mt-1 text-[11px] text-slate-500">Stok produk titipan</p>
                </div>
                <Link
                    href="/dashboard/admin/consignment"
                    className="shrink-0 text-[10px] font-semibold text-blue-600 hover:underline sm:text-[11px]"
                >
                    Lihat Laporan →
                </Link>
            </div>

            {products.length ? (
                <div className="divide-y divide-slate-100">
                    {products.map((product) => {
                        const imageUrl = product.image_path
                            ? /^https?:\/\//i.test(product.image_path)
                                ? product.image_path
                                : `${backendUrl}/storage/${product.image_path.replace(/^\/?storage\//, '')}`
                            : null;

                        return (
                            <div key={product.id} className="flex items-center gap-2.5 px-4 py-3 sm:gap-3 sm:px-5">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-amber-50 text-amber-600">
                                    {imageUrl ? (
                                        <div
                                            role="img"
                                            aria-label={product.name}
                                            className="h-full w-full bg-cover bg-center"
                                            style={{ backgroundImage: `url("${imageUrl}")` }}
                                        />
                                    ) : (
                                        <Package className="h-5 w-5" />
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-xs font-bold text-slate-800">{product.name}</p>
                                    <p className="text-[10px] text-slate-500">Stok tersedia</p>
                                </div>
                                <p className="shrink-0 text-xs font-extrabold text-slate-900 sm:text-sm">
                                    {product.stock} Pcs
                                </p>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <p className="p-5 text-xs text-slate-400">Belum ada produk konsinyasi aktif.</p>
            )}
        </section>
    );
}
