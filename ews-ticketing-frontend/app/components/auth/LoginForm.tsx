'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/app/lib/axios';
import { Mail, Eye, EyeOff, AlertCircle, Loader2, Shield, ArrowRight } from 'lucide-react';

export default function LoginForm() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberDevice, setRememberDevice] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Panggil API Login
            const response = await apiClient.post('/auth/login', {
                email,
                password,
            });

            const { access_token, user } = response.data;

            // Simpan ke localStorage
            localStorage.setItem('auth_token', access_token);
            localStorage.setItem('user_role', user.role);

            // Simpan ke Cookie untuk Middleware Next.js
            const maxAge = rememberDevice ? 30 * 24 * 60 * 60 : 24 * 60 * 60;
            document.cookie = `auth_token=${access_token}; path=/; max-age=${maxAge}; SameSite=Lax`;
            document.cookie = `user_role=${user.role}; path=/; max-age=${maxAge}; SameSite=Lax`;

            // Redirect berdasarkan role
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
        } catch (err: any) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Terjadi kesalahan pada server atau kredensial tidak valid.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto flex flex-col justify-between h-full min-h-[650px] py-2">
            <div>
                {/* Logo & Header */}
                <div className="flex flex-col items-center mb-6">
                    <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl mb-4 border border-slate-800">
                        <span className="text-lg font-bold tracking-tighter">⊙</span>
                    </div>
                    <span className="text-[11px] font-bold tracking-widest text-indigo-600 uppercase">SMART TOURISM PORTAL</span>
                    <h2 className="text-2xl font-bold text-gray-900 mt-1">Welcome back</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Enter your administrative credentials to continue</p>
                </div>

                {/* SSO Buttons */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                    <button
                        type="button"
                        className="flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 hover:bg-gray-50 transition shadow-sm"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.19v3.15C3.17 21.32 7.23 24 12 24z"/>
                            <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.19C.43 8.12 0 9.87 0 12s.43 3.88 1.19 5.42l4.09-3.15z"/>
                            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.23 0 3.17 2.68 1.19 6.58l4.09 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                        </svg>
                        Google SSO
                    </button>
                    <button
                        type="button"
                        className="flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 hover:bg-gray-50 transition shadow-sm"
                    >
                        <Shield className="w-4 h-4 text-indigo-600" />
                        SAML / Okta
                    </button>
                </div>

                {/* Divider */}
                <div className="relative flex items-center justify-center mb-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200" />
                    </div>
                    <span className="relative px-3 bg-white text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
                        OR SIGN IN WITH EMAIL
                    </span>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-2 text-sm">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5">Email address</label>
                        <div className="relative">
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@company.com"
                                className="w-full pl-4 pr-10 py-3 bg-white border text-gray-700 border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none text-sm transition"
                            />
                            <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-gray-400">
                                <Mail className="w-4 h-4" />
                            </span>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-1.5">
                            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600">Password</label>
                            <a href="#" className="text-xs font-medium text-indigo-600 hover:text-indigo-700">Forgot password?</a>
                        </div>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full pl-4 pr-10 text-gray-700 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none text-sm transition"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center pt-1">
                        <label className="flex items-center gap-2.5 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={rememberDevice}
                                onChange={(e) => setRememberDevice(e.target.checked)}
                                className="w-4 h-4 rounded border-gray-300 text-slate-900 focus:ring-slate-900"
                            />
                            <span className="text-xs text-gray-600">Remember this device (30d)</span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 rounded-xl transition duration-200 flex items-center justify-center gap-2 text-sm shadow-lg shadow-slate-900/10 mt-2"
                    >
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        <span>{loading ? 'Signing In...' : 'Sign In to Dashboard'}</span>
                        {!loading && <ArrowRight className="w-4 h-4" />}
                    </button>
                </form>

                <div className="text-center mt-4">
                    <p className="text-xs text-gray-500">
                        Need administrative access? <a href="#" className="text-indigo-600 font-medium hover:underline">Contact Security Ops</a>
                    </p>
                </div>
            </div>

            {/* Bottom Footer Links */}
            <div className="text-[11px] text-gray-400 flex justify-between items-center pt-4 border-t border-gray-100 mt-8">
                <span>© 2026 Aether Technologies</span>
                <div className="flex gap-4">
                    <a href="#" className="hover:text-gray-600">Security Policy</a>
                    <a href="#" className="hover:text-gray-600">Audit Logs</a>
                    <a href="#" className="hover:text-gray-600">Support Desk</a>
                </div>
            </div>
        </div>
    );
}