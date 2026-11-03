<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Models\UmkmProduct;
use App\Models\ConsignmentSettlement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    /**
     * 1. Infografik & Statistik Utama Dashboard Admin (Pokdarwis)
     */
    public function dashboardStats(Request $request)
    {
        // Hitung total pendapatan kotor (gross revenue) dari tiket yang sudah dibayar/lunas
        $totalRevenue = Ticket::where('payment_status', 'paid')->sum('total_price');
        
        // Total wisatawan berkunjung (berdasarkan jumlah orang yang lunas)
        $totalVisitors = Ticket::where('payment_status', 'paid')->sum('visitor_count');
        
        // Total transaksi tiket lunas
        $totalTickets = Ticket::where('payment_status', 'paid')->count();
        
        // Total produk UMKM yang terjual via bundling/transaksi lunas
        $totalProductsSold = DB::table('ticket_items')
            ->join('tickets', 'ticket_items.ticket_id', '=', 'tickets.id')
            ->where('tickets.payment_status', 'paid')
            ->sum('ticket_items.quantity');

        // Data Grafik Tren Kunjungan & Pendapatan Harian (7 hari terakhir atau sesuai filter)
        $visitorChart = Ticket::select(
                DB::raw('DATE(visit_date) as date'),
                DB::raw('SUM(visitor_count) as total_visitors'),
                DB::raw('SUM(total_price) as total_income')
            )
            ->where('payment_status', 'paid')
            ->groupBy('date')
            ->orderBy('date', 'ASC')
            ->take(7)
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => [
                'summary' => [
                    'total_revenue' => (int) $totalRevenue,
                    'total_visitors' => (int) $totalVisitors,
                    'total_tickets' => (int) $totalTickets,
                    'total_products_sold' => (int) $totalProductsSold,
                ],
                'visitor_chart' => $visitorChart,
            ]
        ]);
    }

    /**
     * 2. Modul Laporan Rekapitulasi Akhir Bulan (EOM - End of Month / Revenue Sharing UMKM)
     * Sesuai arahan dosen: Menghitung akumulasi hak bagi hasil UMKM di akhir bulan.
     */
    public function endOfMonthConsignmentReport(Request $request)
    {
        // Parameter filter bulan dan tahun (Contoh: ?month=11&year=2026)
        $month = $request->input('month', date('m'));
        $year = $request->input('year', date('Y'));

        // Ambil rekap item produk UMKM yang terjual melalui tiket lunas pada bulan & tahun tersebut
        $reportItems = DB::table('ticket_items')
            ->join('tickets', 'ticket_items.ticket_id', '=', 'tickets.id')
            ->join('umkm_products', 'ticket_items.umkm_product_id', '=', 'umkm_products.id')
            ->where('tickets.payment_status', 'paid')
            ->whereMonth('tickets.visit_date', $month)
            ->whereYear('tickets.visit_date', $year)
            ->select(
                'umkm_products.id as product_id',
                'umkm_products.name as product_name',
                'umkm_products.umkm_share_amount', // Hak bagi hasil per unit untuk UMKM
                DB::raw('SUM(ticket_items.quantity) as total_qty_sold'),
                DB::raw('SUM(ticket_items.subtotal_price) as total_gross_sales')
            )
            ->groupBy('umkm_products.id', 'umkm_products.name', 'umkm_products.umkm_share_amount')
            ->get();

        // Hitung rincian total bagi hasil untuk masing-masing UMKM
        $formattedReport = $reportItems->map(function ($item) {
            // Total hak bagi hasil = Jumlah terjual * nominal umkm_share_amount per produk
            $totalUmkmShare = $item->total_qty_sold * $item->umkm_share_amount;
            // Bagian Pokdarwis = Total penjualan kotor produk - Bagian UMKM
            $totalPokdarwisShare = $item->total_gross_sales - $totalUmkmShare;

            return [
                'product_id' => $item->product_id,
                'product_name' => $item->product_name,
                'total_qty_sold' => (int) $item->total_qty_sold,
                'total_gross_sales' => (int) $item->total_gross_sales,
                'umkm_share_per_unit' => (int) $item->umkm_share_amount,
                'total_umkm_income' => (int) $totalUmkmShare,        // Hak UMKM (EOM Payout)
                'total_pokdarwis_income' => (int) $totalPokdarwisShare, // Hak Pengelola Pokdarwis
            ];
        });

        return response()->json([
            'status' => 'success',
            'period' => [
                'month' => $month,
                'year' => $year,
            ],
            'data' => $formattedReport
        ]);
    }
}