// app/components/dashboard/admin/consignment/ConfirmSettlementModal.tsx
'use client';

import { X, CheckCircle2, AlertCircle } from 'lucide-react';

interface ConfirmSettlementModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    pendingCount: number;
    totalAmount: number;
    monthName?: string;
    year?: number;
    formatRupiah: (val: number) => string;
    loading: boolean;
    isSingle?: boolean; // Tambahan penanda jika 1 item saja
}

export default function ConfirmSettlementModal({
    isOpen,
    onClose,
    onConfirm,
    pendingCount,
    totalAmount,
    monthName,
    year,
    formatRupiah,
    loading,
    isSingle = false,
}: ConfirmSettlementModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-hidden animate-in fade-in duration-200">
            <div className="bg-white border border-slate-100 rounded-3xl w-full max-w-md flex flex-col overflow-hidden shadow-2xl">
                
                {/* Header Modal */}
                <div className="bg-emerald-50 p-5 border-b border-emerald-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-md">
                            <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
                                {isSingle ? 'Konfirmasi Pencairan Transaksi' : 'Konfirmasi Pencairan Dana EOM'}
                            </h3>
                            <p className="text-[11px] text-emerald-700 font-medium">
                                Rekapitulasi Bagi Hasil UMKM Sedyo Maju
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose} 
                        disabled={loading}
                        className="w-8 h-8 hover:bg-emerald-100 rounded-full flex items-center justify-center text-slate-500 transition cursor-pointer"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Body Modal */}
                <div className="p-6 space-y-4 text-xs">
                    <div className="bg-amber-50 border border-amber-200/60 rounded-2xl p-4 flex gap-3 text-amber-900">
                        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div className="leading-relaxed">
                            <span className="font-bold block mb-0.5">Perhatian!</span>
                            {isSingle ? (
                                <>Anda akan mencairkan hak pendapatan UMKM untuk <strong>1 transaksi terpilih</strong>.</>
                            ) : (
                                <>Anda akan mencairkan seluruh hak pendapatan UMKM yang berstatus <strong>Pending</strong> untuk periode <strong>{monthName} {year}</strong>.</>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2 pt-2">
                        <div className="flex justify-between py-2 border-b border-slate-100">
                            <span className="text-slate-500 font-medium">Jumlah Transaksi:</span>
                            <span className="font-bold text-slate-900">{pendingCount} Transaksi</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-100">
                            <span className="text-slate-500 font-medium">Total Dana Dicairkan:</span>
                            <span className="font-extrabold text-emerald-600 text-sm">{formatRupiah(totalAmount)}</span>
                        </div>
                    </div>

                    <p className="text-[11px] text-slate-400 italic">
                        *Setelah dikonfirmasi, status pencairan pada sistem akan berubah menjadi Lunas (Paid).
                    </p>
                </div>

                {/* Footer / Tombol Aksi */}
                <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-end gap-2">
                    <button 
                        type="button" 
                        onClick={onClose}
                        disabled={loading}
                        className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-semibold transition cursor-pointer text-xs"
                    >
                        Batal
                    </button>
                    <button 
                        type="button" 
                        onClick={onConfirm}
                        disabled={loading}
                        className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition shadow-sm cursor-pointer text-xs flex items-center gap-2 disabled:opacity-50"
                    >
                        {loading ? 'Memproses...' : 'Ya, Cairkan Sekarang'}
                    </button>
                </div>

            </div>
        </div>
    );
}