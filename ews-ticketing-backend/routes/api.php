<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DestinationController;
use App\Http\Controllers\TicketController;

// Public Route By default, route login bisa diakses siapa saja
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/register', [AuthController::class, 'register']);


    Route::get('/destinations', [DestinationController::class, 'index']);
    Route::get('/destinations/{destination}', [DestinationController::class, 'show']);

// Protected Route (Harus membawa Bearer Token)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::post('/destinations', [DestinationController::class, 'store']);
    Route::put('/destinations/{destination}', [DestinationController::class, 'update']);
    Route::patch('/destinations/{destination}/toggle-status', [DestinationController::class, 'toggleStatus']);
    Route::delete('/destinations/{destination}', [DestinationController::class, 'destroy']);

  // Endpoint Publik / Loket Pemesanan & Verifikasi
    Route::post('/tickets', [TicketController::class, 'store']);
    Route::post('/tickets/verify', [TicketController::class, 'verify']);
    Route::get('/user/tickets', [TicketController::class, 'userHistory']);
    Route::get('/tickets/scanned-logs', [TicketController::class, 'scannedLogs']);

    // Endpoint Terproteksi Admin (Rekapitulasi Bookings)
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/tickets', [TicketController::class, 'index']);
        Route::patch('/tickets/{id}/approve', [TicketController::class, 'approve']);
        Route::patch('/tickets/{id}/reject', [TicketController::class, 'reject']);
    });


    
});