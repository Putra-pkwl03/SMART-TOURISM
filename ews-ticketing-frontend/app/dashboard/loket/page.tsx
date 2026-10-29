'use client';

import { useState, useEffect } from 'react';
import LoketHeader from '@/app/components/dashboard/loket/LoketHeader';
import LoketStats from '@/app/components/dashboard/loket/LoketStats';
import TicketVerifier from '@/app/components/dashboard/loket/TicketVerifier';
import WeatherEwsWidget from '@/app/components/dashboard/loket/WeatherEwsWidget';
import TicketLogTable from '@/app/components/dashboard/loket/TicketLogTable';

export default function LoketDashboardPage() {
    const [currentTime, setCurrentTime] = useState<string>('');

    // Jam real-time untuk petugas
    useEffect(() => {
        const updateClock = () => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        };
        updateClock();
        const interval = setInterval(updateClock, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="space-y-6 text-slate-800">
            {/* 1. Header Informasi Petugas */}
            <LoketHeader currentTime={currentTime} />

            {/* 2. Kartu Statistik Ringkas */}
            <LoketStats />

            {/* 3. Aksi Utama: Verifikasi Tiket & EWS Cuaca */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7">
                    <TicketVerifier />
                </div>
                <div className="lg:col-span-5">
                    <WeatherEwsWidget />
                </div>
            </div>

            {/* 4. Tabel Log Riwayat Verifikasi */}
            <TicketLogTable />
        </div>
    );
}