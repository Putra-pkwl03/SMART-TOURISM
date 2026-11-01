'use client';

import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface DeleteConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    itemName?: string;
    loading?: boolean;
}

export default function DeleteConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    itemName,
    loading = false,
}: DeleteConfirmModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 overflow-hidden">
                <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
                        <AlertTriangle className="w-6 h-6" />
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 rounded-xl transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-1">
                    <h3 className="text-base font-bold text-slate-900">Konfirmasi Hapus Destinasi</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                        Apakah Anda yakin ingin menghapus <span className="font-semibold text-slate-800">"{itemName || 'item ini'}"</span>? Tindakan ini tidak dapat dibatalkan dan akan menghapus data terkait secara permanen.
                    </p>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
                    >
                        Batal
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={loading}
                        className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 shadow-lg shadow-rose-600/20 transition cursor-pointer flex items-center gap-2"
                    >
                        {loading ? 'Menghapus...' : 'Ya, Hapus'}
                    </button>
                </div>
            </div>
        </div>
    );
}