<?php

namespace App\Http\Controllers;

use App\Models\ConsignmentSettlement;
use App\Models\UmkmOfflineSale;
use App\Models\UmkmProduct;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Barryvdh\DomPDF\Facade\Pdf;

class UmkmSalesController extends Controller
{
    /**
     * Menampilkan daftar transaksi Penjualan & Hampers khusus untuk Role UMKM
     */
    public function index(Request $request)
    {
        if ($request->user()->role !== 'umkm_mitra') {
            return response()->json(['message' => 'Akses hanya untuk mitra UMKM.'], 403);
        }

        $userId = $request->user()->umkm_id ?? $request->user()->id;

        $query = ConsignmentSettlement::with([
            'ticket.user',
            'ticket.destination',
            'offlineSale.items.umkmProduct',
            'offlineSale.cashier',
            'umkmProduct.images'
        ])->whereHas('umkmProduct', function ($q) use ($userId) {
            $q->where('umkm_id', $userId);
        });

        // 1. Filter Pencarian Nama Produk / Hampers
        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('umkmProduct', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            });
        }

        // 2. Filter Jenis Penjualan (Bundling Tiket atau Standalone Toko Oleh-Oleh)
        if ($request->filled('sale_type')) {
            if ($request->sale_type === 'bundling') {
                $query->whereNotNull('ticket_id');
            } elseif ($request->sale_type === 'standalone') {
                $query->whereNull('ticket_id');
            }
        }

        // 3. Filter Status Pencairan (pending / paid)
        if ($request->filled('status') && $request->status !== 'ALL') {
            $query->where('status', $request->status);
        }

        // 4. Filter Berdasarkan Bulan & Tahun (Siklus EOM) atau Rentang Tanggal
        if ($request->filled('month') && $request->filled('year')) {
            $query->whereMonth('created_at', $request->month)
                  ->whereYear('created_at', $request->year);
        } elseif ($request->filled('start_date') && $request->filled('end_date')) {
            $query->whereBetween('created_at', [
                $request->start_date . ' 00:00:00', 
                $request->end_date . ' 23:59:59'
            ]);
        }

        $settlements = $query->latest()->get();

        // Hitung Total Stok Awal dari semua produk milik UMKM yang login
        $totalInitialStock = UmkmProduct::where('umkm_id', $userId)->sum('initial_stock');

        // Hitung Statistik Terjual & Kuantitas
        $totalItemsSold = $settlements->sum('qty');
        $totalStandaloneSold = $settlements->whereNull('ticket_id')->sum('qty');
        $totalBundlingSold = $settlements->whereNotNull('ticket_id')->sum('qty');
        
        // Menghitung jumlah unik transaksi tiket untuk bundling
        $totalBundlingTransactions = $settlements->whereNotNull('ticket_id')->unique('ticket_id')->count();

        // Hitung Pendapatan Kotor Keseluruhan (Gross Sales) dengan benar
        $totalGrossSales = $settlements->sum(function ($item) {
            return $item->qty * ($item->unit_price ?? $item->umkmProduct->price ?? 0);
        });

        // Pisahkan Omzet Pendapatan Standalone dan Bundling secara presisi
        $standaloneGrossSales = $settlements->whereNull('ticket_id')->sum(function ($item) {
            return $item->qty * ($item->unit_price ?? $item->umkmProduct->price ?? 0);
        });

        $bundlingGrossSales = $settlements->whereNotNull('ticket_id')->sum(function ($item) {
            return $item->qty * ($item->unit_price ?? $item->umkmProduct->price ?? 0);
        });
        
        $standaloneIncome = $settlements->whereNull('ticket_id')->sum(function ($item) {
            return $item->qty * ($item->unit_price ?? $item->umkmProduct->price ?? 0);
        });
        $bundlingSettlements = $settlements->whereNotNull('ticket_id');
        $bundlingUmkmIncome = $bundlingSettlements->sum('total_umkm_income');
        $totalPaidIncome = $bundlingSettlements->where('status', 'paid')->sum('total_umkm_income');
        $totalPendingIncome = $bundlingSettlements->where('status', 'pending')->sum('total_umkm_income');
        $totalPokdarwisShare = $bundlingSettlements->sum('total_pokdarwis_income');

        return response()->json([
            'status' => 'success',
            'message' => 'Data penjualan & hampers UMKM berhasil dimuat.',
            'summary' => [
                'total_initial_stock' => (int) $totalInitialStock,
                'total_items_sold' => (int) $totalItemsSold,
                'total_standalone_sold' => (int) $totalStandaloneSold,
                'standalone_gross_sales' => (int) $standaloneGrossSales,
                'total_bundling_sold' => (int) $totalBundlingSold,
                'bundling_gross_sales' => (int) $bundlingGrossSales,
                'total_bundling_transactions' => (int) $totalBundlingTransactions,
                'total_gross_sales' => (int) $totalGrossSales,
                'standalone_income' => (int) $standaloneIncome,
                'bundling_umkm_income' => (int) $bundlingUmkmIncome,
                'total_umkm_revenue' => (int) ($standaloneIncome + $bundlingUmkmIncome),
                'total_umkm_income' => (int) ($standaloneIncome + $bundlingUmkmIncome),
                'total_paid_income' => (int) $totalPaidIncome,
                'total_pending_income' => (int) $totalPendingIncome,
                'total_pokdarwis_share' => (int) $totalPokdarwisShare,
            ],
            'data' => $settlements
        ]);
    }

    /**
     * Menampilkan detail item transaksi penjualan produk/hampers tertentu
     */
    public function show($id)
    {
        $userId = auth()->id();

        $settlement = ConsignmentSettlement::with([
            'ticket.user',
            'ticket.destination',
            'ticket.validatedBy',
            'offlineSale',
            'umkmProduct.images'
        ])->whereHas('umkmProduct', function ($q) use ($userId) {
            $q->where('umkm_id', $userId);
        })->findOrFail($id);

        return response()->json([
            'status' => 'success',
            'data' => $settlement
        ]);
    }

    public function cashierProducts(Request $request)
    {
        if ($request->user()->role !== 'umkm_mitra') {
            return response()->json(['message' => 'Akses hanya untuk mitra UMKM.'], 403);
        }

        $umkmId = $request->user()->umkm_id ?? $request->user()->id;
        $products = UmkmProduct::query()
            ->with('images')
            ->where('umkm_id', $umkmId)
            ->where('is_active', true)
            ->orderBy('name')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $products,
        ]);
    }

    public function storeOfflineSale(Request $request)
    {
        if ($request->user()->role !== 'umkm_mitra') {
            return response()->json(['message' => 'Akses hanya untuk mitra UMKM.'], 403);
        }

        $validated = $request->validate([
            'payment_method' => 'required|in:cash,manual_transfer',
            'items' => 'required|array|min:1|max:50',
            'items.*.umkm_product_id' => 'required|integer|distinct|exists:umkm_products,id',
            'items.*.quantity' => 'required|integer|min:1|max:1000',
        ]);

        $user = $request->user();
        $umkmId = $user->umkm_id ?? $user->id;

        $sale = DB::transaction(function () use ($validated, $user, $umkmId) {
            $items = collect($validated['items'])->keyBy('umkm_product_id');
            $productIds = $items->keys()->sort()->values();
            $products = UmkmProduct::query()
                ->where('umkm_id', $umkmId)
                ->where('is_active', true)
                ->whereIn('id', $productIds)
                ->orderBy('id')
                ->lockForUpdate()
                ->get()
                ->keyBy('id');

            if ($products->count() !== $productIds->count()) {
                throw ValidationException::withMessages([
                    'items' => 'Satu atau lebih produk tidak tersedia untuk kasir UMKM ini.',
                ]);
            }

            foreach ($products as $product) {
                $quantity = (int) $items->get($product->id)['quantity'];
                if ($product->stock < $quantity) {
                    throw ValidationException::withMessages([
                        'items' => "Stok {$product->name} tidak mencukupi. Sisa stok: {$product->stock}.",
                    ]);
                }
            }

            $totalAmount = $products->sum(
                fn (UmkmProduct $product) => $product->price * (int) $items->get($product->id)['quantity']
            );

            $sale = UmkmOfflineSale::create([
                'cashier_id' => $user->id,
                'receipt_code' => 'POS-' . now()->format('ymd') . '-' . Str::upper(Str::random(6)),
                'payment_method' => $validated['payment_method'],
                'total_amount' => $totalAmount,
            ]);

            foreach ($products as $product) {
                $quantity = (int) $items->get($product->id)['quantity'];
                $umkmIncome = $product->price * $quantity;

                $product->decrement('stock', $quantity);

                $sale->items()->create([
                    'umkm_product_id' => $product->id,
                    'qty' => $quantity,
                    'unit_price' => $product->price,
                    'total_umkm_income' => $umkmIncome,
                    'total_pokdarwis_income' => 0,
                    'status' => 'paid',
                    'settled_at' => now(),
                    'notes' => 'Penjualan offline ' . $sale->receipt_code,
                ]);
            }

            return $sale->load('items.umkmProduct.images', 'cashier');
        });

        return response()->json([
            'status' => 'success',
            'message' => 'Transaksi offline berhasil dicatat dan stok produk telah diperbarui.',
            'data' => $sale,
        ], 201);
    }

    /**
     * Menampilkan rekapitulasi penjualan per item produk milik UMKM yang login
     */
    public function productSalesSummary(Request $request)
    {
        $userId = auth()->id();

        $summary = UmkmProduct::with(['images'])
            ->where('umkm_id', $userId)
            ->withCount(['consignmentSettlements as total_qty_sold' => function ($query) use ($request) {
                if ($request->filled('month') && $request->filled('year')) {
                    $query->whereMonth('created_at', $request->month)
                          ->whereYear('created_at', $request->year);
                }
                $query->select(DB::raw('SUM(qty)'));
            }])
            ->get()
            ->map(function ($product) {
                $qtySold = $product->total_qty_sold ?? 0;
                return [
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'price' => $product->price,
                    'stock_remaining' => $product->stock,
                    'initial_stock' => $product->initial_stock,
                    'total_sold' => (int) $qtySold,
                    'total_estimated_income' => (int) ($qtySold * $product->umkm_share_amount),
                    'is_low_stock' => $product->stock <= 5,
                    'images' => $product->images
                ];
            });

        return response()->json([
            'status' => 'success',
            'data' => $summary
        ]);
    }

    /**
     * Ekspor Laporan Pendapatan & Konsinyasi ke PDF khusus untuk Mitra UMKM
     */
    public function exportReport(Request $request)
    {
        $userId = auth()->id();

        $query = ConsignmentSettlement::with(['ticket.user', 'umkmProduct', 'offlineSale'])
            ->whereHas('umkmProduct', function ($q) use ($userId) {
                $q->where('umkm_id', $userId);
            });

        if ($request->filled('month') && $request->filled('year')) {
            $query->whereMonth('created_at', $request->month)
                  ->whereYear('created_at', $request->year);
        }

        $settlements = $query->latest()->get();

        $summary = [
            'total_qty' => $settlements->sum('qty'),
            'total_gross' => $settlements->sum(function ($item) {
                return $item->qty * ($item->unit_price ?? $item->umkmProduct->price ?? 0);
            }),
            'total_umkm_income' => (int) $settlements->sum('total_umkm_income'),
            'total_paid' => (int) $settlements->where('status', 'paid')->sum('total_umkm_income'),
            'total_pending' => (int) $settlements->where('status', 'pending')->sum('total_umkm_income'),
        ];

        $period = [
            'month' => $request->month ?? date('m'),
            'year' => $request->year ?? date('Y'),
        ];

        $pdf = Pdf::loadView('pdf.umkm-report', [
            'settlements' => $settlements,
            'summary' => $summary,
            'period' => $period,
        ]);

        $pdf->setPaper('a4', 'portrait');

        return $pdf->download('Laporan-Konsinyasi-UMKM-' . $period['month'] . '-' . $period['year'] . '.pdf');
    }
}