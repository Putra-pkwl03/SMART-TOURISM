'use client';

import { useState } from 'react';
import { X, QrCode, CreditCard, UploadCloud, ShieldCheck, Loader2, CheckCircle2, AlertCircle, Ticket } from 'lucide-react';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    totalPrice: number;
    destinationName: string; // Nama destinasi yang diambil dari halaman detail
    ticketCount: number;     // Jumlah tiket yang dibeli
    onSubmit: (method: string, file: File) => void;
    submitting: boolean;
}

export default function PaymentModal({ 
    isOpen, 
    onClose, 
    totalPrice, 
    destinationName, 
    ticketCount, 
    onSubmit, 
    submitting 
}: PaymentModalProps) {
    const [selectedMethod, setSelectedMethod] = useState('qris_all');
    const [proofFile, setProofFile] = useState<File | null>(null);
    const [proofPreview, setProofPreview] = useState<string>('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!proofFile) return;
        onSubmit(selectedMethod, proofFile);
    };

    const bankDetails: Record<string, { name: string; number: string; holder: string }> = {
        bca: { name: 'Bank BCA', number: '123-456-7890', holder: 'Pokdarwis Jurug Gedhe' },
        mandiri: { name: 'Bank Mandiri', number: '987-654-3210', holder: 'Pokdarwis Jurug Gedhe' },
        bri: { name: 'Bank BRI', number: '456-123-7890', holder: 'Pokdarwis Jurug Gedhe' },
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden">
                
                {/* Header Modal yang Informatif */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
                    <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                            Konfirmasi Pembayaran
                        </span>
                        <h3 className="text-base font-extrabold text-slate-900 mt-1">Selesaikan Pembayaran Tiket Anda</h3>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="p-2 text-slate-400 hover:text-slate-700 rounded-2xl hover:bg-slate-200/60 transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body Modal */}
                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
                    
                    {/* Ringkasan Informasi Destinasi & Total Tagihan */}
                    <div className="bg-gradient-to-br from-emerald-900 to-emerald-800 rounded-2xl p-5 text-white shadow-lg shadow-emerald-900/10 space-y-3">
                        <div className="flex items-center gap-2 text-emerald-200 text-xs font-semibold">
                            <Ticket className="w-4 h-4" />
                            <span>Detail Pemesanan Tiket</span>
                        </div>
                        <div>
                            <h4 className="text-lg font-extrabold">{destinationName || 'Destinasi Wisata'}</h4>
                            <p className="text-xs text-emerald-100 mt-0.5 font-medium">Jumlah Tiket: <strong>{ticketCount} Orang</strong></p>
                        </div>
                        <div className="pt-3 border-t border-emerald-700/60 flex items-center justify-between">
                            <span className="text-xs text-emerald-200 uppercase font-bold tracking-wider">Total Yang Harus Dibayar</span>
                            <span className="text-xl sm:text-2xl font-extrabold">Rp {totalPrice.toLocaleString('id-ID')}</span>
                        </div>
                    </div>

                    {/* Pilihan Metode Pembayaran */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
                            Pilih Metode Pembayaran
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                            {[
                                { id: 'qris_all', label: 'QRIS', sub: 'All Payment', icon: QrCode, color: 'text-emerald-700' },
                                { id: 'bca', label: 'Bank BCA', sub: 'Transfer', icon: CreditCard, color: 'text-blue-700' },
                                { id: 'mandiri', label: 'Mandiri', sub: 'Transfer', icon: CreditCard, color: 'text-amber-600' },
                                { id: 'bri', label: 'Bank BRI', sub: 'Transfer', icon: CreditCard, color: 'text-indigo-700' },
                            ].map((method) => {
                                const Icon = method.icon;
                                const isSelected = selectedMethod === method.id;
                                return (
                                    <button
                                        key={method.id}
                                        type="button"
                                        onClick={() => setSelectedMethod(method.id)}
                                        className={`p-3 rounded-2xl border text-left transition flex flex-col gap-1 relative ${
                                            isSelected 
                                                ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-600/20 shadow-sm' 
                                                : 'border-slate-200 hover:border-slate-300 bg-white'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between w-full">
                                            <Icon className={`w-5 h-5 ${method.color}`} />
                                            {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                                        </div>
                                        <div>
                                            <p className={`text-xs font-bold ${isSelected ? 'text-emerald-950' : 'text-slate-800'}`}>{method.label}</p>
                                            <p className="text-[10px] text-slate-400">{method.sub}</p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Kotak Instruksi & Tampilan QRIS / Rekening */}
                    <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                        <div className="flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                            <p className="text-xs font-bold text-slate-900">Panduan Instruksi Pembayaran</p>
                        </div>

                        {selectedMethod.startsWith('qris') ? (
                            <div className="flex flex-col items-center space-y-3 pt-1">
                                <p className="text-xs text-slate-600 text-center">
                                    Scan QRIS universal di bawah ini menggunakan GoPay, OVO, DANA, ShopeePay, atau m-banking Anda:
                                </p>
                                <div className="w-44 h-44 sm:w-48 sm:h-48 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center">
                                    <img 
                                        src="/images/qris.png" 
                                        alt="QRIS Resmi Pokdarwis Sedyo Maju" 
                                        className="w-full h-full object-contain" 
                                    />
                                </div>
                                <div className="text-center bg-white px-4 py-2 rounded-xl border border-slate-200 w-full">
                                    <span className="text-[11px] font-bold text-emerald-700 block">NMID: ID1029384756123</span>
                                    <span className="text-[10px] text-slate-500 font-medium">a.n. Pokdarwis Sedyo Maju Ngoro-Oro</span>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-3 text-xs text-slate-600">
                                <p>Silakan lakukan transfer manual sesuai nominal tagihan ke rekening resmi berikut:</p>
                                <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-sm space-y-1">
                                    <p className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">{bankDetails[selectedMethod]?.name}</p>
                                    <p className="text-sm font-mono font-bold text-slate-900">{bankDetails[selectedMethod]?.number}</p>
                                    <p className="text-[11px] text-slate-500">Atas Nama: <strong className="text-slate-800">{bankDetails[selectedMethod]?.holder}</strong></p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Unggah Bukti Pembayaran */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                            Unggah Bukti Transfer / Resi <span className="text-red-500">*wajib</span>
                        </label>
                        <div 
                            onClick={() => document.getElementById('proofInput')?.click()}
                            className="border-2 border-dashed border-slate-300 rounded-2xl p-5 text-center cursor-pointer bg-slate-50 hover:bg-slate-100/80 transition flex flex-col items-center justify-center gap-2 group"
                        >
                            <input 
                                id="proofInput"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        const file = e.target.files[0];
                                        setProofFile(file);
                                        setProofPreview(URL.createObjectURL(file));
                                    }
                                }}
                            />
                            {proofPreview ? (
                                <div className="relative w-full h-36 rounded-xl overflow-hidden border border-slate-200">
                                    <img src={proofPreview} alt="Bukti Transfer" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-bold">
                                        Klik untuk ganti foto
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition">
                                        <UploadCloud className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-800">Klik untuk unggah foto bukti transfer</p>
                                        <p className="text-[10px] text-slate-400 mt-0.5">Mendukung format JPG, PNG (Maksimal 2MB)</p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Tombol Aksi Bawah */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={submitting || !proofFile}
                            className={`px-6 py-2.5 rounded-xl text-xs font-bold text-white shadow-md transition flex items-center gap-2 ${
                                !proofFile 
                                    ? 'bg-slate-300 cursor-not-allowed shadow-none' 
                                    : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30 cursor-pointer'
                            }`}
                        >
                            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                            <span>Kirim Bukti Pembayaran</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}