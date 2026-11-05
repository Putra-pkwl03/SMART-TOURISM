<?php

namespace App\Http\Controllers;

use App\Models\EwsTelemetry;
use App\Models\Ticket;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Http\Request;

class LoketDashboardController extends Controller
{
    public function index(Request $request)
    {
        if ($request->user()->role !== 'ticketing_officer') {
            return response()->json(['message' => 'Akses hanya untuk petugas loket.'], 403);
        }

        $validated = $request->validate([
            'period' => 'nullable|integer|in:7,30,90',
        ]);

        $period = (int) ($validated['period'] ?? 7);
        $today = Carbon::today();
        $start = (clone $today)->subDays($period - 1);

        $ticketsByDate = Ticket::query()
            ->where('ticket_status', 'used')
            ->whereBetween('used_at', [$start->copy()->startOfDay(), $today->copy()->endOfDay()])
            ->selectRaw('DATE(used_at) as scan_day, COUNT(*) as ticket_count, SUM(visitor_count) as visitor_count')
            ->groupBy('scan_day')
            ->get()
            ->keyBy('scan_day');

        $trend = collect(CarbonPeriod::create($start->toDateString(), $today->toDateString()))
            ->map(function (Carbon $date) use ($ticketsByDate) {
                $day = $ticketsByDate->get($date->toDateString());

                return [
                    'date' => $date->toDateString(),
                    'label' => $date->locale('id')->translatedFormat('D'),
                    'tickets' => (int) ($day?->ticket_count ?? 0),
                    'visitors' => (int) ($day?->visitor_count ?? 0),
                ];
            })
            ->values();

        $todayTickets = Ticket::query()
            ->where('ticket_status', 'used')
            ->whereBetween('used_at', [$today->copy()->startOfDay(), $today->copy()->endOfDay()]);

        $latestEws = EwsTelemetry::query()->latest()->first();
        $recentLogs = Ticket::query()
            ->with(['destination:id,name', 'user:id,name'])
            ->where('ticket_status', 'used')
            ->latest('used_at')
            ->limit(5)
            ->get([
                'id',
                'ticket_code',
                'destination_id',
                'user_id',
                'visitor_count',
                'visit_date',
                'used_at',
            ])
            ->map(fn (Ticket $ticket) => [
                'id' => $ticket->id,
                'ticket_code' => $ticket->ticket_code,
                'visitor_name' => $ticket->user?->name ?? 'Wisatawan',
                'destination_name' => $ticket->destination?->name ?? 'Destinasi Wisata',
                'visitor_count' => (int) $ticket->visitor_count,
                'used_at' => $ticket->used_at,
            ]);

        return response()->json([
            'period' => $period,
            'summary' => [
                'verified_tickets_today' => (int) (clone $todayTickets)->count(),
                'visitors_today' => (int) (clone $todayTickets)->sum('visitor_count'),
            ],
            'ews' => $latestEws ? [
                'water_level' => (float) $latestEws->water_level,
                'rainfall' => (float) $latestEws->rainfall,
                'temperature' => (float) $latestEws->temperature,
                'humidity' => (float) $latestEws->humidity,
                'status' => $latestEws->status,
                'description' => $latestEws->description,
                'updated_at' => $latestEws->updated_at,
                'sensor_online' => $latestEws->updated_at?->greaterThanOrEqualTo(now()->subMinutes(10)) ?? false,
            ] : null,
            'trend' => $trend,
            'recent_logs' => $recentLogs,
        ]);
    }
}
