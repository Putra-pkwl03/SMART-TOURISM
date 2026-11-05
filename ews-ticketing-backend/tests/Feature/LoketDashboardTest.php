<?php

namespace Tests\Feature;

use App\Models\Destination;
use App\Models\EwsTelemetry;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LoketDashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_ticketing_officer_dashboard_returns_live_scan_and_ews_data(): void
    {
        $officer = User::factory()->create(['role' => 'ticketing_officer']);
        $visitor = User::factory()->create(['role' => 'visitor', 'name' => 'Budi Santoso']);
        $destination = Destination::create([
            'name' => 'Jurug Gedhe',
            'type' => 'destination',
            'location' => 'Ngoro-Oro',
            'ticket_price' => 10000,
            'is_active' => true,
        ]);
        Ticket::create([
            'ticket_code' => 'JT-LOKET-USED',
            'destination_id' => $destination->id,
            'user_id' => $visitor->id,
            'visitor_count' => 4,
            'total_price' => 40000,
            'visit_date' => today(),
            'payment_status' => 'paid',
            'ticket_status' => 'used',
            'used_at' => now(),
        ]);
        Ticket::create([
            'ticket_code' => 'JT-LOKET-VALID',
            'destination_id' => $destination->id,
            'user_id' => $visitor->id,
            'visitor_count' => 3,
            'total_price' => 30000,
            'visit_date' => today(),
            'payment_status' => 'paid',
            'ticket_status' => 'valid',
        ]);
        EwsTelemetry::create([
            'water_level' => 1.45,
            'rainfall' => 0.2,
            'temperature' => 28.6,
            'humidity' => 72,
            'status' => 'WASPADA',
            'description' => 'Debit air meningkat.',
        ]);

        $this->actingAs($officer, 'sanctum')
            ->getJson('/api/loket/dashboard-summary?period=7')
            ->assertOk()
            ->assertJsonPath('summary.verified_tickets_today', 1)
            ->assertJsonPath('summary.visitors_today', 4)
            ->assertJsonPath('ews.status', 'WASPADA')
            ->assertJsonPath('recent_logs.0.ticket_code', 'JT-LOKET-USED')
            ->assertJsonFragment([
                'date' => today()->toDateString(),
                'tickets' => 1,
                'visitors' => 4,
            ]);
    }

    public function test_loket_dashboard_rejects_non_ticketing_officers(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin, 'sanctum')
            ->getJson('/api/loket/dashboard-summary')
            ->assertForbidden();
    }
}
