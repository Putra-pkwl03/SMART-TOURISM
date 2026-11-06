'use client';

import { useCallback, useEffect, useState } from 'react';
import { Store } from 'lucide-react';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';
import { apiClient } from '@/app/lib/axios';
import CashierCart from '@/app/components/dashboard/umkm/cashier/CashierCart';
import CashierReceiptModal from '@/app/components/dashboard/umkm/cashier/CashierReceiptModal';
import type { OfflineReceiptData } from '@/app/components/dashboard/umkm/cashier/CashierReceiptModal';
import CashierProductGrid from '@/app/components/dashboard/umkm/cashier/CashierProductGrid';
import type { CashierCartItem, CashierProduct } from '@/app/components/dashboard/umkm/cashier/types';

export default function UmkmCashierPage() {
    const [products, setProducts] = useState<CashierProduct[]>([]);
    const [cart, setCart] = useState<CashierCartItem[]>([]);
    const [search, setSearch] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'manual_transfer'>('cash');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [completedSale, setCompletedSale] = useState<OfflineReceiptData | null>(null);

    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            const response = await apiClient.get('/umkm/cashier/products');
            setProducts(response.data.data ?? []);
        } catch (error: unknown) {
            console.error('Error fetching cashier products:', error);
            toast.error(isAxiosError(error) && error.response?.status === 401
                ? 'Sesi habis atau belum login. Silakan login kembali.'
                : 'Gagal memuat produk kasir.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            void fetchProducts();
        }, 0);
        return () => window.clearTimeout(timeoutId);
    }, [fetchProducts]);

    const addProduct = (product: CashierProduct) => {
        setCart((current) => {
            const existing = current.find((item) => item.product.id === product.id);
            if (existing) {
                if (existing.quantity >= product.stock) {
                    toast.error(`Stok ${product.name} tidak mencukupi.`);
                    return current;
                }
                return current.map((item) => item.product.id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item);
            }
            return [...current, { product, quantity: 1 }];
        });
    };

    const changeQuantity = (productId: number, quantity: number) => {
        if (quantity <= 0) {
            setCart((current) => current.filter((item) => item.product.id !== productId));
            return;
        }
        setCart((current) => current.map((item) => item.product.id === productId
            ? { ...item, quantity: Math.min(quantity, item.product.stock) }
            : item));
    };

    const processSale = async () => {
        if (cart.length === 0 || submitting) return;

        try {
            setSubmitting(true);
            const response = await apiClient.post<{ data: OfflineReceiptData }>('/umkm/cashier/sales', {
                payment_method: paymentMethod,
                items: cart.map(({ product, quantity }) => ({
                    umkm_product_id: product.id,
                    quantity,
                })),
            });
            setCompletedSale(response.data.data);
            toast.success(`Transaksi ${response.data.data.receipt_code} berhasil dicatat.`);
            setCart([]);
            await fetchProducts();
        } catch (error: unknown) {
            console.error('Error processing cashier sale:', error);
            const message = isAxiosError<{ message?: string; errors?: Record<string, string[]> }>(error)
                ? error.response?.data?.errors?.items?.[0] ?? error.response?.data?.message
                : undefined;
            toast.error(message || 'Transaksi gagal diproses. Periksa stok dan coba lagi.');
            await fetchProducts();
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 text-gray-900">
            <header className="flex items-center gap-4 py-2">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl border border-emerald-200/50 bg-emerald-100/70 text-emerald-700 shadow-sm">
                    <Store className="h-8 w-8" />
                </div>
                <div>
                    <h1 className="text-lg font-extrabold tracking-tight text-slate-900">Kasir / Transaksi Offline</h1>
                    <p className="mt-1 text-xs font-medium leading-relaxed text-slate-600">
                        Catat pembelian langsung di lapak. Stok dan laporan penjualan diperbarui setelah transaksi berhasil.
                    </p>
                </div>
            </header>

            <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
                <CashierProductGrid
                    products={products}
                    loading={loading}
                    search={search}
                    onSearchChange={setSearch}
                    onAdd={addProduct}
                />
                <CashierCart
                    items={cart}
                    paymentMethod={paymentMethod}
                    submitting={submitting}
                    onPaymentMethodChange={setPaymentMethod}
                    onQuantityChange={changeQuantity}
                    onCheckout={processSale}
                />
            </div>
            <CashierReceiptModal sale={completedSale} onClose={() => setCompletedSale(null)} />
        </div>
    );
}
