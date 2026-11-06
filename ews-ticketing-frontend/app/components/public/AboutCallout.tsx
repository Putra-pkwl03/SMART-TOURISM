import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Leaf } from 'lucide-react';

export default function AboutCallout() {
    return (
        <section className="mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8 lg:pb-2 -mt-6">
            <div className="relative isolate overflow-hidden rounded-3xl border border-emerald-900/10 bg-emerald-950 shadow-lg">
                <Image
                    src="/hero-ngoro-oro.png"
                    alt=""
                    aria-hidden="true"
                    fill
                    sizes="(min-width: 1280px) 1280px, 100vw"
                    className="object-cover object-[62%_center]"
                />
                <div className="absolute inset-0 z-10 bg-gradient-to-r from-emerald-950 via-emerald-950/85 to-emerald-950/15" />
                <div className="relative z-20 flex min-h-44 flex-col items-start gap-5 p-6 sm:min-h-48 sm:flex-row sm:items-center sm:justify-between sm:px-9 sm:py-7 lg:px-12">
                    <div className="flex items-start gap-4 sm:items-center">
                        <span className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-200 sm:flex">
                            <Leaf className="h-7 w-7" />
                        </span>
                        <div>
                            <h2 className="max-w-2xl text-xl font-extrabold leading-tight text-white sm:text-2xl">
                                Dukung Wisata Lokal,
                                <span className="block text-emerald-200">Bangun Ekonomi Desa</span>
                            </h2>
                            <p className="mt-2 max-w-xl text-xs leading-5 text-emerald-50/85 sm:text-sm">
                                Bersama SmartMandala, wujudkan desa mandiri dan berdaya saing.
                            </p>
                        </div>
                    </div>
                    <Link
                        href="/tentang"
                        className="inline-flex shrink-0 items-center gap-2 rounded-full bg-amber-400 px-5 py-3 text-xs font-extrabold text-emerald-950 shadow-md transition hover:-translate-y-0.5 hover:bg-amber-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                        Pelajari Lebih Lanjut
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
