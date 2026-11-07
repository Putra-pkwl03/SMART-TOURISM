'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { isAxiosError } from 'axios';
import { apiClient } from '@/app/lib/axios';
import { persistAuthSession } from '@/app/lib/auth-session';
import { AlertCircle, ArrowRight, Eye, EyeOff, Loader2, Mail, Lock } from 'lucide-react';

export default function LoginForm() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await apiClient.post('/auth/login', {
                email,
                password,
            });

            const { access_token, expires_in, user } = response.data;
            persistAuthSession(access_token, user, expires_in);

            switch (user.role) {
                case 'admin':
                    router.push('/dashboard/admin');
                    break;
                case 'ticketing_officer':
                    router.push('/dashboard/loket');
                    break;
                case 'umkm_mitra':
                    router.push('/dashboard/umkm');
                    break;
                default:
                    router.push('/');
                    break;
            }
        } catch (error: unknown) {
            if (isAxiosError<{ message?: string }>(error) && error.response?.data?.message) {
                setError(error.response.data.message);
            } else {
                setError('Terjadi kesalahan pada server atau kredensial tidak valid.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="relative z-10 -mt-7 flex w-full flex-1 items-center justify-center overflow-hidden rounded-t-[2.5rem] bg-white px-6 py-10 backdrop-blur-md sm:px-12 lg:-ml-7 lg:mt-0 lg:min-h-screen lg:w-[46%] lg:flex-none lg:rounded-l-[2.5rem] lg:rounded-tr-none lg:px-12 lg:py-10 shadow-2xl">

            {/* Glowing background effect */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-100/40 blur-3xl" />

            <div className="relative z-10 w-full max-w-[420px]">
                <header className="mb-6 text-center">
                    <Link href="/" className="mb-2 inline-flex" aria-label="SmartMandala beranda">
                        <Image
                            src="/images/logo1.png"
                            alt="SmartMandala"
                            width={140}
                            height={90}
                            className="h-[90px] w-[160px] object-contain"
                            priority
                        />
                    </Link>
                    <p className="text-xs font-semibold text-slate-800">Smart Tourism Portal</p>
                    <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
                        Welcome Back <span aria-hidden="true"></span>
                    </h2>
                    <p className="mt-1.5 text-xs text-slate-500">
                        Enter your administrative credentials to continue
                    </p>
                </header>

                {error && (
                    <div
                        role="alert"
                        className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700"
                    >
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label htmlFor="login-email" className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                            <Mail className="h-3.5 w-3.5 text-slate-700" />
                            Email Address
                        </label>
                        <div className="relative">
                            <input
                                id="login-email"
                                type="email"
                                autoComplete="username"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@company.com"
                                className="w-full rounded-full border border-slate-200 bg-white py-3 pl-4 pr-10 text-xs text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10"
                            />
                            <Mail className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="login-password" className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                            <Lock className="h-3.5 w-3.5 text-slate-700" />
                            Password
                        </label>
                        <div className="relative">
                            <input
                                id="login-password"
                                type={showPassword ? 'text' : 'password'}
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Masukkan password Anda"
                                className="w-full rounded-full border border-slate-200 bg-white py-3 pl-4 pr-10 text-xs text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((visible) => !visible)}
                                aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 transition hover:text-slate-700"
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-xs">
                        <label className="flex items-center gap-2 text-slate-600">
                            <input type="checkbox" className="h-3.5 w-3.5 rounded border-slate-300 accent-emerald-700" />
                            Remember me
                        </label>
                        <a href="#" className="font-semibold text-emerald-700 hover:underline">
                            Lupa password?
                        </a>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="cursor-pointer mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-emerald-800 py-3 text-xs font-semibold text-white shadow-md shadow-emerald-900/10 transition hover:bg-emerald-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-600/20 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Memproses...
                            </>
                        ) : (
                            <>
                                <ArrowRight className="h-4 w-4" />
                                <span>Sign In</span>
                            </>
                        )}
                    </button>
                </form>

                <div className="my-4 flex items-center gap-3 text-[10px] text-slate-400">
                    <span className="h-px flex-1 bg-slate-200" />
                    atau
                    <span className="h-px flex-1 bg-slate-200" />
                </div>

                <Link
                    href="/auth/users/login"
                    className="flex w-full items-center justify-center gap-2.5 rounded-full border border-slate-200 bg-white py-2.5 text-xs font-medium text-slate-600 transition hover:border-emerald-200 hover:bg-emerald-50/50"
                >
                    <svg className="h-4 w-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    Login dengan Google
                </Link>

                <p className="mt-8 text-center text-[10px] text-slate-400">
                    © 2026 SmartMandala. Semua hak dilindungi.
                </p>
            </div>

            {/* Siluet Candi di Pojok Kanan Bawah */}
            <div className="pointer-events-none absolute bottom-0 right-0 z-0 opacity-15">
                <svg className="h-24 w-40 text-emerald-900" viewBox="0 0 200 100" fill="currentColor">
                    <path d="M10,100 L20,80 L30,80 L30,60 L40,60 L40,40 L50,40 L50,20 L60,20 L60,0 L70,20 L70,40 L80,40 L80,60 L90,60 L90,80 L100,80 L110,100 Z" />
                    <path d="M120,100 L130,85 L140,85 L140,70 L150,70 L150,50 L160,50 L160,30 L170,50 L170,70 L180,70 L180,85 L190,85 L200,100 Z" />
                </svg>
            </div>
        </section>
    );
}