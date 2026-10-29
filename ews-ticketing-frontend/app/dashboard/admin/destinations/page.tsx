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
    type: string;
    price: number;
    quota: number;
    status: 'Aktif' | 'Darurat Ditutup';
    description?: string;
    image_url?: string;
    image_file?: File | null; // <-- Pastikan properti file ditambahkan di interface
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
        
        // Definisikan base URL backend Laravel Anda
        const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000';

        const formatted = response.data.map((item: any) => ({
            id: item.id,
            name: item.name,
            type: item.location || 'Canyoneering / Alam',
            price: item.ticket_price,
            quota: 50,
            status: item.is_active ? 'Aktif' : 'Darurat Ditutup',
            description: item.description,
            // Gabungkan base URL jika image_url ada dan belum berupa URL lengkap
            image_url: item.image_url 
                ? (item.image_url.startsWith('http') ? item.image_url : `${BACKEND_URL}${item.image_url}`) 
                : '',
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

    // PERBAIKAN UTAMA: Menggunakan FormData untuk mengirim file gambar ke Laravel
    const handleSaveDestination = async (data: DestinationItem) => {
        try {
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('location', data.type);
            formData.append('ticket_price', String(data.price));
            formData.append('description', data.description || 'Destinasi wisata Pokdarwis Jurug Gedhe');
            formData.append('is_active', data.status === 'Aktif' ? '1' : '0');

            // Jika user memilih file gambar baru di modal, lampirkan ke formData
            if (data.image_file) {
                formData.append('image', data.image_file);
            }

            if (selectedDestination) {
                // Laravel tidak bisa membaca multipart/form-data via PUT murni, 
                // maka gunakan POST dengan field _method: 'PUT'
                formData.append('_method', 'PUT');
                await apiClient.post(`/destinations/${selectedDestination.id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                toast.success('Destinasi berhasil diperbarui!');
            } else {
                await apiClient.post('/destinations', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                toast.success('Destinasi baru berhasil ditambahkan!');
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
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-medium flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition"
                >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Destinasi Baru</span>
                </button>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-blue-900 leading-relaxed">
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