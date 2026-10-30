'use client';

import { useState, useEffect } from 'react';
import DestinationFormContent from './DestinationFormContent';

interface GalleryItem {
    id: string | number; // Bisa 'banner-main', id database (number), atau file id unik (string)
    type: 'existing' | 'file';
    url: string; // URL preview (baik URL backend atau URL.createObjectURL)
    file?: File; // File asli jika tipenya adalah upload baru
}

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
    image_files?: File[];
    images?: { id: number; image_url: string }[];
}

interface DestinationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => Promise<void> | void;
    initialData?: DestinationItem | null;
}

const DEFAULT_REGION = 'Padukuhan Gembyong (Jurug Gedhe)';

export default function DestinationModal({ isOpen, onClose, onSave, initialData }: DestinationModalProps) {
    const [name, setName] = useState('');
    const [entryType, setEntryType] = useState<'destination' | 'package'>('destination');
    const [type, setType] = useState(DEFAULT_REGION);
    const [price, setPrice] = useState<number | ''>(35000);
    const [revenueShare, setRevenueShare] = useState<number | ''>(0);
    const [quota, setQuota] = useState<number | ''>(50);
    const [status, setStatus] = useState<'Aktif' | 'Darurat Ditutup'>('Aktif');
    const [description, setDescription] = useState('');
    
    // Gunakan 1 state gabungan untuk galeri agar aman saat digeser-geser
    const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const getFullImageUrl = (url?: string) => {
        if (!url) return '';
        if (url.startsWith('blob:') || url.startsWith('http://') || url.startsWith('https://')) {
            return url;
        }
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000';
        return `${backendUrl}${url.startsWith('/') ? '' : '/'}${url}`;
    };

    useEffect(() => {
        if (initialData) {
            setName(initialData.name || '');
            setEntryType(initialData.type_entry || 'destination');
            setType(initialData.type || DEFAULT_REGION);
            setPrice(initialData.price ?? 35000);
            setRevenueShare(initialData.umkm_revenue_share ?? 0);
            setQuota(initialData.quota ?? 50);
            setStatus(initialData.status || 'Aktif');
            setDescription(initialData.description || '');

            const initialItems: GalleryItem[] = [];

            // Masukkan SEMUA gambar dari relasi images (karena banner utama sudah disinkronkan di urutan pertama oleh backend)
            if (initialData.images && initialData.images.length > 0) {
                initialData.images.forEach(img => {
                    initialItems.push({
                        id: img.id, // Pastikan ini murni angka ID dari database
                        type: 'existing',
                        url: getFullImageUrl(img.image_url),
                    });
                });
            } else if (initialData.image_url) {
                // Fallback jika relasi kosong tapi image_url ada
                initialItems.push({
                    id: 'banner-fallback',
                    type: 'existing',
                    url: getFullImageUrl(initialData.image_url),
                });
            }

            setGalleryItems(initialItems);
        } else {
            // Reset form untuk mode Tambah (Add)
            setName('');
            setEntryType('destination');
            setType(DEFAULT_REGION);
            setPrice(35000);
            setRevenueShare(0);
            setQuota(50);
            setStatus('Aktif');
            setDescription('');
            setGalleryItems([]);
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleFilesChange = (files: FileList | File[]) => {
        const newFiles = Array.from(files);
        const newItems: GalleryItem[] = newFiles.map(file => ({
            id: `file-${Date.now()}-${Math.random()}`,
            type: 'file',
            url: URL.createObjectURL(file),
            file: file,
        }));

        setGalleryItems(prev => [...prev, ...newItems]);
    };

    const handleRemoveImage = (index: number) => {
        setGalleryItems(prev => prev.filter((_, i) => i !== index));
    };

    // Fungsi reorder yang jauh lebih bersih karena menggunakan 1 state tunggal
    const handleReorderImages = (dragIndex: number, hoverIndex: number) => {
        setGalleryItems(prev => {
            const updated = [...prev];
            const [movedItem] = updated.splice(dragIndex, 1);
            updated.splice(hoverIndex, 0, movedItem);
            return updated;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Hanya ambil ID yang berupa angka valid dari database (cegah string 'banner-main' ikut terkirim)
            const validExistingItems = galleryItems.filter(
                item => item.type === 'existing' && typeof item.id === 'number'
            );

            const existingImageIds = validExistingItems.map(item => item.id as number);
            const imageOrders = validExistingItems.map(item => item.id as number);

            const imageFiles = galleryItems
                .filter(item => item.type === 'file' && item.file)
                .map(item => item.file as File);

            await onSave({
                id: initialData ? initialData.id : Date.now(),
                name,
                type_entry: entryType,
                type,
                price: Number(price) || 0,
                umkm_revenue_share: Number(revenueShare) || 0,
                quota: Number(quota) || 0,
                status,
                description,
                image_files: imageFiles,          
                existing_image_ids: existingImageIds, 
                image_orders: imageOrders, // Sekarang aman dari string sampah!
            });
        } finally {
            setIsLoading(false);
        }
    };

    const combinedPreviews = galleryItems.map(item => item.url);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
            <DestinationFormContent
                isEdit={!!initialData}
                name={name}
                setName={setName}
                entryType={entryType}
                setEntryType={setEntryType}
                type={type}
                setType={setType}
                price={price}
                setPrice={setPrice}
                revenueShare={revenueShare}
                setRevenueShare={setRevenueShare}
                quota={quota}
                setQuota={setQuota}
                status={status}
                setStatus={setStatus}
                description={description}
                setDescription={setDescription}
                imagePreviews={combinedPreviews}
                isDragging={isDragging}
                setIsDragging={setIsDragging}
                onFilesChange={handleFilesChange}
                onRemoveImage={handleRemoveImage}
                onReorderImages={handleReorderImages}
                onSubmit={handleSubmit}
                onClose={onClose}
                isLoading={isLoading}
            />
        </div>
    );
}