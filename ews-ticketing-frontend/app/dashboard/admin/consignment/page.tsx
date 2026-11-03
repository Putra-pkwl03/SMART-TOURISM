// app/dashboard/consignment/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { PieChart } from 'lucide-react';
import { toast } from 'sonner';
import { apiClient } from '@/app/lib/axios';

import ConsignmentStats from '@/app/components/dashboard/admin/consignment/ConsignmentStats';
import ConsignmentToolbar from '@/app/components/dashboard/admin/consignment/ConsignmentToolbar';
import ConsignmentTable from '@/app/components/dashboard/admin/consignment/ConsignmentTable';

interface ConsignmentItem {
    id: number;
    ticket_id: number;
    umkm_product_id: number;
    qty: number;
    total_umkm_income: number;
    total_pokdarwis_income: number;
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
    });
    const [loading, setLoading] = useState(true);

    // State Search & Filter
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProductFilter, setSelectedProductFilter] = useState('ALL');

    const fetchConsignments = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get('/admin/consignments');
            setConsignments(response.data.data || []);
            setSummary(response.data.summary || { overall_umkm_income: 0, overall_pokdarwis_income: 0 });
        } catch (error) {
            toast.error('Gagal memuat data konsinyasi dari server.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConsignments();
    }, []);

    const formatRupiah = (number: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number);
    };

    // PERBAIKAN DI SINI: Ambil daftar produk unik beserta id-nya untuk filter
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

    // Logika Filter & Search
    const filteredConsignments = consignments.filter(item => {
        const ticketCode = item.ticket?.ticket_code?.toLowerCase() || '';
        const userName = item.ticket?.user?.name?.toLowerCase() || '';
        const productName = item.umkm_product?.name || '';

        const matchesSearch = ticketCode.includes(searchQuery.toLowerCase()) || userName.includes(searchQuery.toLowerCase());
        const matchesProduct = selectedProductFilter === 'ALL' || productName === selectedProductFilter;

        return matchesSearch && matchesProduct;
    });

    // Statistik tambahan
    const totalTransactions = consignments.length;
    const totalItemsSold = consignments.reduce((acc, curr) => acc + (Number(curr.qty) || 0), 0);

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
            </div>

            {/* Kartu Ringkasan (Stats Cards) */}
            <ConsignmentStats 
                totalUmkmIncome={summary.overall_umkm_income}
                totalPokdarwisIncome={summary.overall_pokdarwis_income}
                totalTransactions={totalTransactions}
                totalItemsSold={totalItemsSold}
                formatRupiah={formatRupiah}
            />

            {/* Toolbar Search & Filter */}
            <ConsignmentToolbar 
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedProductFilter={selectedProductFilter}
                setSelectedProductFilter={setSelectedProductFilter}
                productsList={uniqueProducts}
            />

            {/* Tabel Riwayat dengan Fitur Detail */}
            <ConsignmentTable 
                consignments={filteredConsignments}
                loading={loading}
                formatRupiah={formatRupiah}
            />
        </div>
    );
}