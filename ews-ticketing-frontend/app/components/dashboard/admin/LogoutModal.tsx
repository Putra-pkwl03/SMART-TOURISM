'use client';

import { LogOut, AlertTriangle, X } from 'lucide-react';

interface LogoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    loading: boolean;
}

export default function LogoutModal({ isOpen, onClose, onConfirm, loading }: LogoutModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm transition-opacity">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 transform transition-all animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5" />
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-1">Konfirmasi Keluar Sistem</h3>
                <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                    Apakah Anda yakin ingin mengakhiri sesi ini? Anda harus memasukkan kredensial kembali untuk masuk ke panel admin.
                </p>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                    >
                        Batal
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={loading}
                        className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-xs font-semibold text-white shadow-lg shadow-red-600/20 transition flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <span>Memproses...</span>
                        ) : (
                            <>
                                <LogOut className="w-4 h-4" />
                                <span>Ya, Keluar</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}