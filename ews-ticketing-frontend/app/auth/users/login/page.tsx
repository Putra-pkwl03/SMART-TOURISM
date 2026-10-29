'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, ArrowRight, Loader2, ShieldCheck, Ticket } from 'lucide-react';
import { apiClient } from '@/app/lib/axios';
import { toast } from 'sonner';

import PublicNavbar from '@/app/components/public/PublicNavbar';
import PublicFooter from '@/app/components/public/PublicFooter';

export default function UserAuthPage() {
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(true); // true = Login, false = Register
    const [loading, setLoading] = useState(false);

    // Form States
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');

    const handleAuthSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isLogin) {
                // Proses Login
                const res = await apiClient.post('/auth/login', { email, password });
                const { access_token, user } = res.data;

                // Simpan ke LocalStorage
                localStorage.setItem('token', access_token);
                localStorage.setItem('user', JSON.stringify(user));

                // Simpan ke Cookie agar Middleware Next.js dapat membacanya
                document.cookie = `auth_token=${access_token}; path=/; max-age=86400; SameSite=Lax`;
                document.cookie = `user_role=${user.role}; path=/; max-age=86400; SameSite=Lax`;

                toast.success(`Selamat datang kembali, ${user.name}!`);
                
                // Jika role visitor, lempar ke beranda atau riwayat tiket. Jika role lain sesuaikan.
                if (user.role === 'visitor') {
                    router.push('/');
                } else {
                    router.push('/dashboard/admin');
                }
            } else {
                // Proses Registrasi (Pastikan endpoint /auth/register tersedia di Laravel)
                if (password !== passwordConfirmation) {
                    toast.error('Konfirmasi password tidak cocok.');
                    setLoading(false);
                    return;
                }

                await apiClient.post('/auth/register', {
                    name,
                    email,
                    password,
                    password_confirmation: passwordConfirmation,
                    role: 'visitor' // Default role sebagai visitor
                });

                toast.success('Registrasi berhasil! Silakan masuk dengan akun Anda.');
                setIsLogin(true); // Pindah ke tab login
                setPassword('');
                setPasswordConfirmation('');
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Terjadi kesalahan pada sistem.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            {/* Navbar Publik */}
            <PublicNavbar />

            {/* Konten Utama Auth */}
            <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-slate-100">
                    
                    {/* Header Info */}
                    <div className="text-center space-y-2">
                        <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl mx-auto flex items-center justify-center shadow-inner">
                            <Ticket className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-extrabold text-slate-900">
                            {isLogin ? 'Masuk ke Akun Anda' : 'Daftar Akun Wisatawan'}
                        </h2>
                        <p className="text-xs text-slate-500">
                            {isLogin 
                                ? 'Kelola pemesanan tiket wisata dan paket UMKM Sedyo Maju dengan mudah' 
                                : 'Buat akun baru untuk mulai memesan tiket destinasi wisata secara online'}
                        </p>
                    </div>

                    {/* Tab Switcher (Masuk / Daftar) */}
                    <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                        <button
                            type="button"
                            onClick={() => setIsLogin(true)}
                            className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
                                isLogin ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            Masuk
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsLogin(false)}
                            className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
                                !isLogin ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            Daftar
                        </button>
                    </div>

                    {/* Form Input */}
                    <form onSubmit={handleAuthSubmit} className="space-y-4">
                        {!isLogin && (
                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">Nama Lengkap</label>
                                <div className="relative">
                                    <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                                    <input 
                                        type="text"
                                        required
                                        placeholder="Nama lengkap Anda"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:bg-white focus:ring-2 focus:ring-emerald-600 outline-none transition"
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">Alamat Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                                <input 
                                    type="email"
                                    required
                                    placeholder="nama@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:bg-white focus:ring-2 focus:ring-emerald-600 outline-none transition"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">Kata Sandi (Password)</label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                                <input 
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:bg-white focus:ring-2 focus:ring-emerald-600 outline-none transition"
                                />
                            </div>
                        </div>

                        {!isLogin && (
                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">Konfirmasi Kata Sandi</label>
                                <div className="relative">
                                    <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                                    <input 
                                        type="password"
                                        required
                                        placeholder="Ulangi kata sandi"
                                        value={passwordConfirmation}
                                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:bg-white focus:ring-2 focus:ring-emerald-600 outline-none transition"
                                    />
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 transition flex items-center justify-center gap-2 cursor-pointer mt-2"
                        >
                            {loading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <>
                                    <span>{isLogin ? 'Masuk Sekarang' : 'Daftar Akun Baru'}</span>
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer Info Tambahan */}
                    <div className="text-center pt-4 border-t border-slate-100">
                        <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Keamanan data transaksi & akun terenkripsi</span>
                        </p>
                    </div>

                </div>
            </main>

            {/* Footer Publik */}
            <PublicFooter />
        </div>
    );
}