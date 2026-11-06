<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('umkm_offline_sales', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cashier_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('receipt_code')->unique();
            $table->string('payment_method');
            $table->unsignedInteger('total_amount');
            $table->timestamps();
        });

        Schema::table('consignment_settlements', function (Blueprint $table) {
            $table->foreignId('offline_sale_id')
                ->nullable()
                ->after('ticket_id')
                ->constrained('umkm_offline_sales')
                ->restrictOnDelete();
            $table->unsignedInteger('unit_price')->nullable()->after('qty');
            $table->foreignId('ticket_id')->nullable()->change();
        });
    }

    public function down(): void
    {
        DB::table('consignment_settlements')
            ->whereNotNull('offline_sale_id')
            ->delete();

        Schema::table('consignment_settlements', function (Blueprint $table) {
            $table->dropConstrainedForeignId('offline_sale_id');
            $table->dropColumn('unit_price');
            $table->foreignId('ticket_id')->nullable(false)->change();
        });

        Schema::dropIfExists('umkm_offline_sales');
    }
};
