<?php

namespace Tests\Feature;

use App\Models\ConsignmentSettlement;
use App\Models\Destination;
use App\Models\Ticket;
use App\Models\UmkmProduct;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UmkmDashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_umkm_dashboard_returns_only_the_signed_in_mitras_data(): void
    {
        $umkm = User::factory()->create(['role' => 'umkm_mitra']);
        $otherUmkm = User::factory()->create(['role' => 'umkm_mitra']);
        $visitor = User::factory()->create(['role' => 'visitor']);
        $destination = Destination::create([
            'name' => 'Jurug Gedhe',
            'type' => 'destination',
            'location' => 'Ngoro-Oro',
            'ticket_price' => 10000,
            'is_active' => true,
        ]);
        $product = UmkmProduct::create([
            'umkm_id' => $umkm->id,
            'name' => 'Lempeng Karak',
            'slug' => 'lempeng-karak-umkm-dashboard',
            'price' => 15000,
            'initial_stock' => 20,
            'stock' => 4,
            'umkm_share_amount' => 10000,
            'is_active' => true,
        ]);
        $otherProduct = UmkmProduct::create([
            'umkm_id' => $otherUmkm->id,
            'name' => 'Produk Mitra Lain',
            'slug' => 'produk-mitra-lain-umkm-dashboard',
            'price' => 20000,
            'initial_stock' => 10,
            'stock' => 10,
            'umkm_share_amount' => 15000,
            'is_active' => true,
        ]);
        $ticket = Ticket::create([
            'ticket_code' => 'UMKM-DASH-001',
            'destination_id' => $destination->id,
            'user_id' => $visitor->id,
            'visitor_count' => 1,
            'total_price' => 25000,
            'visit_date' => today(),
            'payment_status' => 'paid',
            'ticket_status' => 'valid',
        ]);
        ConsignmentSettlement::create([
            'ticket_id' => $ticket->id,
            'umkm_product_id' => $product->id,
            'qty' => 2,
            'total_umkm_income' => 20000,
            'total_pokdarwis_income' => 10000,
            'status' => 'pending',
        ]);
        ConsignmentSettlement::create([
            'ticket_id' => $ticket->id,
            'umkm_product_id' => $otherProduct->id,
            'qty' => 5,
            'total_umkm_income' => 75000,
            'total_pokdarwis_income' => 25000,
            'status' => 'pending',
        ]);

        $this->actingAs($umkm, 'sanctum')
            ->getJson('/api/umkm/dashboard-summary')
            ->assertOk()
            ->assertJsonPath('summary.total_products', 1)
            ->assertJsonPath('summary.low_stock_count', 1)
            ->assertJsonPath('summary.monthly_sold_quantity', 2)
            ->assertJsonPath('summary.monthly_gross_sales', 30000)
            ->assertJsonPath('summary.monthly_estimated_income', 20000)
            ->assertJsonPath('product_composition.0.name', 'Lempeng Karak')
            ->assertJsonPath('top_products.0.sold_quantity', 2);
    }

    public function test_dashboard_endpoint_rejects_non_umkm_users(): void
    {
        $visitor = User::factory()->create(['role' => 'visitor']);

        $this->actingAs($visitor, 'sanctum')
            ->getJson('/api/umkm/dashboard-summary')
            ->assertForbidden();
    }
}
