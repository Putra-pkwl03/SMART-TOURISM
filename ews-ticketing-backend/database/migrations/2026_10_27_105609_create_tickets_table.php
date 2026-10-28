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
        Schema::create('tickets', function (Blueprint $table) {
            $table->id();
            $table->string('ticket_code')->unique(); // e.g., JT-240510-001[cite: 37]
            $table->foreignId('destination_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null'); // Wisatawan pembeli
            $table->integer('visitor_count')->default(1);
            $table->integer('total_price');
            $table->date('visit_date');
            $table->string('payment_method')->nullable(); // contoh: 'qris', 'bca'
            $table->string('payment_proof')->nullable();  // path file gambar bukti transfer
            $table->enum('payment_status', ['pending', 'paid', 'cancelled'])->default('pending');
            $table->enum('ticket_status', ['valid', 'used', 'expired'])->default('valid');
            $table->timestamp('used_at')->nullable();
            $table->foreignId('validated_by')->nullable()->constrained('users'); // Petugas Loket
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tickets');
    }
};
