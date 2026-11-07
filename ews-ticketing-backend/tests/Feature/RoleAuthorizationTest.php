<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Destination;
use App\Models\Ticket;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RoleAuthorizationTest extends TestCase
{
    use RefreshDatabase;

    public function test_registration_always_assigns_the_visitor_role(): void
    {
        $this->postJson('/api/auth/register', [
            'name' => 'New User',
            'email' => 'new-user@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'role' => 'admin',
        ])
            ->assertCreated()
            ->assertJsonPath('user.role', 'visitor')
            ->assertJsonPath('expires_in', config('sanctum.expiration') * 60);

        $this->assertDatabaseHas('users', [
            'email' => 'new-user@example.com',
            'role' => 'visitor',
        ]);
    }

    public function test_protected_api_routes_require_authentication(): void
    {
        $this->getJson('/api/admin/dashboard')->assertUnauthorized();
    }

    public function test_role_specific_routes_reject_other_authenticated_roles(): void
    {
        $visitor = User::factory()->create(['role' => 'visitor']);
        $officer = User::factory()->create(['role' => 'ticketing_officer']);
        $umkm = User::factory()->create(['role' => 'umkm_mitra']);
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($visitor, 'sanctum')
            ->getJson('/api/tickets')
            ->assertForbidden();

        $this->actingAs($visitor, 'sanctum')
            ->postJson('/api/destinations')
            ->assertForbidden();

        $this->actingAs($visitor, 'sanctum')
            ->postJson('/api/tickets/verify')
            ->assertForbidden();

        $this->actingAs($officer, 'sanctum')
            ->getJson('/api/admin/consignments')
            ->assertForbidden();

        $this->actingAs($officer, 'sanctum')
            ->postJson('/api/umkm/cashier/sales')
            ->assertForbidden();

        $this->actingAs($umkm, 'sanctum')
            ->getJson('/api/admin/dashboard')
            ->assertForbidden();

        $this->actingAs($umkm, 'sanctum')
            ->postJson('/api/tickets')
            ->assertForbidden();

        $this->actingAs($admin, 'sanctum')
            ->getJson('/api/umkm/cashier/products')
            ->assertForbidden();
    }

    public function test_each_role_can_access_its_own_dashboard_or_ticket_data(): void
    {
        $visitor = User::factory()->create(['role' => 'visitor']);
        $officer = User::factory()->create(['role' => 'ticketing_officer']);
        $umkm = User::factory()->create(['role' => 'umkm_mitra']);

        $this->actingAs($visitor, 'sanctum')
            ->getJson('/api/user/tickets')
            ->assertOk();

        $this->actingAs($officer, 'sanctum')
            ->getJson('/api/tickets/scanned-logs')
            ->assertOk();

        $this->actingAs($umkm, 'sanctum')
            ->getJson('/api/umkm/cashier/products')
            ->assertOk()
            ->assertJsonPath('status', 'success');
    }

    public function test_ticketing_officer_cannot_verify_an_unpaid_ticket(): void
    {
        $officer = User::factory()->create(['role' => 'ticketing_officer']);
        $visitor = User::factory()->create(['role' => 'visitor']);
        $destination = Destination::create([
            'name' => 'Jurug Gedhe',
            'type' => 'destination',
            'location' => 'Ngoro-Oro',
            'ticket_price' => 10000,
            'is_active' => true,
        ]);
        $ticket = Ticket::create([
            'ticket_code' => 'JT-UNPAID-001',
            'destination_id' => $destination->id,
            'user_id' => $visitor->id,
            'visitor_count' => 1,
            'total_price' => 10000,
            'visit_date' => today(),
            'payment_status' => 'pending',
            'ticket_status' => 'valid',
        ]);

        $this->actingAs($officer, 'sanctum')
            ->postJson('/api/tickets/verify', ['ticket_code' => $ticket->ticket_code])
            ->assertUnprocessable()
            ->assertJsonPath('message', 'Tiket belum diverifikasi pembayarannya oleh Admin.');

        $this->assertDatabaseHas('tickets', [
            'id' => $ticket->id,
            'ticket_status' => 'valid',
        ]);
    }
}
