'use client';

import { useState, useEffect } from 'react';
import { Plus, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';
import { apiClient } from '@/app/lib/axios';
import DestinationModal from '../../../components/dashboard/admin/destinations/DestinationModal';
import DestinationTable from '../../../components/dashboard/admin/destinations/DestinationTable';

interface DestinationItem {
    id: number;
    name: string;
    type_entry?: 'destination' | 'package';
    type: string;
    price: number;
    umkm_revenue_share?: number;
    quota: number;
    status: 'Aktif' | 'Darurat Ditutup';
    description?: string;
    image_url?: string;
    image_file?: File | null;
    image_files?: File[]; // Tambahkan properti ini agar sesuai dengan modal
    images?: { id: number; image_url: string }[];
}

export default function DestinationsPage() {
    const [destinations, setDestinations] = useState<DestinationItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDestination, setSelectedDestination] = useState<DestinationItem | null>(null);

    const fetchDestinations = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get('/destinations');
            
            const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000';

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
                image_url: item.image_url 
                    ? (item.image_url.startsWith('http') ? item.image_url : `${BACKEND_URL}${item.image_url}`) 
                    : '',
                images: item.images || [],
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

    const handleDelete = async (id: number) => {
        try {
            await apiClient.delete(`/destinations/${id}`);
            setDestinations(destinations.filter(item => item.id !== id));
            toast.success('Destinasi berhasil dihapus.');
        } catch (error) {
            toast.error('Gagal menghapus destinasi.');
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

            // 1. Kirim ID foto lama yang dipertahankan (Wajib ada agar foto yang dihapus di UI terhapus di DB)
            if (data.existing_image_ids && data.existing_image_ids.length > 0) {
                data.existing_image_ids.forEach((id: number, index: number) => {
                    formData.append(`existing_image_ids[${index}]`, String(id));
                });
            }

            // 2. Kirim urutan ID foto lama (sesuai posisi geser / drag & drop di UI)
            if (data.image_orders && data.image_orders.length > 0) {
                data.image_orders.forEach((id: number, index: number) => {
                    formData.append(`image_orders[${index}]`, String(id));
                });
            }

            // 3. Kirim file foto baru hasil upload
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
                    <h1 className="text-2xl font-bold text-slate-900">Kelola Destinasi & Paket Wisata</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Master data dasar destinasi, kuota harian, tarif tiket, serta integrasi paket produk UMKM Sedyo Maju.
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

            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-950 leading-relaxed">
                    <span className="font-bold block mb-0.5">Prosedur Tanggap Darurat EWS & Operasional:</span>
                    Jika sensor hulu sungai mendeteksi anomali cuaca atau status EWS siaga merah, ubah status operasional destinasi susur sungai menjadi <strong className="text-red-600">Darurat Ditutup</strong> untuk menghentikan pemesanan tiket baru secara otomatis.
                </div>
            </div>

            <DestinationTable 
                destinations={destinations}
                loading={loading}
                onToggleStatus={toggleEmergencyStatus}
                onEdit={handleOpenEditModal}
                onDelete={handleDelete}
            />

            <DestinationModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveDestination}
                initialData={selectedDestination}
            />
        </div>
    );
}