'use client';

import { useState, useEffect } from 'react';
import { Plus, ShieldCheck, X } from 'lucide-react';
import { toast } from 'sonner';
import { apiClient } from '@/app/lib/axios';
import DestinationModal from '../../../components/dashboard/admin/destinations/DestinationModal';
import DestinationTable from '../../../components/dashboard/admin/destinations/DestinationTable';
import DeleteConfirmModal from '../../../components/dashboard/admin/destinations/DeleteConfirmModal';

interface DestinationItem {
    id: number;
    name: string;
    type_entry: string;
    type: string;
    price: number;
    umkm_revenue_share?: number;
    quota: number;
    status: 'Aktif' | 'Darurat Ditutup';
    description?: string;
    image_url?: string;
    image_file?: File | null;
    image_files?: File[];
    images?: { id: number; image_url?: string; image_path?: string }[];
    umkm_products?: { id: number; name: string; price: number; image_url?: string; image_path?: string }[];
}

export default function DestinationsPage() {
    const [destinations, setDestinations] = useState<DestinationItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDestination, setSelectedDestination] = useState<DestinationItem | null>(null);
    const [showEwsAlert, setShowEwsAlert] = useState(true);

    // State untuk Modal Konfirmasi Hapus
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<DestinationItem | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchDestinations = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get('/destinations');
            
            const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000';

            const resolveUrl = (pathOrUrl?: string) => {
                if (!pathOrUrl) return '';
                if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://') || pathOrUrl.startsWith('blob:')) {
                    return pathOrUrl;
                }
                const cleanPath = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
                const finalPath = cleanPath.startsWith('/storage') ? cleanPath : `/storage/${pathOrUrl.replace(/^\/+/, '')}`;
                return `${BACKEND_URL}${finalPath}`;
            };

            const formatted = response.data.map((item: any) => ({
                id: item.id,
                name: item.name,
                type_entry: item.type || 'destination',
                type: item.location || 'Padukuhan Gembyong',
                price: item.ticket_price,
                umkm_revenue_share: item.umkm_revenue_share || 0,
                quota: 50,
                status: item.is_active ? 'Aktif' : 'Darurat Ditutup',
                description: item.description,
                image_url: resolveUrl(item.image_url || item.image_path),
                images: (item.images || []).map((img: any) => ({
                    ...img,
                    image_url: resolveUrl(img.image_url || img.image_path)
                })),
                umkm_products: (item.umkm_products || []).map((prod: any) => ({
                    ...prod,
                    image_url: resolveUrl(prod.image_url || prod.image_path || prod.image),
                    images: (prod.images || []).map((img: any) => ({
                        ...img,
                        image_url: resolveUrl(img.image_url || img.image_path)
                    }))
                }))
            }));
            
            setDestinations(formatted);
        } catch (error) {
            toast.error('Gagal memuat data destinasi dari server.');
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchDestinations();
    }, []);

    const handleOpenAddModal = () => {
        setSelectedDestination(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (item: DestinationItem) => {
        setSelectedDestination(item);
        setIsModalOpen(true);
    };

    // Handler untuk membuka modal konfirmasi hapus (menerima objek item)
    const handleOpenDeleteModal = (item: DestinationItem) => {
        setItemToDelete(item);
        setIsDeleteModalOpen(true);
    };

    // Handler eksekusi penghapusan setelah dikonfirmasi di modal
    const handleConfirmDelete = async () => {
        if (!itemToDelete) return;

        try {
            setIsDeleting(true);
            await apiClient.delete(`/destinations/${itemToDelete.id}`);
            setDestinations(destinations.filter(item => item.id !== itemToDelete.id));
            toast.success('Destinasi berhasil dihapus.');
            setIsDeleteModalOpen(false);
            setItemToDelete(null);
        } catch (error) {
            toast.error('Gagal menghapus destinasi.');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleSaveDestination = async (data: any) => {
        try {
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('type', data.type_entry || 'destination');
            formData.append('location', data.type);
            formData.append('ticket_price', String(data.price));
            formData.append('umkm_revenue_share', String(data.umkm_revenue_share || 0));
            formData.append('description', data.description || '');
            formData.append('is_active', data.status === 'Aktif' ? '1' : '0');

            // --- TAMBAHKAN BAGIAN INI UNTUK MENYIMPAN PRODUK UMKM ---
            if (data.umkm_product_ids && data.umkm_product_ids.length > 0) {
                data.umkm_product_ids.forEach((id: number, index: number) => {
                    formData.append(`umkm_product_ids[${index}]`, String(id));
                });
            } else {
                // Kirim array kosong atau penanda jika diperlukan agar backend tahu produk dikosongkan
                formData.append('umkm_product_ids', '');
            }
            // --------------------------------------------------------

            if (data.existing_image_ids && data.existing_image_ids.length > 0) {
                data.existing_image_ids.forEach((id: number, index: number) => {
                    formData.append(`existing_image_ids[${index}]`, String(id));
                });
            }

            if (data.image_orders && data.image_orders.length > 0) {
                data.image_orders.forEach((id: number, index: number) => {
                    formData.append(`image_orders[${index}]`, String(id));
                });
            }

            if (data.image_files && data.image_files.length > 0) {
                data.image_files.forEach((file: File, index: number) => {
                    formData.append(`images[${index}]`, file);
                });
            }

            if (selectedDestination) {
                formData.append('_method', 'PUT');
                await apiClient.post(`/destinations/${selectedDestination.id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                toast.success('Data dan galeri berhasil diperbarui!');
            } else {
                await apiClient.post('/destinations', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                toast.success('Data baru berhasil ditambahkan!');
            }

            fetchDestinations();
            setIsModalOpen(false);
        } catch (error) {
            console.error(error);
            toast.error('Gagal menyimpan data destinasi.');
        }
    };

    const toggleEmergencyStatus = async (id: number) => {
        try {
            const res = await apiClient.patch(`/destinations/${id}/toggle-status`);
            const updatedItem = res.data.data;
            
            setDestinations(destinations.map(item => {
                if (item.id === id) {
                    return {
                        ...item,
                        status: updatedItem.is_active ? 'Aktif' : 'Darurat Ditutup'
                    };
                }
                return item;
            }));

            const statusText = updatedItem.is_active ? 'Dibuka Normal' : 'Ditutup Darurat (EWS)';
            toast.info(`Status operasional diubah menjadi: ${statusText}`);
        } catch (error) {
            toast.error('Gagal mengubah status darurat destinasi.');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-lg font-reguler text-slate-900">Kelola Destinasi dan Paket Wisata</h1>
                    <p className="text-xs text-gray-500">
                        Kelola destinasi wisata, paket bundling, dan integrasi produk UMKM di dalamnya.
                    </p>
                </div>
                <button
                    onClick={handleOpenAddModal}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2.5 rounded-xl text-xs font-medium flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/20 transition"
                >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Destinasi / Paket</span>
                </button>
            </div>

            {showEwsAlert && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                        <ShieldCheck className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
                        <div className="text-xs text-emerald-950 leading-relaxed">
                            <span className="font-bold block mb-0.5">Prosedur Tanggap Darurat EWS / Operasional</span>
                            Jika pada hulu sungai terdapat fenomena cuaca anomali dan atau EWS sudah berstatus merah, maka ubah status destinasi menjadi <span className="bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-semibold">Darurat Ditutup</span>, untuk menghentikan pemesanan tiket baru secara daring.
                        </div>
                    </div>
                    <button 
                        onClick={() => setShowEwsAlert(false)} 
                        className="text-emerald-800 hover:text-emerald-950 transition"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            <DestinationTable 
                destinations={destinations}
                loading={loading}
                onToggleStatus={toggleEmergencyStatus}
                onEdit={handleOpenEditModal}
                onDelete={handleOpenDeleteModal}
            />

            <DestinationModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveDestination}
                initialData={selectedDestination}
            />

            {/* Modal Konfirmasi Hapus */}
            <DeleteConfirmModal 
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                itemName={itemToDelete?.name}
                loading={isDeleting}
            />
        </div>
    );
}