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
            // Jika Anda sudah punya tabel users/umkms, sesuaikan foreignId-nya (misal: $table->foreignId('user_id')->constrained()->cascadeOnDelete();)
            $table->unsignedBigInteger('umkm_id')->nullable(); // ID pemilik UMKM / Mitra
            $table->string('name'); 
            $table->string('slug')->unique(); // Untuk URL ramah SEO (misal: lempeng-karak-khas)
            $table->text('description')->nullable();
            $table->integer('price'); // Harga jual ke wisatawan
            $table->integer('stock')->default(0);
            $table->integer('umkm_share_amount'); // Porsi pendapatan murni untuk UMKM per item
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Tabel khusus untuk menampung Multi-Gambar produk (konsisten seperti DestinationImage)
        Schema::create('umkm_product_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('umkm_product_id')->constrained('umkm_products')->cascadeOnDelete();
            $table->string('image_path'); // Path atau URL gambar
            $table->boolean('is_primary')->default(false); // Penanda gambar utama/thumbnail
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('umkm_product_images');
        Schema::dropIfExists('umkm_products');
    }
};