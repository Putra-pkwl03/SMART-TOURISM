<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('consignment_settlements')
            ->whereNotNull('consignment_settlements.offline_sale_id')
            ->update([
                'consignment_settlements.total_umkm_income' => DB::raw(
                    '(SELECT consignment_settlements.qty * COALESCE(consignment_settlements.unit_price, umkm_products.price) '
                    . 'FROM umkm_products WHERE umkm_products.id = consignment_settlements.umkm_product_id)'
                ),
                'consignment_settlements.total_pokdarwis_income' => 0,
            ]);
    }

    public function down(): void
    {
        // Historical POS allocations cannot be reliably reconstructed.
    }
};
