<?php

namespace Tests\Feature;

use App\Models\ConsignmentSettlement;
use App\Models\Destination;
use App\Models\EwsTelemetry;
use App\Models\Ticket;
use App\Models\TicketItem;
use App\Models\UmkmProduct;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminDashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_dashboard_returns_live_summary_and_recent_data(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $visitor = User::factory()->create(['role' => 'visitor']);
        $destination = Destination::create([
            'name' => 'Jurug Gedhe',
            'type' => 'destination',
            'location' => 'Ngoro-Oro',
            'ticket_price' => 10000,
            'is_active' => true,
        ]);
        $product = UmkmProduct::create([
            'name' => 'Lempeng Karak',
            'slug' => 'lempeng-karak',
            'price' => 5000,
            'initial_stock' => 10,
            'stock' => 8,
            'umkm_share_amount' => 2500,
            'is_active' => true,
        ]);
        $ticket = Ticket::create([
            'ticket_code' => 'JT-TEST-001',
            'destination_id' => $destination->id,
            'user_id' => $visitor->id,
            'visitor_count' => 2,
            'total_price' => 10000,
            'visit_date' => today(),
            'payment_status' => 'paid',
            'ticket_status' => 'used',
            'used_at' => now(),
        ]);
        TicketItem::create([
            'ticket_id' => $ticket->id,
            'umkm_product_id' => $product->id,
            'quantity' => 1,
            'subtotal_price' => 0,
        ]);
        ConsignmentSettlement::create([
            'ticket_id' => $ticket->id,
            'umkm_product_id' => $product->id,
            'qty' => 1,
            'total_umkm_income' => 2500,
            'total_pokdarwis_income' => 7500,
            'status' => 'pending',
        ]);
        EwsTelemetry::create([
            'water_level' => 1.35,
            'rainfall' => 0,
            'temperature' => 30.6,
            'humidity' => 71,
            'status' => 'NORMAL',
            'description' => 'Kondisi normal.',
        ]);

        $response = $this->actingAs($admin, 'sanctum')
            ->getJson('/api/admin/dashboard?period=7');

        $response->assertOk()
            ->assertJsonPath('summary.visitors', 2)
            ->assertJsonPath('summary.ticket_revenue', 7500)
            ->assertJsonPath('summary.bundling_revenue', 2500)
            ->assertJsonPath('summary.total_revenue', 10000)
            ->assertJsonPath('summary.bundling_sales', 1)
            ->assertJsonPath('summary.pending_consignments', 1)
            ->assertJsonPath('ews.status', 'NORMAL')
            ->assertJsonPath('recent_tickets.0.code', 'JT-TEST-001')
            ->assertJsonPath('consignment_products.0.stock', 8);
    }

    public function test_dashboard_endpoint_rejects_non_admin_users(): void
    {
        $visitor = User::factory()->create(['role' => 'visitor']);

        $this->actingAs($visitor, 'sanctum')
            ->getJson('/api/admin/dashboard')
            ->assertForbidden();
    }

    public function test_visitor_trend_counts_scanned_tickets_not_valid_tickets(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $visitor = User::factory()->create(['role' => 'visitor']);
        $destination = Destination::create([
            'name' => 'Jurug Gedhe',
            'type' => 'destination',
            'location' => 'Ngoro-Oro',
            'ticket_price' => 10000,
            'is_active' => true,
        ]);

        Ticket::create([
            'ticket_code' => 'JT-TEST-VALID',
            'destination_id' => $destination->id,
            'user_id' => $visitor->id,
            'visitor_count' => 4,
            'total_price' => 40000,
            'visit_date' => today(),
            'payment_status' => 'paid',
            'ticket_status' => 'valid',
        ]);
        Ticket::create([
            'ticket_code' => 'JT-TEST-USED',
            'destination_id' => $destination->id,
            'user_id' => $visitor->id,
            'visitor_count' => 2,
            'total_price' => 20000,
            'visit_date' => today(),
            'payment_status' => 'paid',
            'ticket_status' => 'used',
            'used_at' => now(),
        ]);

        $response = $this->actingAs($admin, 'sanctum')
            ->getJson('/api/admin/dashboard?period=7');

        $response->assertOk()
            ->assertJsonPath('summary.visitors', 2)
            ->assertJsonFragment([
                'date' => today()->toDateString(),
                'visitors' => 2,
            ]);
    }
}
