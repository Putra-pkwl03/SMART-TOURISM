'use client';

import { Printer, ReceiptText, X } from 'lucide-react';
import { toast } from 'sonner';

export interface OfflineReceiptItem {
    qty: number;
    unit_price?: number | null;
    umkm_product?: {
        name?: string;
    } | null;
}

export interface OfflineReceiptData {
    receipt_code: string;
    payment_method: 'cash' | 'manual_transfer';
    total_amount: number;
    created_at?: string;
    items: OfflineReceiptItem[];
    cashier?: {
        name?: string;
    } | null;
}

interface CashierReceiptModalProps {
    sale: OfflineReceiptData | null;
    onClose: () => void;
}

const formatRupiah = (amount: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);

const escapeHtml = (value: string) =>
    value.replace(/[&<>"']/g, (character) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
    })[character] || character);

export default function CashierReceiptModal({ sale, onClose }: CashierReceiptModalProps) {
    if (!sale) return null;

    const printReceipt = () => {
        const printWindow = window.open('', '_blank', 'width=420,height=720');
        if (!printWindow) {
            toast.error('Izinkan pop-up browser untuk mencetak struk.');
            return;
        }

        const rows = sale.items.map((item) => {
            const name = escapeHtml(item.umkm_product?.name || 'Produk UMKM');
            const quantity = Number(item.qty);
            const price = Number(item.unit_price || 0);
            return `<tr><td>${name}<br><small>${quantity} x ${formatRupiah(price)}</small></td><td class="amount">${formatRupiah(quantity * price)}</td></tr>`;
        }).join('');
        const date = sale.created_at
            ? new Date(sale.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })
            : new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });

        printWindow.document.write(`<!doctype html>
            <html lang="id">
            <head>
                <meta charset="utf-8">
                <title>Struk ${escapeHtml(sale.receipt_code)}</title>
                <style>
                    body{font:14px Arial,sans-serif;color:#111;max-width:360px;margin:24px auto;padding:0 16px}
                    h1,p{text-align:center;margin:6px 0}h1{font-size:18px}
                    .muted{color:#555;font-size:12px}
                    hr{border:0;border-top:1px dashed #888;margin:14px 0}
                    table{width:100%;border-collapse:collapse}td{padding:7px 0;vertical-align:top}
                    .amount{text-align:right;white-space:nowrap;padding-left:8px}
                    .total{font-weight:bold;font-size:16px}
                    @media print{body{margin:0 auto}}
                </style>
            </head>
            <body>
                <h1>Struk Penjualan UMKM</h1>
                <p class="muted">${escapeHtml(sale.receipt_code)}</p>
                <hr>
                <p class="muted">${escapeHtml(date)}</p>
                <p class="muted">Kasir: ${escapeHtml(sale.cashier?.name || '-')}</p>
                <p class="muted">Pembayaran: ${sale.payment_method === 'cash' ? 'Tunai' : 'Transfer manual'}</p>
                <hr>
                <table><tbody>${rows}</tbody></table>
                <hr>
                <table><tbody><tr class="total"><td>Total</td><td class="amount">${formatRupiah(Number(sale.total_amount))}</td></tr></tbody></table>
                <hr>
                <p class="muted">Terima kasih telah berbelanja produk UMKM lokal.</p>
                <script>window.onload=()=>{window.print();window.onafterprint=()=>window.close()}</script>
            </body>
            </html>`);
        printWindow.document.close();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm" onClick={onClose}>
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="cashier-receipt-title"
                className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="mb-5 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                            <ReceiptText className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 id="cashier-receipt-title" className="font-extrabold text-slate-900">Transaksi Berhasil</h2>
                            <p className="text-xs text-slate-500">Struk penjualan offline</p>
                        </div>
                    </div>
                    <button type="button" aria-label="Tutup struk" onClick={onClose} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="rounded-2xl border border-dashed border-slate-300 p-5">
                    <div className="border-b border-dashed border-slate-300 pb-4 text-center">
                        <h3 className="font-extrabold text-slate-900">Struk Penjualan UMKM</h3>
                        <p className="mt-1 font-mono text-sm font-bold text-emerald-700">{sale.receipt_code}</p>
                        <p className="mt-1 text-xs text-slate-500">
                            {sale.created_at
                                ? new Date(sale.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })
                                : new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                        </p>
                    </div>
                    <div className="space-y-3 py-4">
                        {sale.items.map((item, index) => (
                            <div key={`${item.umkm_product?.name || 'product'}-${index}`} className="flex justify-between gap-3 text-sm">
                                <div>
                                    <p className="font-semibold text-slate-800">{item.umkm_product?.name || 'Produk UMKM'}</p>
                                    <p className="text-xs text-slate-500">{item.qty} x {formatRupiah(Number(item.unit_price || 0))}</p>
                                </div>
                                <p className="shrink-0 font-bold text-slate-800">
                                    {formatRupiah(Number(item.qty) * Number(item.unit_price || 0))}
                                </p>
                            </div>
                        ))}
                    </div>
                    <div className="space-y-2 border-t border-dashed border-slate-300 pt-4 text-sm">
                        <div className="flex justify-between text-slate-600">
                            <span>Metode pembayaran</span>
                            <span className="font-semibold">{sale.payment_method === 'cash' ? 'Tunai' : 'Transfer manual'}</span>
                        </div>
                        <div className="flex justify-between text-base font-extrabold text-slate-900">
                            <span>Total</span>
                            <span>{formatRupiah(Number(sale.total_amount))}</span>
                        </div>
                    </div>
                    <p className="mt-5 text-center text-xs text-slate-500">Terima kasih telah berbelanja produk UMKM lokal.</p>
                </div>

                <div className="mt-5 flex gap-3">
                    <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50">
                        Tutup
                    </button>
                    <button type="button" onClick={printReceipt} className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-800">
                        <Printer className="h-4 w-4" /> Cetak Struk
                    </button>
                </div>
            </section>
        </div>
    );
}
