import Link from 'next/link';
import {
    ArrowRight,
    BadgeCheck,
    Check,
    ClipboardCheck,
    CookingPot,
    PackageCheck,
    ShieldCheck,
    Sparkles,
} from 'lucide-react';
import PublicNavbar from '@/app/components/public/PublicNavbar';
import PublicFooter from '@/app/components/public/PublicFooter';

const productionSteps = [
    {
        number: '01',
        title: 'Pemilihan Bahan',
        description:
            'Penerapan standar pengolahan pangan bersih dimulai dari pemilihan bahan, agar setiap camilan dibuat dari bahan yang baik dan layak.',
        icon: ClipboardCheck,
        tone: 'bg-emerald-100 text-emerald-700',
    },
    {
        number: '02',
        title: 'Pengolahan Bersih',
        description:
            'Adonan diolah secara higienis agar getuk kalis dan padat, kembang goyang mekar rapi, serta lempeng karak dijemur alami.',
        icon: CookingPot,
        tone: 'bg-amber-100 text-amber-700',
    },
    {
        number: '03',
        title: 'Pengemasan & Distribusi',
        description:
            'Produk dikemas rapi untuk menjaga kebersihannya saat dikirim ke pelanggan, lapak harian, maupun pesanan acara.',
        icon: PackageCheck,
        tone: 'bg-sky-100 text-sky-700',
    },
];

const credentials = ['Izin edar P-IRT', 'Nomor Induk Berusaha (NIB)', 'Sertifikat Halal'];

