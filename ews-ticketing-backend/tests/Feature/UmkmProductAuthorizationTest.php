<?php

namespace Tests\Feature;

use App\Models\UmkmProduct;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UmkmProductAuthorizationTest extends TestCase
{
    use RefreshDatabase;

    public function test_umkm_users_cannot_modify_another_owners_product(): void
    {
        $umkm = User::factory()->create(['role' => 'umkm_mitra']);
        $otherUmkm = User::factory()->create(['role' => 'umkm_mitra']);
        $product = UmkmProduct::create([
            'umkm_id' => $otherUmkm->id,
            'name' => 'Produk Mitra Lain',
            'slug' => 'produk-mitra-lain',
            'price' => 15000,
            'initial_stock' => 5,
            'stock' => 5,
            'umkm_share_amount' => 10000,
            'is_active' => true,
        ]);

        $this->actingAs($umkm, 'sanctum')
            ->postJson("/api/umkm/products/{$product->id}", ['name' => 'Produk Diubah'])
            ->assertNotFound();

        $this->actingAs($umkm, 'sanctum')
            ->patchJson("/api/umkm/products/{$product->id}/stock", ['stock' => 1])
            ->assertNotFound();

        $this->actingAs($umkm, 'sanctum')
            ->deleteJson("/api/umkm/products/{$product->id}")
            ->assertNotFound();

        $this->assertDatabaseHas('umkm_products', [
            'id' => $product->id,
            'umkm_id' => $otherUmkm->id,
            'name' => 'Produk Mitra Lain',
            'stock' => 5,
        ]);
    }
}
