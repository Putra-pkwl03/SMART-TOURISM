import { XCircle } from 'lucide-react';

interface TicketModalsProps {
    isProofModalOpen: boolean;
    selectedProof: string | null;
    onCloseProofModal: () => void;

    isRejectModalOpen: boolean;
    rejectionReason: string;
    setRejectionReason: (val: string) => void;
    onCloseRejectModal: () => void;
    onSubmitReject: () => void;
}

export default function TicketModals({
    isProofModalOpen,
    selectedProof,
    onCloseProofModal,
    isRejectModalOpen,
    rejectionReason,
    setRejectionReason,
    onCloseRejectModal,
    onSubmitReject,
}: TicketModalsProps) {
    return (
        <>
            {/* Modal Preview Bukti Transfer */}
            {isProofModalOpen && selectedProof && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold text-slate-900">Bukti Pembayaran Wisatawan</h3>
                            <button 
                                onClick={onCloseProofModal}
                                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition cursor-pointer"
                            >
                                <XCircle className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="w-full h-80 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center">
                            <img src={selectedProof} alt="Bukti Transfer" className="w-full h-full object-contain" />
                        </div>
                        <button
                            onClick={onCloseProofModal}
                            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            )}

            {/* Modal Input Alasan Penolakan */}
            {isRejectModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold text-slate-900">Alasan Penolakan Pembayaran</h3>
                            <button 
                                onClick={onCloseRejectModal}
                                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition cursor-pointer"
                            >
                                <XCircle className="w-5 h-5" />
                            </button>
                        </div>
                        <textarea 
                            rows={3}
                            placeholder="Contoh: Bukti transfer tidak valid / Nominal pembayaran tidak sesuai..."
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:bg-white focus:ring-2 focus:ring-red-500 outline-none transition resize-none"
                        />
                        <div className="flex items-center gap-2">
                            <button
                                onClick={onCloseRejectModal}
                                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
                            >
                                Batal
                            </button>
                            <button
                                onClick={onSubmitReject}
                                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                            >
                                Konfirmasi Tolak
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}