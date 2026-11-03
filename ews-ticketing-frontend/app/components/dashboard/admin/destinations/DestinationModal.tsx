'use client';

import { useState, useEffect } from 'react';
import DestinationFormContent from './DestinationFormContent';
import { apiClient } from '@/app/lib/axios';
import { getBackendUrl } from '@/app/lib/backend-url';
import { DestinationItem } from './DestinationTable'; 

interface GalleryItem {
    id: string | number; 
    type: 'existing' | 'file';
    url: string; 
    file?: File; 
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
    const [quota, setQuota] = useState<number | ''>(50);
    const [status, setStatus] = useState<'Aktif' | 'Darurat Ditutup'>('Aktif');
    const [description, setDescription] = useState('');
    
    // State untuk fitur Bundling UMKM
    const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);

    // Galeri foto
    const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const getFullImageUrl = (url?: string) => {
        if (!url) return '';
        if (url.startsWith('blob:') || url.startsWith('http://') || url.startsWith('https://')) {
            return url;
        }
        const backendUrl = getBackendUrl();
        return `${backendUrl}${url.startsWith('/') ? '' : '/'}${url}`;
    };

    useEffect(() => {
        if (initialData) {
            setName(initialData.name || '');
            setEntryType((initialData.type_entry as 'destination' | 'package') || 'destination');
            setType(initialData.type || DEFAULT_REGION);
            setPrice(initialData.price ?? 35000);
            setQuota(initialData.quota ?? 50);
            setStatus(initialData.status || 'Aktif');
            setDescription(initialData.description || '');

            if (initialData.umkm_products && initialData.umkm_products.length > 0) {
                setSelectedProductIds(initialData.umkm_products.map(p => p.id));
            } else {
                setSelectedProductIds([]);
            }

            const initialItems: GalleryItem[] = [];

            if (initialData.images && initialData.images.length > 0) {
                initialData.images.forEach(img => {
                    if (img.image_url || img.image_path) {
                        initialItems.push({
                            id: img.id, 
                            type: 'existing',
                            url: getFullImageUrl(img.image_url || img.image_path),
                        });
                    }
                });
            } else if (initialData.image_url) {
                initialItems.push({
                    id: 'banner-fallback',
                    type: 'existing',
                    url: getFullImageUrl(initialData.image_url),
                });
            }

            setGalleryItems(initialItems);
        } else {
            setName('');
            setEntryType('destination');
            setType(DEFAULT_REGION);
            setPrice(35000);
            setQuota(50);
            setStatus('Aktif');
            setDescription('');
            setSelectedProductIds([]);
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
                quota: Number(quota) || 0,
                status,
                description,
                image_files: imageFiles,          
                existing_image_ids: existingImageIds, 
                image_orders: imageOrders,
                umkm_product_ids: selectedProductIds,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const combinedPreviews = galleryItems.map(item => item.url);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto">
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
                    selectedProductIds={selectedProductIds}
                    setSelectedProductIds={setSelectedProductIds}
                />
            </div>
        </div>
    );
}