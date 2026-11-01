'use client';

import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-lg font-reguler text-gray-900 tracking-tight">Kelola Produk dan Stok UMKM</h1>
                    <p className="text-xs text-gray-500">Tambah, ubah harga, dan pantau ketersediaan produk kerajinan Anda secara real-time.</p>
                </div>
                <button 
                    onClick={handleOpenAdd}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-reguler rounded-xl transition shadow-lg shadow-blue-600/20 cursor-pointer"
                >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Produk</span>
                </button>
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