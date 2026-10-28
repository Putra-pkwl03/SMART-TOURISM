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
        Schema::create('ews_telemetries', function (Blueprint $table) {
            $table->id();
            $table->decimal('water_level', 5, 2); // Ketinggian air (dalam meter, misal: 1.35)
            $table->decimal('rainfall', 5, 2);    // Curah hujan (dalam mm/jam, misal: 12.4)
            $table->decimal('temperature', 4, 1); // Suhu (dalam °C, misal: 28.6)
            $table->decimal('humidity', 4, 1);    // Kelembaban (dalam %, misal: 72.0)
            $table->enum('status', ['NORMAL', 'WASPADA', 'AWAS'])->default('NORMAL');
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ews_telemetries');
    }
};
