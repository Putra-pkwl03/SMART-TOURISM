import Link from 'next/link';
import { ArrowRight, Store } from 'lucide-react';

export default function GrowthCard() {
    return (
        <aside className="flex min-h-52 flex-col justify-between gap-5 overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-emerald-100/80 p-5 shadow-sm sm:p-6">
            <div>
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                    <Store className="h-6 w-6" />
                </div>
                <h2 className="text-lg font-extrabold leading-snug text-emerald-900">Kembangkan UMKM Lokal</h2>
                <p className="mt-2 text-sm leading-relaxed text-emerald-800">Kelola produk dan stok agar semakin banyak wisatawan mengenal produk unggulan Anda.</p>
            </div>
            <Link href="/dashboard/umkm/products" className="inline-flex w-fit items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800">
                Kelola Produk <ArrowRight className="h-4 w-4" />
            </Link>
        </aside>
    );
}
