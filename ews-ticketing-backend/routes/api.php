<?php

use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ConsignmentController;
use App\Http\Controllers\DestinationController;
use App\Http\Controllers\LoketDashboardController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\UmkmDashboardController;
use App\Http\Controllers\UmkmProductController;
use App\Http\Controllers\UmkmSalesController;
use Illuminate\Support\Facades\Route;

// Public Route (Bisa diakses siapa saja tanpa token)
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/register', [AuthController::class, 'register']);

Route::get('/destinations', [DestinationController::class, 'index']);
Route::get('/destinations/{destination}', [DestinationController::class, 'show']);

// Route Publik untuk Katalog Produk UMKM (Opsional: Jika wisatawan boleh melihat produk/hampers tanpa login)
Route::get('/umkm/products', [UmkmProductController::class, 'index']);
Route::get('/umkm/products/{id}', [UmkmProductController::class, 'show']);

// Protected Route (Wajib membawa Bearer Token / Harus Login)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/admin/dashboard', [AdminDashboardController::class, 'index']);
    Route::get('/loket/dashboard-summary', [LoketDashboardController::class, 'index']);
    Route::get('/umkm/dashboard-summary', [UmkmDashboardController::class, 'index']);

    // Manajemen Destinasi (Admin)
    Route::post('/destinations', [DestinationController::class, 'store']);
    Route::put('/destinations/{destination}', [DestinationController::class, 'update']);
    Route::patch('/destinations/{destination}/toggle-status', [DestinationController::class, 'toggleStatus']);
    Route::delete('/destinations/{destination}', [DestinationController::class, 'destroy']);

    // Pemesanan & Verifikasi Tiket
    Route::post('/tickets', [TicketController::class, 'store']);
    Route::post('/tickets/verify', [TicketController::class, 'verify']);
    Route::get('/user/tickets', [TicketController::class, 'userHistory']);
    Route::get('/tickets/scanned-logs', [TicketController::class, 'scannedLogs']);

    // Rekapitulasi Bookings & Validasi Tiket (Admin)
    Route::get('/tickets', [TicketController::class, 'index']);
    Route::patch('/tickets/{id}/approve', [TicketController::class, 'approve']);
    Route::patch('/tickets/{id}/reject', [TicketController::class, 'reject']);

    // Modul Konsinyasi & Bagi Hasil (Admin)
    Route::get('/admin/consignments', [ConsignmentController::class, 'index']);
    Route::post('/admin/consignments', [ConsignmentController::class, 'store']);
    Route::post('/admin/consignments/mark-paid', [ConsignmentController::class, 'markAsPaid']);
    Route::get('/admin/consignments/export-pdf', [ConsignmentController::class, 'exportReport']);

    // Manajemen Produk & Stok UMKM (Terproteksi untuk Admin/Mitra UMKM)
    Route::prefix('umkm')->group(function () {
        Route::post('/products', [UmkmProductController::class, 'store']);
        Route::post('/products/{id}', [UmkmProductController::class, 'update']);
        Route::delete('/products/{id}', [UmkmProductController::class, 'destroy']);

        // Khusus update stok cepat dari tabel monitoring dashboard
        Route::patch('/products/{id}/stock', [UmkmProductController::class, 'updateStock']);

        // Manajemen Penjualan & Hampers UMKM
        Route::get('/sales', [UmkmSalesController::class, 'index']);
        Route::get('/sales-summary', [UmkmSalesController::class, 'productSalesSummary']);
        Route::get('/sales/export-pdf', [UmkmSalesController::class, 'exportReport']);
        Route::get('/sales/{id}', [UmkmSalesController::class, 'show']);

    });
});
