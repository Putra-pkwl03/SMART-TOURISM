<?php

namespace App\Http\Controllers;

use App\Models\ConsignmentSettlement;
use App\Models\EwsTelemetry;
use App\Models\Ticket;
use App\Models\UmkmProduct;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminDashboardController extends Controller
{
    public function index(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Akses hanya untuk admin.'], 403);
        }

        $validated = $request->validate([
            'period' => 'nullable|integer|in:7,30,90',
        ]);

        $period = (int) ($validated['period'] ?? 7);
        $end = Carbon::today()->endOfDay();
        $start = Carbon::today()->subDays($period - 1)->startOfDay();
        $previousStart = (clone $start)->subDays($period);
        $previousEnd = (clone $start)->subSecond();

        $visitorsByDate = Ticket::query()
            ->where('ticket_status', 'used')
            ->whereBetween('used_at', [$start, $end])
            ->selectRaw('DATE(used_at) as visit_day, SUM(visitor_count) as visitor_count')
            ->groupBy('visit_day')
            ->pluck('visitor_count', 'visit_day');

        $visitors = (int) $visitorsByDate->sum();
        $previousVisitors = (int) Ticket::query()
            ->where('ticket_status', 'used')
            ->whereBetween('used_at', [$previousStart, $previousEnd])
            ->sum('visitor_count');

        $visitorChange = $previousVisitors > 0
            ? round((($visitors - $previousVisitors) / $previousVisitors) * 100, 1)
            : null;

        $visitorTrend = collect(CarbonPeriod::create($start->toDateString(), $end->toDateString()))
            ->map(fn (Carbon $date) => [
                'date' => $date->toDateString(),
                'label' => $date->locale('id')->translatedFormat('D'),
                'visitors' => (int) ($visitorsByDate->get($date->toDateString()) ?? 0),
            ])
            ->values();

        $latestEws = EwsTelemetry::query()->latest()->first();
        $ewsHistory = EwsTelemetry::query()
            ->latest()
            ->limit(12)
            ->get(['id', 'water_level', 'rainfall', 'temperature', 'humidity', 'status', 'created_at'])
            ->reverse()
            ->values()
            ->map(fn (EwsTelemetry $reading) => [
                'water_level' => (float) $reading->water_level,
                'rainfall' => (float) $reading->rainfall,
                'temperature' => (float) $reading->temperature,
                'humidity' => (float) $reading->humidity,
                'status' => $reading->status,
                'created_at' => $reading->created_at,
            ]);

        $paidTickets = Ticket::query()
            ->where('payment_status', 'paid')
            ->whereBetween('created_at', [$start, $end])
            ->with('consignmentSettlements:id,ticket_id,total_umkm_income')
            ->get(['id', 'total_price']);

        $ticketRevenue = 0;
        $bundlingRevenue = 0;
        foreach ($paidTickets as $ticket) {
            $gross = (int) $ticket->total_price;
            $umkmShare = min(
                $gross,
                (int) $ticket->consignmentSettlements->sum('total_umkm_income')
            );
            $bundlingRevenue += $umkmShare;
            $ticketRevenue += $gross - $umkmShare;
        }

        $latestTickets = Ticket::query()
            ->with(['user:id,name'])
            ->latest()
            ->limit(5)
            ->get([
                'id',
                'ticket_code',
                'user_id',
                'visitor_count',
                'total_price',
                'payment_status',
                'ticket_status',
                'created_at',
            ])
            ->map(fn (Ticket $ticket) => [
                'id' => $ticket->id,
                'code' => $ticket->ticket_code,
                'visitor' => $ticket->user?->name ?? 'Wisatawan',
                'count' => (int) $ticket->visitor_count,
                'total' => (int) $ticket->total_price,
                'status' => $ticket->payment_status === 'paid'
                    ? $ticket->ticket_status
                    : $ticket->payment_status,
                'created_at' => $ticket->created_at,
            ]);

        $consignmentProducts = UmkmProduct::query()
            ->where('is_active', true)
            ->with(['images' => fn ($query) => $query->orderByDesc('is_primary')->limit(1)])
            ->orderByDesc('stock')
            ->limit(3)
            ->get(['id', 'name', 'stock'])
            ->map(fn (UmkmProduct $product) => [
                'id' => $product->id,
                'name' => $product->name,
                'stock' => (int) $product->stock,
                'image_path' => $product->images->first()?->image_path,
            ]);

        return response()->json([
            'period' => $period,
            'ews' => $latestEws ? [
                'water_level' => $latestEws->water_level.' m',
                'rainfall' => $latestEws->rainfall.' mm/h',
                'temperature' => $latestEws->temperature.' °C',
                'humidity' => $latestEws->humidity.' %',
                'status' => $latestEws->status,
                'description' => $latestEws->description ?? 'Data sensor EWS terbaru.',
            ] : null,
            'ews_history' => $ewsHistory,
            'summary' => [
                'visitors' => $visitors,
                'visitor_change_percent' => $visitorChange,
                'ticket_revenue' => $ticketRevenue,
                'bundling_revenue' => $bundlingRevenue,
                'total_revenue' => $ticketRevenue + $bundlingRevenue,
                'bundling_sales' => (int) DB::table('ticket_items')
                    ->join('tickets', 'tickets.id', '=', 'ticket_items.ticket_id')
                    ->where('tickets.payment_status', 'paid')
                    ->whereBetween('tickets.created_at', [$start, $end])
                    ->sum('ticket_items.quantity'),
                'pending_consignments' => (int) ConsignmentSettlement::query()
                    ->where('status', 'pending')
                    ->count(),
            ],
            'visitor_trend' => $visitorTrend,
            'revenue_composition' => [
                ['name' => 'Tiket', 'amount' => $ticketRevenue],
                ['name' => 'Bundling UMKM', 'amount' => $bundlingRevenue],
            ],
            'recent_tickets' => $latestTickets,
            'consignment_products' => $consignmentProducts,
        ]);
    }
}
