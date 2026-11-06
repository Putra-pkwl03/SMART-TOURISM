<?php

namespace Tests\Feature;

use App\Models\UmkmProduct;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UmkmCashierTest extends TestCase
{
    use RefreshDatabase;

    public function test_umkm_cashier_sale_reduces_stock_and_is_included_in_sales_report(): void
    {
        $umkm = User::factory()->create(['role' => 'umkm_mitra']);
        $product = $this->createProduct($umkm, 'Kopi Lokal', 5);

        $this->actingAs($umkm, 'sanctum')
            ->postJson('/api/umkm/cashier/sales', [
                'payment_method' => 'cash',
                'items' => [
                    ['umkm_product_id' => $product->id, 'quantity' => 2],
                ],
            ])
            ->assertCreated()
            ->assertJsonPath('data.total_amount', 30000)
            ->assertJsonPath('data.items.0.qty', 2);

        $this->assertDatabaseHas('umkm_products', [
            'id' => $product->id,
            'stock' => 3,
        ]);
        $this->assertDatabaseHas('consignment_settlements', [
            'umkm_product_id' => $product->id,
            'ticket_id' => null,
            'qty' => 2,
            'unit_price' => 15000,
            'total_umkm_income' => 30000,
            'total_pokdarwis_income' => 0,
            'status' => 'paid',
        ]);

        $product->update(['price' => 20000]);

        $this->getJson('/api/umkm/sales')
            ->assertOk()
            ->assertJsonPath('summary.total_standalone_sold', 2)
            ->assertJsonPath('summary.standalone_gross_sales', 30000)
            ->assertJsonPath('summary.standalone_income', 30000)
            ->assertJsonPath('summary.total_paid_income', 0)
            ->assertJsonPath('summary.total_pending_income', 0)
            ->assertJsonPath('summary.total_pokdarwis_share', 0)
            ->assertJsonPath('summary.total_umkm_revenue', 30000)
            ->assertJsonPath('summary.total_umkm_income', 30000)
            ->assertJsonPath('data.0.unit_price', 15000)
            ->assertJsonPath('data.0.offline_sale.receipt_code', fn ($code) => str_starts_with($code, 'POS-'));
    }

    public function test_cashier_rejects_insufficient_stock_without_partial_transaction(): void
    {
        $umkm = User::factory()->create(['role' => 'umkm_mitra']);
        $firstProduct = $this->createProduct($umkm, 'Produk Satu', 10);
        $secondProduct = $this->createProduct($umkm, 'Produk Dua', 1);

        $this->actingAs($umkm, 'sanctum')
            ->postJson('/api/umkm/cashier/sales', [
                'payment_method' => 'manual_transfer',
                'items' => [
                    ['umkm_product_id' => $firstProduct->id, 'quantity' => 2],
                    ['umkm_product_id' => $secondProduct->id, 'quantity' => 2],
                ],
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('items');

        $this->assertDatabaseHas('umkm_products', ['id' => $firstProduct->id, 'stock' => 10]);
        $this->assertDatabaseHas('umkm_products', ['id' => $secondProduct->id, 'stock' => 1]);
        $this->assertDatabaseCount('umkm_offline_sales', 0);
        $this->assertDatabaseCount('consignment_settlements', 0);
    }

    public function test_cashier_rejects_products_owned_by_another_umkm(): void
    {
        $umkm = User::factory()->create(['role' => 'umkm_mitra']);
        $otherUmkm = User::factory()->create(['role' => 'umkm_mitra']);
        $product = $this->createProduct($otherUmkm, 'Produk Mitra Lain', 5);

        $this->actingAs($umkm, 'sanctum')
            ->postJson('/api/umkm/cashier/sales', [
                'payment_method' => 'cash',
                'items' => [
                    ['umkm_product_id' => $product->id, 'quantity' => 1],
                ],
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('items');
    }

    public function test_non_umkm_user_cannot_create_offline_sales(): void
    {
        $visitor = User::factory()->create(['role' => 'visitor']);

        $this->actingAs($visitor, 'sanctum')
            ->postJson('/api/umkm/cashier/sales', [
                'payment_method' => 'cash',
                'items' => [],
            ])
            ->assertForbidden();
    }

    private function createProduct(User $owner, string $name, int $stock): UmkmProduct
    {
        return UmkmProduct::create([
            'umkm_id' => $owner->id,
            'name' => $name,
            'slug' => str($name)->slug() . '-' . $owner->id . '-' . $stock,
            'price' => 15000,
            'initial_stock' => $stock,
            'stock' => $stock,
            'umkm_share_amount' => 10000,
            'is_active' => true,
        ]);
    }
}
