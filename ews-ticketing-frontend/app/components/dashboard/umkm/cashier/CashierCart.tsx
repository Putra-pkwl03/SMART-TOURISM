'use client';

import { Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import type { CashierCartItem } from './types';

interface CashierCartProps {
    items: CashierCartItem[];
    paymentMethod: 'cash' | 'manual_transfer';
    submitting: boolean;
    onPaymentMethodChange: (method: 'cash' | 'manual_transfer') => void;
    onQuantityChange: (productId: number, quantity: number) => void;
    onCheckout: () => void;
}

const formatRupiah = (amount: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);

export default function CashierCart({
    items,
    paymentMethod,
    submitting,
    onPaymentMethodChange,
    onQuantityChange,
    onCheckout,
}: CashierCartProps) {
    const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    return (
        <aside className="h-fit rounded-3xl border border-slate-100 bg-white p-5 shadow-sm xl:sticky xl:top-6">
            <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                    <ShoppingCart className="h-5 w-5" />
                </div>
                <div>
                    <h2 className="font-extrabold text-slate-900">Keranjang Transaksi</h2>
                    <p className="text-xs text-slate-500">{items.length} jenis produk</p>
                </div>
            </div>

            {items.length === 0 ? (
                <div className="rounded-2xl bg-slate-50 p-6 text-center text-sm text-slate-500">
                    Pilih produk untuk memulai transaksi.
                </div>
            ) : (
                <div className="max-h-[42vh] space-y-4 overflow-y-auto pr-1">
                    {items.map(({ product, quantity }) => (
                        <div key={product.id} className="border-b border-slate-100 pb-4 last:border-0">
                            <div className="flex items-start justify-between gap-2">
                                <div>
                                    <p className="text-sm font-bold text-slate-800">{product.name}</p>
                                    <p className="mt-1 text-xs text-slate-500">{formatRupiah(product.price)} / item</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => onQuantityChange(product.id, 0)}
                                    aria-label={`Hapus ${product.name} dari keranjang`}
                                    className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                            <div className="mt-3 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => onQuantityChange(product.id, quantity - 1)}
                                        aria-label={`Kurangi jumlah ${product.name}`}
                                        className="rounded-lg border border-slate-200 p-1.5 text-slate-600 disabled:opacity-40"
                                        disabled={quantity <= 1}
                                    >
                                        <Minus className="h-3.5 w-3.5" />
                                    </button>
                                    <span className="min-w-6 text-center text-sm font-bold">{quantity}</span>
                                    <button
                                        type="button"
                                        onClick={() => onQuantityChange(product.id, quantity + 1)}
                                        aria-label={`Tambah jumlah ${product.name}`}
                                        className="rounded-lg border border-slate-200 p-1.5 text-slate-600 disabled:opacity-40"
                                        disabled={quantity >= product.stock}
                                    >
                                        <Plus className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                                <span className="text-sm font-bold text-slate-800">{formatRupiah(product.price * quantity)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="mt-5 space-y-4 border-t border-slate-100 pt-4">
                <label className="block text-xs font-bold text-slate-600">
                    Pembayaran di lapak
                    <select
                        value={paymentMethod}
                        onChange={(event) => onPaymentMethodChange(event.target.value === 'manual_transfer' ? 'manual_transfer' : 'cash')}
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-800 outline-none focus:border-emerald-500"
                    >
                        <option value="cash">Tunai</option>
                        <option value="manual_transfer">Transfer manual</option>
                    </select>
                </label>
                <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-600">Total transaksi</span>
                    <span className="text-lg font-extrabold text-slate-900">{formatRupiah(total)}</span>
                </div>
                <button
                    type="button"
                    onClick={onCheckout}
                    disabled={items.length === 0 || submitting}
                    className="w-full rounded-xl bg-emerald-700 py-3 text-sm font-bold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                    {submitting ? 'Memproses...' : 'Proses Transaksi'}
                </button>
                <p className="text-center text-[11px] leading-relaxed text-slate-400">
                    Pembayaran dilakukan langsung di lapak. Transaksi akan dicatat dan stok diperbarui setelah diproses.
                </p>
            </div>
        </aside>
    );
}
