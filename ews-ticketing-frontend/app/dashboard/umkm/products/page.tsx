'use client';

import { useState, useEffect } from 'react';
import { Plus, Package } from 'lucide-react';
import { apiClient } from '@/app/lib/axios';
import { toast } from 'sonner';
import ProductModal from '@/app/components/dashboard/umkm/ProductModal';
import ProductStats from '@/app/components/dashboard/umkm/ProductStats';
import ProductToolbar from '@/app/components/dashboard/umkm/ProductToolbar';
import ProductTable from '@/app/components/dashboard/umkm/ProductTable';

export default function UmkmProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('ALL');

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await apiClient.get('/umkm/products');
            setProducts(res.data.data || res.data || []);
        } catch (error: any) {
            console.error("Error fetching products:", error);
            if (error.response?.status === 401) {
                toast.error('Sesi habis atau belum login. Silakan login kembali.');
            } else {
                setProducts([]);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm('Apakah Anda yakin ingin menghapus produk ini?')) return;

        try {
            await apiClient.delete(`/umkm/products/${id}`);
            toast.success('Produk berhasil dihapus.');
            fetchProducts();
        } catch (error) {
            toast.error('Gagal menghapus produk.');
        }
    };

    const handleEdit = (product: any) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleOpenAdd = () => {
        setSelectedProduct(null);
        setIsModalOpen(true);
    };

    // Logika Pencarian & Filter Aktif
    const filteredProducts = products.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        const stockNum = Number(item.stock) || 0;
        
        let matchesStatus = true;
        if (selectedStatus === 'SAFE') matchesStatus = stockNum > 5;
        if (selectedStatus === 'LOW') matchesStatus = stockNum <= 5;

        return matchesSearch && matchesStatus;
    });

    // Statistik Ringkasan Dinamis
    const totalProductsCount = products.length;
    const totalStockCount = products.reduce((acc, item) => acc + (Number(item.stock) || 0), 0);
    const lowStockCount = products.filter(item => Number(item.stock) <= 5).length;
    const totalSoldEstimated = products.reduce((acc, item) => acc + (Number(item.sold_count) || 0), 0);

    return (
        <div className="space-y-6 text-gray-900">
            {/* Header Section */}
<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2">
    {/* Sisi Kiri: Ikon Melengkung & Teks Judul */}
    <div className="flex items-center gap-5">
        {/* Kotak Ikon Hijau Muda Melengkung */}
        <div className="w-16 h-16 bg-emerald-100/70 backdrop-blur-md rounded-3xl flex items-center justify-center text-emerald-700 shadow-sm flex-shrink-0 border border-emerald-200/50">
            <Package className="w-8 h-8" />
        </div>

        {/* Teks Judul & Deskripsi */}
        <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Produk Dan Stok UMKM
            </h1>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium max-w-2xl">
                Tambah, ubah harga, dan pantau ketersediaan produk kerajinan Anda <br className="hidden sm:inline" />
                secara real-time.
            </p>
        </div>
    </div>

    {/* Sisi Kanan: Tombol Aksi Tambah */}
    <div className="flex items-center justify-end">
        <button 
            onClick={handleOpenAdd}
            className="bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm shadow-emerald-700/20 transition cursor-pointer"
        >
            <Plus className="w-4 h-4" />
            <span>Tambah Produk</span>
        </button>
    </div>
</div>

            {/* Komponen Statistik */}
            <ProductStats 
                totalProductsCount={totalProductsCount}
                totalStockCount={totalStockCount}
                lowStockCount={lowStockCount}
                totalSoldEstimated={totalSoldEstimated}
            />

            {/* Komponen Toolbar Search & Filter */}
            <ProductToolbar 
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedStatus={selectedStatus}
                setSelectedStatus={setSelectedStatus}
            />

            {/* Komponen Tabel Data */}
            <ProductTable 
                products={filteredProducts}
                loading={loading}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onSuccess={fetchProducts}
                totalCount={products.length}
            />

            {/* Modal Form Tambah/Edit */}
            <ProductModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchProducts}
                productToEdit={selectedProduct}
            />
        </div>
    );
}