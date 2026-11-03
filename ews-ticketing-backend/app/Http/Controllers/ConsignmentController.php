<?php

namespace App\Http\Controllers;

use App\Models\ConsignmentSettlement;
use Illuminate\Http\Request;

class ConsignmentController extends Controller
{
    /**
     * Menampilkan daftar riwayat dan rekapitulasi konsinyasi bagi hasil
     */
    public function index(Request $request)
    {
        // PERBAIKAN: Sertakan 'ticket.destination.images' agar foto destinasi ikut terkirim ke frontend
        $query = ConsignmentSettlement::with(['ticket.user', 'ticket.destination.images', 'umkmProduct.images']);

        // Filter opsional berdasarkan produk UMKM jika diperlukan
        if ($request->has('umkm_product_id')) {
            $query->where('umkm_product_id', $request->umkm_product_id);
        }

        $settlements = $query->latest()->get();

        // Hitung total akumulasi pendapatan secara keseluruhan
        $totalUmkmRevenue = $settlements->sum('total_umkm_income');
        $totalPokdarwisRevenue = $settlements->sum('total_pokdarwis_income');

        return response()->json([
            'status' => 'success',
            'summary' => [
                'overall_umkm_income' => (int) $totalUmkmRevenue,
                'overall_pokdarwis_income' => (int) $totalPokdarwisRevenue,
            ],
            'data' => $settlements
        ]);
    }

    /**
     * Menyimpan atau mencatat data settlement konsinyasi baru 
     * (Biasanya dipanggil otomatis saat pembayaran tiket disetujui / approve)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'ticket_id' => 'required|exists:tickets,id',
            'umkm_product_id' => 'required|exists:umkm_products,id',
            'qty' => 'required|integer|min:1',
            'total_umkm_income' => 'required|numeric|min:0',
            'total_pokdarwis_income' => 'required|numeric|min:0',
        ]);

        $settlement = ConsignmentSettlement::create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Data konsinyasi berhasil dicatat.',
            'data' => $settlement->load(['ticket', 'umkmProduct'])
        ], 201);
    }
}