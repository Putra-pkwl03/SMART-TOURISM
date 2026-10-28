<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('umkm_products', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // misal: Lempeng Karak, Tape Menir, Hampers Desa Wisata[cite: 9, 18]
            $table->text('description')->nullable();
            $table->integer('price'); // Harga jual ke wisatawan
            $table->integer('stock')->default(0);
            $table->integer('umkm_share_amount'); // Porsi pendapatan murni untuk UMKM Sedyo Maju per item[cite: 18, 21]
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('umkm_products');
    }
};
