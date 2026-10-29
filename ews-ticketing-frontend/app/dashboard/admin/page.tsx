'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/app/lib/axios';
import EwsWidget from '../../components/dashboard/admin/EwsWidget';
import StatsOverview from '../../components/dashboard/admin/StatsOverview';
import RecentTicketsTable from '../../components/dashboard/admin/RecentTicketsTable';

export default function AdminDashboardPage() {
    const [ewsData, setEwsData] = useState<any>({
        water_level: '1.35 m',
        rainfall: '12.4 mm/h',
        temperature: '28.6 °C',
        humidity: '72.0 %',
        status: 'NORMAL',
        description: 'Semua sistem operasional aman untuk aktivitas susur sungai.'
    });

    useEffect(() => {
        // Fetch data EWS telemetry dari API Laravel jika backend aktif
        apiClient.get('/ews-telemetry')
            .then(res => {
                if (res.data) setEwsData(res.data);
            })
            .catch(() => {
                // Menggunakan data default jika belum terhubung
            });
    }, []);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Dashboard Monitoring Utama</h1>
                <p className="text-sm text-slate-500 mt-1">
                    Pusat kendali operasional destinasi wisata Pokdarwis Jurug Gedhe, mitigasi EWS hulu sungai, dan konsinyasi.
                </p>
            </div>

            {/* Widget EWS Telemetri Real-time */}
            <EwsWidget data={ewsData} />

            {/* Ringkasan Statistik Utama */}
            <StatsOverview />

            {/* Tabel Pemesanan Tiket Terakhir */}
            <RecentTicketsTable />
        </div>
    );
}