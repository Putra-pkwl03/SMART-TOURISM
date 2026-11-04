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
        Schema::create('consignment_settlements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ticket_id')->constrained()->onDelete('cascade');
            $table->foreignId('umkm_product_id')->constrained()->onDelete('cascade');
            $table->integer('qty');
            $table->integer('total_umkm_income'); // Hak pendapatan untuk UMKM Sedyo Maju
            $table->integer('total_pokdarwis_income'); // Porsi margin untuk Pokdarwis
            
            // Kolom tambahan untuk manajemen laporan EOM & pencairan dana
            $table->enum('status', ['pending', 'paid'])->default('pending'); // Status pencairan ke UMKM
            $table->timestamp('settled_at')->nullable(); // Waktu kapan dana dicairkan/dilunaskan
            $table->text('notes')->nullable(); // Keterangan tambahan atau nomor Berita Acara
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('consignment_settlements');
    }
};