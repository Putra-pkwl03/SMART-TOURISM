'use client';

import { useEffect, useRef, useState } from 'react';
import { AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';
import axios from 'axios';
import jsQR from 'jsqr';
import { toast } from 'sonner';
import { apiClient } from '@/app/lib/axios';

interface VerifiedTicket {
    id: number;
    ticket_code: string;
    visit_date: string;
    visitor_count: number;
    destination?: { name?: string };
}

interface InlineScannerProps {
    onScanSuccess: (ticketData: VerifiedTicket) => void;
}

const SCAN_INTERVAL_MS = 125;
const MAX_SCAN_WIDTH = 480;

export default function InlineScanner({ onScanSuccess }: InlineScannerProps) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const onScanSuccessRef = useRef(onScanSuccess);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [scanningStatus, setScanningStatus] = useState('Menyiapkan kamera...');
    const [isDetected, setIsDetected] = useState(false);
    const [isValidating, setIsValidating] = useState(false);

    useEffect(() => {
        onScanSuccessRef.current = onScanSuccess;
    }, [onScanSuccess]);

    useEffect(() => {
        let stream: MediaStream | null = null;
        let animationFrameId = 0;
        let resetTimeoutId = 0;
        let isCancelled = false;
        let isBusy = false;
        let lastScannedAt = 0;

        const verifyTicket = async (ticketCode: string) => {
            isBusy = true;
            setIsDetected(true);
            setIsValidating(true);
            setScanningStatus(`Memverifikasi ${ticketCode}...`);

            try {
                const response = await apiClient.post<{ message?: string; data: VerifiedTicket }>('/tickets/verify', {
                    ticket_code: ticketCode,
                });
                toast.success(response.data.message || 'Tiket sah! Silakan izinkan pengunjung masuk.');
                onScanSuccessRef.current(response.data.data);
            } catch (error: unknown) {
                console.error('Gagal memverifikasi tiket dari kamera:', error);
                const message = axios.isAxiosError<{ message?: string }>(error)
                    ? error.response?.data?.message || 'Verifikasi tiket gagal.'
                    : 'Verifikasi tiket gagal.';
                toast.error(message);
            } finally {
                if (!isCancelled) {
                    setIsValidating(false);
                    resetTimeoutId = window.setTimeout(() => {
                        isBusy = false;
                        setIsDetected(false);
                        setScanningStatus('Arahkan kamera ke e-ticket...');
                    }, 1800);
                }
            }
        };

        const scanFrame = (timestamp: number) => {
            if (isCancelled) return;

            if (
                !isBusy
                && timestamp - lastScannedAt >= SCAN_INTERVAL_MS
                && videoRef.current?.readyState === HTMLMediaElement.HAVE_ENOUGH_DATA
            ) {
                lastScannedAt = timestamp;
                const video = videoRef.current;
                const canvas = canvasRef.current;
                const context = canvas?.getContext('2d', { willReadFrequently: true });

                if (canvas && context && video.videoWidth > 0) {
                    const scale = Math.min(1, MAX_SCAN_WIDTH / video.videoWidth);
                    canvas.width = Math.round(video.videoWidth * scale);
                    canvas.height = Math.round(video.videoHeight * scale);
                    context.drawImage(video, 0, 0, canvas.width, canvas.height);

                    const image = context.getImageData(0, 0, canvas.width, canvas.height);
                    const code = jsQR(image.data, image.width, image.height, {
                        inversionAttempts: 'dontInvert',
                    });

                    if (code?.data) {
                        void verifyTicket(code.data.trim());
                    }
                }
            }

            animationFrameId = window.requestAnimationFrame(scanFrame);
        };

        const startCamera = async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    audio: false,
                    video: {
                        facingMode: { ideal: 'environment' },
                        width: { ideal: 640 },
                        height: { ideal: 480 },
                        frameRate: { ideal: 15, max: 20 },
                    },
                });

                if (isCancelled) {
                    stream.getTracks().forEach((track) => track.stop());
                    return;
                }

                const video = videoRef.current;
                if (!video) {
                    stream.getTracks().forEach((track) => track.stop());
                    return;
                }

                video.srcObject = stream;
                await video.play();
                if (!isCancelled) {
                    setScanningStatus('Arahkan kamera ke e-ticket...');
                    animationFrameId = window.requestAnimationFrame(scanFrame);
                }
            } catch (error: unknown) {
                if (isCancelled) return;
                console.error('Gagal mengakses kamera:', error);
                setCameraError('Gagal membuka kamera. Pastikan izin browser diberikan.');
            }
        };

        void startCamera();

        return () => {
            isCancelled = true;
            window.cancelAnimationFrame(animationFrameId);
            window.clearTimeout(resetTimeoutId);
            stream?.getTracks().forEach((track) => track.stop());
        };
    }, []);

    return (
        <div className="relative h-full w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-950 shadow-inner">
            {cameraError ? (
                <div className="flex h-full flex-col items-center justify-center p-6 text-center text-xs text-red-400">
                    <AlertTriangle className="mb-2 h-10 w-10 text-red-500" />
                    <p className="font-semibold text-slate-200">{cameraError}</p>
                </div>
            ) : (
                <>
                    <video ref={videoRef} playsInline muted className="h-full w-full object-cover" />
                    <canvas ref={canvasRef} className="hidden" />
                    {!isDetected && (
                        <div className="absolute inset-x-8 top-1/2 h-0.5 -translate-y-1/2 animate-pulse bg-emerald-500 shadow-[0_0_15px_#10b981]" />
                    )}
                    <div className="pointer-events-none absolute inset-8 flex items-center justify-center rounded-xl border-2 border-dashed border-white/40">
                        {isDetected ? (
                            <div className="flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2 text-xs font-bold text-white shadow-lg">
                                {isValidating ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                                <span>{isValidating ? 'Memvalidasi tiket...' : 'Berhasil masuk!'}</span>
                            </div>
                        ) : (
                            <span className="rounded-full bg-slate-900/80 px-3 py-1.5 text-center text-[11px] text-white/90 backdrop-blur-sm">
                                {scanningStatus}
                            </span>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
