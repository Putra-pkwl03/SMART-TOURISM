import LoginHero from '@/app/components/auth/LoginHero';
import LoginForm from '@/app/components/auth/LoginForm';

export default function LoginPage() {
    return (
        <main className="relative flex min-h-screen w-full flex-col justify-between overflow-hidden bg-slate-950 lg:flex-row">
            {/* Background Gambar Utama Menyeluruh */}
            <div
                className="absolute inset-0 bg-cover bg-center lg:bg-[position:57%_center]"
                style={{ backgroundImage: "url('/images/loginbg.webp')" }}
                aria-hidden="true"
            />
            {/* Overlay Gradasi Gelap Menyeluruh */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#002f2b]/90 via-[#003b34]/60 to-slate-950/20 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-slate-950/10 pointer-events-none" />

            {/* Komponen Hero & Form */}
            <LoginHero />
            <LoginForm />
        </main>
    );
}