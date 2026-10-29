import LoginHero from '@/app/components/auth/LoginHero';
import LoginForm from '@/app/components/auth/LoginForm';

export default function LoginPage() {
    return (
        <main className="min-h-screen flex w-full bg-white">
            {/* Sisi Kiri: Branding & Informasi Sistem */}
            <LoginHero />

            {/* Sisi Kanan: Form Login */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12">
                <LoginForm />
            </div>
        </main>
    );
}