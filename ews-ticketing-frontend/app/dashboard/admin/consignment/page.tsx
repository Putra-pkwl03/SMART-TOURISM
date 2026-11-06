// app/dashboard/consignment/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { PieChart, CheckCircle2, FileDown } from 'lucide-react'; 
import { toast } from 'sonner';
import { apiClient } from '@/app/lib/axios';
import { getBackendUrl } from '@/app/lib/backend-url'; 

import ConsignmentStats from '@/app/components/dashboard/admin/consignment/ConsignmentStats';
import ConsignmentToolbar from '@/app/components/dashboard/admin/consignment/ConsignmentToolbar';
import ConsignmentTable from '@/app/components/dashboard/admin/consignment/ConsignmentTable';
import ConsignmentChart from '@/app/components/dashboard/admin/consignment/ConsignmentChart';
import ConfirmSettlementModal from '@/app/components/dashboard/admin/consignment/ConfirmSettlementModal';
import { ConsignmentAnalyticsSkeleton, SkeletonStats, SkeletonTable } from '@/app/components/dashboard/shared/DashboardSkeleton';

interface ConsignmentItem {
    id: number;
    ticket_id: number;
    umkm_product_id: number;
    qty: number;
    total_umkm_income: number;
    total_pokdarwis_income: number;
    status: 'pending' | 'paid';
    settled_at?: string;
    notes?: string;
    created_at: string;
    ticket?: {
        ticket_code: string;
        visit_date: string;
        user?: {
            name: string;
        };
    };
    umkm_product?: {
        id?: number;
        name: string;
        price: number;
        umkm_share_amount: number;
        images?: any[];
    };
}

