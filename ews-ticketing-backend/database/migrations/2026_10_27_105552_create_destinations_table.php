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
        Schema::create('destinations', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // misal: Wisata Alam Jurug Gedhe atau Paket Canyoneering + Hampers Karak[cite: 7]
            $table->enum('type', ['destination', 'package'])->default('destination'); // Pembeda antara Destinasi Murni atau Paket Bundling UMKM
            $table->text('description')->nullable();
            $table->string('location'); // misal: Padukuhan Gembyong, Ngoro-Oro[cite: 7]
            $table->integer('ticket_price'); // Harga dasar tiket atau total harga paket bundling
            $table->decimal('umkm_revenue_share', 10, 2)->default(0); // Estimasi porsi bagi hasil konsinyasi untuk UMKM Sedyo Maju
            $table->string('image_url')->nullable();
            $table->boolean('is_active')->default(true); // Status operasional (bisa ditutup darurat via EWS)
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('destinations');
    }
};
