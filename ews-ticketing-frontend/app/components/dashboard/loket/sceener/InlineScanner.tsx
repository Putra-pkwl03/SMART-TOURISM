'use client';

import { useState, useEffect, useRef } from 'react';
import { Camera, AlertTriangle, CheckCircle2, Loader2, RefreshCw } from 'lucide-react';
import jsQR from 'jsqr';
import { toast } from 'sonner';
import { apiClient } from '@/app/lib/axios';

interface InlineScannerProps {
    onScanSuccess: (ticketData: any) => void;
}

export default function InlineScanner({ onScanSuccess }: InlineScannerProps) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [scanningStatus, setScanningStatus] = useState<string>('Menyiapkan kamera...');
    const [isDetected, setIsDetected] = useState<boolean>(false);
    const [isValidating, setIsValidating] = useState<boolean>(false);

    const handleVerifyTicket = async (ticketCode: string) => {
        if (isValidating) return;
        setIsValidating(true);
        setScanningStatus(`Memverifikasi ${ticketCode}...`);

        try {
            const response = await apiClient.post('/tickets/verify', { 
                ticket_code: ticketCode 
            });

            const result = response.data;
            toast.success(result.message || 'Tiket sah! Silakan izinkan pengunjung masuk.');
            onScanSuccess(result.data); // Kirim data ke parent untuk dimasukkan ke tabel

            // Reset status agar bisa scan tiket berikutnya setelah 2 detik
            setTimeout(() => {
                setIsDetected(false);
                setIsValidating(false);
                setScanningStatus('Arahkan kamera ke e-ticket...');
            }, 2000);
        } catch (error: any) {
            console.error('Error verifying ticket:', error);
            const errorMsg = error.response?.data?.message || 'Verifikasi tiket gagal.';
            toast.error(errorMsg);

            setTimeout(() => {
                setIsDetected(false);
                setIsValidating(false);
                setScanningStatus('Arahkan kamera ke e-ticket...');
            }, 2500);
        }
    };

    useEffect(() => {
        let stream: MediaStream | null = null;
        let animationFrameId: number;
        let isCancelled = false;

        const startCamera = async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    video: { 
                        facingMode: { ideal: 'environment' },
                        width: { ideal: 1280 },
                        height: { ideal: 720 },
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
                        if (err.name !== 'AbortError') console.error(err);
                    });
                    
                    if (!isCancelled) {
                        animationFrameId = requestAnimationFrame(scanTick);
                    }
                }
            } catch (err) {
                console.error("Gagal mengakses kamera:", err);
                if (!isCancelled) {
                    setCameraError("Gagal membuka kamera. Pastikan izin browser diberikan.");
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
                                handleVerifyTicket(code.data);
                                return;
                            }
                        } catch (e) {
                            // Abaikan error frame sesaat
                        }
                    }
                }
            }

            animationFrameId = requestAnimationFrame(scanTick);
        };

        startCamera();

        return () => {
            isCancelled = true;
            if (stream) stream.getTracks().forEach(track => track.stop());
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        };
    }, [isDetected, isValidating]);

    return (
        <div className="relative w-full h-80 bg-slate-950 rounded-2xl overflow-hidden flex items-center justify-center border border-slate-800 shadow-inner">
            {cameraError ? (
                <div className="p-6 text-center text-red-400 text-xs">
                    <AlertTriangle className="w-10 h-10 mx-auto mb-2 text-red-500 animate-bounce" />
                    <p className="font-semibold text-slate-200">{cameraError}</p>
                </div>
            ) : (
                <>
                    <video ref={videoRef} playsInline muted className="w-full h-full object-cover" />
                    <canvas ref={canvasRef} className="hidden" />

                    {!isDetected && (
                        <div className="absolute inset-x-8 h-0.5 bg-emerald-500 shadow-[0_0_15px_#10b981] animate-pulse top-1/2"></div>
                    )}

                    <div className="absolute inset-8 border-2 border-dashed border-white/40 rounded-xl pointer-events-none flex items-center justify-center">
                        {isDetected ? (
                            <div className="bg-emerald-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-bold shadow-lg">
                                {isValidating ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Memvalidasi ke Database...</span>
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 className="w-4 h-4" />
                                        <span>Berhasil Masuk!</span>
                                    </>
                                )}
                            </div>
                        ) : (
                            <span className="text-[11px] text-white/90 bg-slate-900/80 px-3 py-1.5 rounded-full backdrop-blur-sm text-center">
                                {scanningStatus}
                            </span>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}