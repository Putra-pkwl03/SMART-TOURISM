<?php

namespace App\Http\Controllers;

use App\Models\ConsignmentSettlement;
use App\Models\UmkmProduct;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UmkmDashboardController extends Controller
{
    public function index(Request $request)
    {
        if ($request->user()->role !== 'umkm_mitra') {
            return response()->json(['message' => 'Akses hanya untuk mitra UMKM.'], 403);
        }

        $validated = $request->validate([
            'period' => 'nullable|integer|in:7,30,90',
        ]);

        $userId = $request->user()->umkm_id ?? $request->user()->id;
        $period = (int) ($validated['period'] ?? 30);
        $today = Carbon::today();
        $monthStart = $today->copy()->startOfMonth();
        $monthEnd = $today->copy()->endOfDay();
        $trendStart = $today->copy()->subDays($period - 1)->startOfDay();

        $products = UmkmProduct::query()
            ->where('umkm_id', $userId)
            ->with(['images' => fn ($query) => $query->orderByDesc('is_primary')->limit(1)])
            ->get(['id', 'name', 'price', 'stock', 'is_active']);

        $monthlySales = ConsignmentSettlement::query()
            ->join('umkm_products', 'umkm_products.id', '=', 'consignment_settlements.umkm_product_id')
            ->where('umkm_products.umkm_id', $userId)
            ->whereBetween('consignment_settlements.created_at', [$monthStart, $monthEnd])
            ->selectRaw('
                COALESCE(SUM(consignment_settlements.qty), 0) as sold_quantity,
                COALESCE(SUM(consignment_settlements.qty * umkm_products.price), 0) as gross_sales,
                COALESCE(SUM(consignment_settlements.total_umkm_income), 0) as estimated_income
            ')
            ->first();

        $dailySales = ConsignmentSettlement::query()
            ->join('umkm_products', 'umkm_products.id', '=', 'consignment_settlements.umkm_product_id')
            ->where('umkm_products.umkm_id', $userId)
            ->whereBetween('consignment_settlements.created_at', [$trendStart, $monthEnd])
            ->selectRaw('DATE(consignment_settlements.created_at) as sale_date, SUM(consignment_settlements.qty) as quantity')
            ->groupBy('sale_date')
            ->pluck('quantity', 'sale_date');

        $trend = collect(CarbonPeriod::create($trendStart->toDateString(), $today->toDateString()))
            ->map(fn (Carbon $date) => [
                'date' => $date->toDateString(),
                'label' => $date->locale('id')->translatedFormat('j M'),
                'quantity' => (int) ($dailySales->get($date->toDateString()) ?? 0),
            ])
            ->values();

        $monthlyProductSales = ConsignmentSettlement::query()
            ->join('umkm_products', 'umkm_products.id', '=', 'consignment_settlements.umkm_product_id')
            ->where('umkm_products.umkm_id', $userId)
            ->whereBetween('consignment_settlements.created_at', [$monthStart, $monthEnd])
            ->select(
                'umkm_products.id',
                'umkm_products.name',
                'umkm_products.price',
                'umkm_products.stock',
                DB::raw('SUM(consignment_settlements.qty) as sold_quantity')
            )
            ->groupBy('umkm_products.id', 'umkm_products.name', 'umkm_products.price', 'umkm_products.stock')
            ->get();

        $productSales = $monthlyProductSales->sortByDesc('sold_quantity')->take(5)->values();
        $productImages = UmkmProduct::query()
            ->whereIn('id', $productSales->pluck('id'))
            ->with(['images' => fn ($query) => $query->orderByDesc('is_primary')->limit(1)])
            ->get()
            ->keyBy('id');

        $topProducts = $productSales->map(function ($product) use ($productImages) {
            return [
                'id' => (int) $product->id,
                'name' => $product->name,
                'price' => (int) $product->price,
                'stock' => (int) $product->stock,
                'sold_quantity' => (int) $product->sold_quantity,
                'gross_sales' => (int) ($product->sold_quantity * $product->price),
                'image_path' => $productImages->get($product->id)?->images->first()?->image_path,
            ];
        });

        return response()->json([
            'summary' => [
                'total_products' => $products->count(),
                'low_stock_count' => $products->where('stock', '<=', 5)->count(),
                'monthly_sold_quantity' => (int) ($monthlySales->sold_quantity ?? 0),
                'monthly_gross_sales' => (int) ($monthlySales->gross_sales ?? 0),
                'monthly_estimated_income' => (int) ($monthlySales->estimated_income ?? 0),
            ],
            'period' => $period,
            'sales_trend' => $trend,
            'product_composition' => $monthlyProductSales->map(fn ($product) => [
                'name' => $product->name,
                'quantity' => (int) $product->sold_quantity,
            ])->values(),
            'top_products' => $topProducts,
        ]);
    }
}
