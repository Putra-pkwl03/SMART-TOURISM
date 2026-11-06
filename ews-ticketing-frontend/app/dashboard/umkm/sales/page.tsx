'use client';

import { useState, useEffect, useCallback } from 'react';
import { ShoppingBag, FileDown } from 'lucide-react';
import { isAxiosError } from 'axios';
import { apiClient } from '@/app/lib/axios';
import { toast } from 'sonner';
import SalesStats from '@/app/components/dashboard/umkm/sales/SalesStats';
import SalesToolbar from '@/app/components/dashboard/umkm/sales/SalesToolbar';
import SalesTable from '@/app/components/dashboard/umkm/sales/SalesTable';
import SalesChart from '@/app/components/dashboard/umkm/sales/SalesChart';
import type { SaleRecord } from '@/app/components/dashboard/umkm/sales/SalesTable';
import { SalesBreakdownSkeleton, SkeletonStats } from '@/app/components/dashboard/shared/DashboardSkeleton';

interface SalesSummary {
    total_initial_stock: number;
    total_items_sold: number;
    total_standalone_sold: number;
    standalone_gross_sales: number;
    total_bundling_sold: number;
    bundling_gross_sales: number;
    total_bundling_transactions: number;
    total_gross_sales: number;
    standalone_income: number;
    bundling_umkm_income: number;
    total_umkm_revenue: number;
    total_umkm_income: number;
    total_paid_income: number;
    total_pending_income: number;
    total_pokdarwis_share: number;
}

export default function UmkmSalesPage() {
    const [salesData, setSalesData] = useState<SaleRecord[]>([]);
    const [summary, setSummary] = useState<SalesSummary>({
        total_initial_stock: 0,
        total_items_sold: 0,
        total_standalone_sold: 0,
        standalone_gross_sales: 0,
        total_bundling_sold: 0,
        bundling_gross_sales: 0,
        total_bundling_transactions: 0,
        total_gross_sales: 0,
        standalone_income: 0,
        bundling_umkm_income: 0,
        total_umkm_revenue: 0,
        total_umkm_income: 0,
        total_paid_income: 0,
        total_pending_income: 0,
        total_pokdarwis_share: 0,
    });
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [saleType, setSaleType] = useState('ALL');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [selectedMonth, setSelectedMonth] = useState(1);
    const [selectedYear, setSelectedYear] = useState(0);

    const fetchSalesData = useCallback(async () => {
        try {
            setLoading(true);
            const res = await apiClient.get('/umkm/sales', {
                params: {
                    sale_type: saleType !== 'ALL' ? saleType : undefined,
                    status: statusFilter !== 'ALL' ? statusFilter : undefined,
                    month: selectedMonth || undefined,
                    year: selectedYear || undefined,
                    search: searchQuery || undefined,
                }
            });
            setSalesData(res.data.data || []);
            if (res.data.summary) {
                setSummary(res.data.summary);
            }
        } catch (error: unknown) {
            console.error("Error fetching sales data:", error);
            if (isAxiosError(error) && error.response?.status === 401) {
                toast.error('Sesi habis atau belum login. Silakan login kembali.');
            } else {
                toast.error('Gagal memuat data penjualan & hampers.');
                setSalesData([]);
            }
        } finally {
            setLoading(false);
        }
    }, [saleType, statusFilter, selectedMonth, selectedYear, searchQuery]);

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
            void fetchSalesData();
        }, 0);
        return () => window.clearTimeout(timeoutId);
    }, [fetchSalesData, selectedYear]);

    if (!selectedYear) return null;

    const handleDownloadPdf = async () => {
        try {
            toast.loading('Menyiapkan laporan PDF UMKM...', { id: 'pdf-loading' });
            
            const response = await apiClient.get('/umkm/sales/export-pdf', {
                params: { 
                    month: selectedMonth, 
                    year: selectedYear 
                },
                responseType: 'blob',
            });

            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Laporan-Konsinyasi-UMKM-${selectedMonth}-${selectedYear}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            
            window.URL.revokeObjectURL(url);
            
            toast.dismiss('pdf-loading');
            toast.success('Laporan PDF UMKM berhasil diunduh!');
        } catch (error) {
            console.error('Error downloading UMKM sales report:', error);
            toast.dismiss('pdf-loading');
            toast.error('Gagal mengunduh laporan PDF.');
        }
    };

    return (
        <div className="space-y-6 text-gray-900">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2">
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-emerald-100/70 backdrop-blur-md rounded-3xl flex items-center justify-center text-emerald-700 shadow-sm flex-shrink-0 border border-emerald-200/50">
                        <ShoppingBag className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-lg font-extrabold text-slate-900 tracking-tight">
                            Penjualan & Hampers UMKM
                        </h1>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium max-w-2xl">
                            Pantau riwayat transaksi produk konsinyasi, paket bundling hampers, status pencairan, serta proyeksi bagi hasil pendapatan UMKM Sedyo Maju secara transparan.
                        </p>
                    </div>
                </div>

                <div>
                    <button 
                        onClick={handleDownloadPdf}
                        className="px-4 py-3 bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold rounded-2xl shadow-sm transition flex items-center gap-2 cursor-pointer border border-blue-200/60"
                        title="Unduh Laporan PDF Periode Ini"
                    >
                        <FileDown className="w-4 h-4 text-white" />
                        <span>Export Laporan PDF</span>
                    </button>
                </div>
            </div>

            {/* Statistik Ringkasan Atas (Hanya 3 Card Utama agar tidak penuh) */}
            {loading ? (
                <SkeletonStats count={5} className="xl:grid-cols-5" />
            ) : (
                <SalesStats
                    totalItemsSold={summary.total_items_sold}
                    standaloneIncome={summary.standalone_income}
                    totalPaidIncome={summary.total_paid_income}
                    totalPendingIncome={summary.total_pending_income}
                    totalUmkmRevenue={summary.total_umkm_revenue}
                />
            )}

            {/* Panel analitik inventaris, omzet per jalur, dan pembagian hasil bundling */}
            {loading ? <SalesBreakdownSkeleton /> : <SalesChart summary={summary} />}

            <SalesToolbar 
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                saleType={saleType}
                setSaleType={setSaleType}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                selectedMonth={selectedMonth}
                setSelectedMonth={setSelectedMonth}
                selectedYear={selectedYear}
                setSelectedYear={setSelectedYear}
            />

            <SalesTable 
                sales={salesData}
                loading={loading}
            />
        </div>
    );
}