const whatsappMessage =
    'Halo UMKM Sedyomaju, saya tertarik dengan produk camilan tradisional Anda. Boleh minta informasi produk dan cara pemesanannya?';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
            <PublicNavbar />
            <main>
                <section className="relative isolate overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-800 text-white">
                    <div className="absolute -right-20 -top-20 -z-10 h-80 w-80 rounded-full bg-emerald-300/10 blur-3xl" />
                    <div className="absolute -bottom-28 left-1/4 -z-10 h-72 w-72 rounded-full bg-teal-200/10 blur-3xl" />
                    <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
                        <div>
                            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold tracking-wide text-emerald-100">
                                <Sparkles className="h-4 w-4" />
                                Cerita UMKM Lokal Ngoro-oro
                            </span>
                            <h1 className="mt-6 max-w-2xl text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                                Camilan Tradisional,
                                <span className="block text-emerald-200">Dibuat dengan Sepenuh Hati</span>
                            </h1>
                            <p className="mt-5 max-w-xl text-sm leading-7 text-emerald-50/90 sm:text-base">
                                Kelompok usaha bersama di Kalurahan Ngoro-oro yang memproduksi aneka camilan gurih dan manis. Diolah dengan higienis, berizin edar P-IRT, dan bersertifikat Halal untuk konsumsi harian, pesanan acara, hingga oleh-oleh.
                            </p>
                            <div className="mt-8 flex flex-wrap gap-3">
                                <a
                                    href={`https://wa.me/6281326358670?text=${encodeURIComponent(whatsappMessage)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-emerald-900 shadow-lg transition hover:-translate-y-0.5 hover:bg-emerald-50"
                                >
                                    Konsultasi Pesanan
                                    <ArrowRight className="h-4 w-4" />
                                </a>
                                <Link
                                    href="/#umkm"
                                    className="inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
                                >
                                    Lihat Produk UMKM
                                </Link>
                            </div>
                        </div>

                        <div className="relative mx-auto w-full max-w-xl">
                            <div className="absolute -inset-3 rotate-3 rounded-[2rem] bg-emerald-300/15" />
                            <div
                                role="img"
                                aria-label="Proses dan produk camilan UMKM Sedyomaju"
                                className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] border border-white/20 bg-emerald-950/40 bg-cover bg-center shadow-2xl"
                                style={{
                                    backgroundImage: 'url("https://umkmsedyomaju.com/wp-content/uploads/2026/10/ukm-sedyomaju4-1.jpg")',
                                }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/75 via-transparent to-transparent" />
                                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
                                    <div>
                                        <p className="text-xs font-semibold text-emerald-100">Kelompok Usaha Bersama</p>
                                        <p className="mt-1 text-xl font-extrabold">UMKM Sedyomaju</p>
                                    </div>
                                    <span className="rounded-full border border-white/20 bg-white/15 px-3 py-1.5 text-[10px] font-bold text-white backdrop-blur">
                                        Ngoro-oro
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
                    <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
                        <div>
                            <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-emerald-700">Kisah Kami</span>
                            <h2 className="mt-3 text-2xl font-black leading-tight text-slate-900 sm:text-3xl">
                                Kelompok Usaha Bersama Pengolah Camilan Tradisional Ngoro-oro
                            </h2>
                            <div className="mt-6 flex flex-wrap gap-2">
                                {credentials.map((credential) => (
                                    <span key={credential} className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-white px-3 py-2 text-[11px] font-bold text-emerald-800 shadow-sm">
                                        <Check className="h-3.5 w-3.5" />
                                        {credential}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-4 text-sm leading-7 text-slate-600 sm:text-base">
                            <p>
                                UMKM Sedyomaju berdiri sebagai kelompok usaha bersama di Kalurahan Ngoro-oro yang berfokus memproduksi aneka camilan olahan pangan tradisional. Melalui kelompok ini, proses produksi dijalankan dengan standar higienis dan telah mengantongi izin edar P-IRT, NIB, serta Sertifikat Halal resmi.
                            </p>
                            <p>
                                Ragam produk yang dihasilkan mencakup getuk goreng, kembang goyang, lempeng karak mentah, hingga tape singkong. Setiap produk diolah secara bersih dan dikemas rapi untuk melayani kebutuhan konsumsi harian warga, pesanan acara atau katering, maupun oleh-oleh.
                            </p>
                        </div>
                    </div>

                    <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
                        {[
                            { value: '3', label: 'Legalitas Resmi', icon: ShieldCheck },
                            { value: '5+', label: 'Tahun Berpengalaman', icon: BadgeCheck },
                            { value: '600+', label: 'Pesanan Selesai', icon: Check },
                        ].map(({ value, label, icon: Icon }) => (
                            <article key={label} className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                                    <Icon className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-2xl font-black text-slate-900">{value}</p>
                                    <p className="mt-0.5 text-xs font-semibold text-slate-500">{label}</p>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="border-y border-slate-100 bg-white py-16 sm:py-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl text-center">
                            <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-emerald-700">Proses Pembuatan</span>
                            <h2 className="mt-3 text-2xl font-black text-slate-900 sm:text-3xl">Tahapan Produksi UMKM Sedyomaju</h2>
                            <p className="mt-3 text-sm leading-6 text-slate-500">
                                Dari pemilihan bahan hingga sampai ke tangan pelanggan, setiap tahap dijaga dengan perhatian dan kebersihan.
                            </p>
                        </div>

                        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
                            {productionSteps.map((step) => {
                                const Icon = step.icon;
                                return (
                                    <article key={step.number} className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-slate-50/70 p-6 transition hover:-translate-y-1 hover:border-emerald-200 hover:bg-white hover:shadow-xl">
                                        <span className="absolute right-5 top-3 text-5xl font-black text-slate-100 transition group-hover:text-emerald-50">{step.number}</span>
                                        <div className={`relative flex h-12 w-12 items-center justify-center rounded-2xl ${step.tone}`}>
                                            <Icon className="h-6 w-6" />
                                        </div>
                                        <h3 className="relative mt-5 text-lg font-extrabold text-slate-900">{step.title}</h3>
                                        <p className="relative mt-2 text-sm leading-6 text-slate-600">{step.description}</p>
                                    </article>
                                );
                            })}
                        </div>
                    </div>
                </section>

                <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
                    <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-700 px-6 py-10 text-center text-white shadow-xl sm:px-12 sm:py-14">
                        <div className="absolute -right-12 -top-24 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
                        <div className="absolute -bottom-28 -left-12 h-64 w-64 rounded-full bg-teal-300/10 blur-2xl" />
                        <div className="relative mx-auto max-w-2xl">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10">
                                <Sparkles className="h-6 w-6 text-emerald-100" />
                            </div>
                            <h2 className="mt-5 text-2xl font-black sm:text-3xl">
                                Siap Menyediakan Camilan untuk Acara atau Oleh-oleh Anda?
                            </h2>
                            <p className="mt-3 text-sm leading-6 text-emerald-50 sm:text-base">
                                Hubungi kami untuk konsultasi pesanan katering hajatan, stok oleh-oleh wisata, atau paket kudapan rapat.
                            </p>
                            <a
                                href={`https://wa.me/6281326358670?text=${encodeURIComponent(whatsappMessage)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-extrabold text-emerald-900 shadow-lg transition hover:-translate-y-0.5 hover:bg-emerald-50"
                            >
                                Konsultasi Pesanan via WhatsApp
                                <ArrowRight className="h-4 w-4" />
                            </a>
                        </div>
                    </div>
                </section>
            </main>
            <PublicFooter />
        </div>
    );
}
