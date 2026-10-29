'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Camera, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';
import jsQR from 'jsqr';
import { toast } from 'sonner';
import { apiClient } from '@/app/lib/axios'; // Menggunakan axios instance yang sudah ada

interface CameraScannerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onScanSuccess: (responsedata: any) => void;
}

export default function CameraScannerModal({ isOpen, onClose, onScanSuccess }: CameraScannerModalProps) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [scanningStatus, setScanningStatus] = useState<string>('Menyiapkan kamera...');
    const [isDetected, setIsDetected] = useState<boolean>(false);
    const [isValidating, setIsValidating] = useState<boolean>(false);

    // Fungsi otomatis untuk mengirim kode tiket ke backend Laravel menggunakan apiClient
    const handleVerifyTicket = async (ticketCode: string) => {
        if (isValidating) return;
        setIsValidating(true);
        setScanningStatus(`Memverifikasi ${ticketCode}...`);

        try {
            // Memanggil endpoint verifikasi menggunakan apiClient
            const response = await apiClient.post('/tickets/verify', { 
                ticket_code: ticketCode 
            });

            const result = response.data;

            toast.success(result.message || 'Tiket sah! Silakan izinkan pengunjung masuk.');
            onScanSuccess(result.data); // Kirim data tiket sukses ke komponen induk
            onClose();
        } catch (error: any) {
            console.error('Error verifying ticket:', error);
            const errorMsg = error.response?.data?.message || 'Verifikasi tiket gagal atau koneksi bermasalah.';
            toast.error(errorMsg);

            // Reset status agar kamera bisa lanjut scan tiket lain setelah beberapa detik
            setTimeout(() => {
                setIsDetected(false);
                setIsValidating(false);
                setScanningStatus('Arahkan kamera ke e-ticket...');
            }, 2500);
        }
    };

    useEffect(() => {
        if (!isOpen) return;

        let stream: MediaStream | null = null;
        let animationFrameId: number;
        let isCancelled = false;

        setCameraError(null);
        setIsDetected(false);
        setIsValidating(false);
        setScanningStatus('Arahkan kamera ke e-ticket...');

        const startCamera = async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    video: { 
                        facingMode: { ideal: 'environment' },
                        width: { ideal: 1920 },
                        height: { ideal: 1080 },
                        advanced: [{ focusMode: 'continuous' } as any]
                    }
                });

                if (isCancelled) {
                    stream.getTracks().forEach(track => track.stop());
                    return;
                }

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    await videoRef.current.play().catch(err => {
                        if (err.name !== 'AbortError') {
                            console.error("Video play error:", err);
                        }
                    });
                    
                    if (!isCancelled) {
                        animationFrameId = requestAnimationFrame(scanTick);
                    }
                }
            } catch (err) {
                console.error("Gagal mengakses kamera:", err);
                if (!isCancelled) {
                    setCameraError("Gagal membuka kamera. Pastikan Anda memberikan izin akses kamera pada browser.");
                }
            }
        };

        const scanTick = () => {
            if (isCancelled || isDetected || isValidating) return;

            if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
                const video = videoRef.current;
                const canvas = canvasRef.current;

                if (canvas) {
                    const context = canvas.getContext('2d', { willReadFrequently: true });
                    if (context) {
                        canvas.width = video.videoWidth;
                        canvas.height = video.videoHeight;
                        
                        context.drawImage(video, 0, 0, canvas.width, canvas.height);

                        try {
                            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                            
                            const code = jsQR(imageData.data, imageData.width, imageData.height, {
                                inversionAttempts: 'attemptBoth',
                            });

                            if (code && code.data) {
                                setIsDetected(true);
                                setScanningStatus(`QR Terbaca: ${code.data}`);
                                
                                // Langsung tembak API backend otomatis via apiClient
                                handleVerifyTicket(code.data);
                                return;
                            }
                        } catch (e) {
                            // Abaikan error frame sementara
                        }
                    }
                }
            }

            animationFrameId = requestAnimationFrame(scanTick);
        };

        startCamera();

        return () => {
            isCancelled = true;
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, [isOpen, isDetected, isValidating]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Camera className="w-5 h-5 text-blue-600" />
                        <h3 className="text-lg font-bold text-slate-900">Scan & Validasi E-Pass</h3>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="relative w-full h-72 bg-slate-900 rounded-2xl overflow-hidden flex items-center justify-center border border-slate-800 mb-4 shadow-inner">
                    {cameraError ? (
                        <div className="p-6 text-center text-red-400 text-xs">
                            <AlertTriangle className="w-10 h-10 mx-auto mb-2 text-red-500 animate-bounce" />
                            <p className="font-semibold text-slate-200">{cameraError}</p>
                        </div>
                    ) : (
                        <>
                            <video 
                                ref={videoRef} 
                                playsInline 
                                muted 
                                className="w-full h-full object-cover" 
                            />
                            <canvas ref={canvasRef} className="hidden" />

                            {!isDetected && (
                                <div className="absolute inset-x-6 h-0.5 bg-emerald-500 shadow-[0_0_15px_#10b981] animate-pulse top-1/2"></div>
                            )}

                            <div className="absolute inset-6 border-2 border-dashed border-white/40 rounded-2xl pointer-events-none flex items-center justify-center">
                                {isDetected ? (
                                    <div className="bg-emerald-600 text-white px-4 py-3 rounded-xl flex items-center gap-2 text-xs font-bold shadow-lg">
                                        {isValidating ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                <span>Memproses Validasi...</span>
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle2 className="w-5 h-5" />
                                                <span>Berhasil!</span>
                                            </>
                                        )}
                                    </div>
                                ) : (
                                    <span className="text-[11px] text-white/90 bg-slate-950/75 px-3 py-1.5 rounded-full backdrop-blur-sm text-center">
                                        {scanningStatus}
                                    </span>
                                )}
                            </div>
                        </>
                    )}
                </div>

                <p className="text-xs text-slate-500 text-center mb-4">
                    Arahkan kamera ke e-ticket. Sistem akan langsung memvalidasi tiket ke database secara otomatis.
                </p>
            </div>
        </div>
    );
}