export default function ConsignmentPage() {
    const [consignments, setConsignments] = useState<ConsignmentItem[]>([]);
    const [summary, setSummary] = useState({
        overall_umkm_income: 0,
        overall_pokdarwis_income: 0,
        total_paid_umkm: 0,
        total_unpaid_umkm: 0,
    });
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    // State untuk Mengontrol Modal & Target Data yang Dicairkan
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [settlementData, setSettlementData] = useState<{
        ids: number[];
        totalAmount: number;
        isSingle: boolean;
    }>({
        ids: [],
        totalAmount: 0,
        isSingle: false,
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProductFilter, setSelectedProductFilter] = useState('ALL');
    const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');
    const [selectedMonth, setSelectedMonth] = useState(1);
    const [selectedYear, setSelectedYear] = useState(0);

    const fetchConsignments = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get('/admin/consignments', {
                params: {
                    umkm_product_id: selectedProductFilter,
                    status: selectedStatusFilter,
                    month: selectedMonth,
                    year: selectedYear,
                    search: searchQuery,
                }
            });
            setConsignments(response.data.data || []);
            setSummary(response.data.summary || { 
                overall_umkm_income: 0, 
                overall_pokdarwis_income: 0,
                total_paid_umkm: 0,
                total_unpaid_umkm: 0
            });
        } catch (error) {
            toast.error('Gagal memuat data konsinyasi dari server.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            const now = new Date();
            setSelectedMonth(now.getMonth() + 1);
            setSelectedYear(now.getFullYear());
        }, 0);
        return () => window.clearTimeout(timeoutId);
    }, []);

    useEffect(() => {
        if (!selectedYear) return;
        const timeoutId = window.setTimeout(() => {
            void fetchConsignments();
        }, 0);
        return () => window.clearTimeout(timeoutId);
    }, [selectedProductFilter, selectedStatusFilter, selectedMonth, selectedYear]);

    if (!selectedYear) {
        return (
            <div className="space-y-6">
                <SkeletonStats count={3} className="sm:grid-cols-3 xl:grid-cols-3" />
                <ConsignmentAnalyticsSkeleton />
                <SkeletonTable columns={7} rows={6} />
            </div>
        );
    }

    const formatRupiah = (number: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number);
    };

    const uniqueProductsMap = new Map();
    consignments.forEach(item => {
        if (item.umkm_product && item.umkm_product.name) {
            uniqueProductsMap.set(item.umkm_product.name, {
                id: item.umkm_product.id || item.umkm_product_id,
                name: item.umkm_product.name
            });
        }
    });
    const uniqueProducts = Array.from(uniqueProductsMap.values());

    // Fungsi Eksekusi API Pencairan (Dipanggil dari Modal)
    const handleExecuteSettlement = async () => {
        if (settlementData.ids.length === 0) return;

        try {
            setActionLoading(true);
            await apiClient.post('/admin/consignments/mark-paid', {
                ids: settlementData.ids,
                notes: settlementData.isSingle 
                    ? `Pencairan satuan transaksi ID: ${settlementData.ids.join(', ')}`
                    : `Pencairan dana konsinyasi periode Bulan ${selectedMonth}-${selectedYear}`
            });
            toast.success('Status pencairan dana konsinyasi berhasil diperbarui menjadi LUNAS.');
            setIsConfirmModalOpen(false);
            fetchConsignments();
        } catch (error) {
            toast.error('Gagal memperbarui status pencairan.');
        } finally {
            setActionLoading(false);
        }
    };

    // Handler 1: Tombol Header (Cairkan Semua Pending EOM)
    const handleOpenBulkSettlement = () => {
        const pendingItems = consignments.filter(c => c.status === 'pending');
        if (pendingItems.length === 0) {
            toast.info('Tidak ada data pending yang perlu dicairkan pada periode ini.');
            return;
        }
        const ids = pendingItems.map(c => c.id);
        const totalAmount = pendingItems.reduce((acc, curr) => acc + Number(curr.total_umkm_income), 0);

        setSettlementData({ ids, totalAmount, isSingle: false });
        setIsConfirmModalOpen(true);
    };

    // Handler 2: Tombol Tabel Per Baris (Cairkan Satuan)
    const handleOpenSingleSettlement = (ids: number[]) => {
        const targetItem = consignments.find(c => c.id === ids[0]);
        const totalAmount = targetItem ? Number(targetItem.total_umkm_income) : 0;

        setSettlementData({ ids, totalAmount, isSingle: true });
        setIsConfirmModalOpen(true);
    };

       // Handler 3: Download Berita Acara PDF dengan Axios (Membawa Token & Mencegah Error Redirect)
    const handleDownloadPdf = async () => {
        try {
            toast.loading('Menyiapkan dokumen PDF...', { id: 'pdf-loading' });
            
            // Menggunakan apiClient agar Header Authorization (Bearer Token) ikut terkirim
            const response = await apiClient.get('/admin/consignments/export-pdf', {
                params: { 
                    month: selectedMonth, 
                    year: selectedYear 
                },
                responseType: 'blob', // Sangat penting agar file diterima sebagai binary data
            });

            // Membuat objek URL dari blob untuk memicu download di browser
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Berita-Acara-Konsinyasi-${selectedMonth}-${selectedYear}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            
            // Bersihkan URL object setelah selesai
            window.URL.revokeObjectURL(url);
            
            toast.dismiss('pdf-loading');
            toast.success('Berita acara PDF berhasil diunduh!');
        } catch (error) {
            toast.dismiss('pdf-loading');
            toast.error('Gagal mengunduh PDF. Pastikan Anda memiliki hak akses.');
        }
    };

    const totalTransactions = consignments.length;
    const totalItemsSold = consignments.reduce((acc, curr) => acc + (Number(curr.qty) || 0), 0);
    const grossSales = summary.overall_umkm_income + summary.overall_pokdarwis_income;

    const monthNames = ['', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

    return (
        <div className="space-y-6 text-slate-900">
            {/* Bagian Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2">
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-emerald-100/70 backdrop-blur-md rounded-3xl flex items-center justify-center text-emerald-700 shadow-sm flex-shrink-0 border border-emerald-200/50">
                        <PieChart className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-lg font-extrabold text-slate-900 tracking-tight">
                            Modul Konsinyasi dan Bagi Hasil UMKM
                        </h1>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium max-w-2xl">
                            Pantau rincian hasil penjualan produk titipan (konsinyasi) dan akumulasi pendapatan bagi hasil antara Pokdarwis dengan UMKM Sedyo Maju.
                        </p>
                    </div>
                </div>

                {/* Tombol Aksi Kanan Header */}
                <div className="flex items-center gap-2">
                   

                    {/* Tombol Cairkan Semua Pending */}
                    <button 
                        onClick={handleOpenBulkSettlement}
                        className="px-4 py-3 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold rounded-2xl shadow-sm transition flex items-center gap-2 cursor-pointer"
                    >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Cairkan Semua Pending (EOM)</span>
                    </button>
                     {/* Tombol Export / Download PDF */}
                    <button 
                        onClick={handleDownloadPdf}
                        className="px-4 py-3 bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold rounded-2xl shadow-sm transition flex items-center gap-2 cursor-pointer border border-blue-200/60"
                        title="Unduh Berita Acara PDF Bulan Ini"
                    >
                        <FileDown className="w-4 h-4 text-white" />
                        <span>Export PDF EOM</span>
                    </button>
                </div>
            </div>

            {/* Kartu Ringkasan (Stats Cards) */}
            {loading ? (
                <SkeletonStats count={3} className="sm:grid-cols-3 xl:grid-cols-3" />
            ) : (
                <ConsignmentStats
                    totalTransactions={totalTransactions}
                    totalPaidUmkm={summary.total_paid_umkm}
                    totalUnpaidUmkm={summary.total_unpaid_umkm}
                    formatRupiah={formatRupiah}
                />
            )}

            {/* Komponen Visualisasi Grafik Proporsi & Pendapatan Kotor */}
            {loading ? (
                <ConsignmentAnalyticsSkeleton />
            ) : (
                <ConsignmentChart
                    summary={{
                        total_items_sold: totalItemsSold,
                        total_gross_sales: grossSales,
                        total_umkm_income: summary.overall_umkm_income,
                        total_pokdarwis_income: summary.overall_pokdarwis_income,
                    }}
                    formatRupiah={formatRupiah}
                />
            )}

            {/* Toolbar Search & Filter */}
            <ConsignmentToolbar 
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedProductFilter={selectedProductFilter}
                setSelectedProductFilter={setSelectedProductFilter}
                selectedStatusFilter={selectedStatusFilter}
                setSelectedStatusFilter={setSelectedStatusFilter}
                selectedMonth={selectedMonth}
                setSelectedMonth={setSelectedMonth}
                selectedYear={selectedYear}
                setSelectedYear={setSelectedYear}
                productsList={uniqueProducts}
                onSearchSubmit={fetchConsignments}
            />

            {/* Tabel Riwayat (Terhubung ke Modal via onMarkAsPaid) */}
            <ConsignmentTable 
                consignments={consignments}
                loading={loading}
                formatRupiah={formatRupiah}
                onMarkAsPaid={handleOpenSingleSettlement}
            />

            {/* Modal Konfirmasi Pencairan Terpadu */}
            <ConfirmSettlementModal 
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={handleExecuteSettlement}
                pendingCount={settlementData.ids.length}
                totalAmount={settlementData.totalAmount}
                monthName={monthNames[selectedMonth]}
                year={selectedYear}
                formatRupiah={formatRupiah}
                loading={actionLoading}
                isSingle={settlementData.isSingle}
            />
        </div>
    );
}