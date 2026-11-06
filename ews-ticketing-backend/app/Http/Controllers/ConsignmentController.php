<?php

namespace App\Http\Controllers;

use App\Models\ConsignmentSettlement;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Validation\ValidationException;
use Barryvdh\DomPDF\Facade\Pdf;

class ConsignmentController extends Controller
{
    /**
     * Menampilkan daftar riwayat dan rekapitulasi konsinyasi bagi hasil
     * Dilengkapi filter tanggal (EOM), status pencairan, produk, dan pencarian.
     */
    public function index(Request $request)
    {
        $query = ConsignmentSettlement::with([
            'ticket.user', 
            'ticket.destination.images', 
            'umkmProduct.images'
        ])->whereNotNull('ticket_id');

        // 1. Filter Berdasarkan Produk UMKM
        if ($request->filled('umkm_product_id') && $request->umkm_product_id !== 'ALL') {
            $query->where('umkm_product_id', $request->umkm_product_id);
        }

        // 2. Filter Status Pembayaran / Pencairan ke UMKM (pending/paid)
        if ($request->filled('status') && $request->status !== 'ALL') {
            $query->where('status', $request->status);
        }

        // 3. Filter Rentang Tanggal / EOM (End of Month)
        if ($request->filled('start_date') && $request->filled('end_date')) {
            $startDate = Carbon::parse($request->start_date)->startOfDay();
            $endDate = Carbon::parse($request->end_date)->endOfDay();
            $query->whereBetween('created_at', [$startDate, $endDate]);
        } elseif ($request->filled('month') && $request->filled('year')) {
            $query->whereMonth('created_at', $request->month)
                  ->whereYear('created_at', $request->year);
        }

        // 4. Pencarian Server-side (Kode Tiket / Nama Wisatawan)
        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('ticket', function ($q) use ($search) {
                $q->where('ticket_code', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($u) use ($search) {
                      $u->where('name', 'like', "%{$search}%");
                  });
            });
        }

        $settlements = $query->latest()->get();

        // Hitung total akumulasi pendapatan berdasarkan data yang terfilter
        $totalUmkmRevenue = $settlements->sum('total_umkm_income');
        $totalPokdarwisRevenue = $settlements->sum('total_pokdarwis_income');
        $totalPaidUmkm = $settlements->where('status', 'paid')->sum('total_umkm_income');
        $totalUnpaidUmkm = $settlements->where('status', 'pending')->sum('total_umkm_income');

        return response()->json([
            'status' => 'success',
            'summary' => [
                'overall_umkm_income' => (int) $totalUmkmRevenue,
                'overall_pokdarwis_income' => (int) $totalPokdarwisRevenue,
                'total_paid_umkm' => (int) $totalPaidUmkm,      // Sudah dicairkan ke UMKM
                'total_unpaid_umkm' => (int) $totalUnpaidUmkm,  // Belum dicairkan (Utang EOM)
            ],
            'data' => $settlements
        ]);
    }

    /**
     * Menyimpan data settlement konsinyasi baru 
     * (Otomatis dipanggil saat transaksi e-ticket/bundling sukses)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'ticket_id' => 'required|exists:tickets,id',
            'umkm_product_id' => 'required|exists:umkm_products,id',
            'qty' => 'required|integer|min:1',
            'total_umkm_income' => 'required|numeric|min:0',
            'total_pokdarwis_income' => 'required|numeric|min:0',
            'status' => 'nullable|in:pending,paid',
        ]);

        // Default status adalah pending jika tidak diisi
        $validated['status'] = $validated['status'] ?? 'pending';

        $settlement = ConsignmentSettlement::create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Data konsinyasi berhasil dicatat.',
            'data' => $settlement->load(['ticket', 'umkmProduct'])
        ], 201);
    }

    /**
     * Memperbarui status pencairan konsinyasi ke UMKM (Mark as Paid / Bulk Settlement EOM)
     */
    public function markAsPaid(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'required|distinct|exists:consignment_settlements,id',
            'notes' => 'nullable|string',
        ]);

        $bundlingSettlements = ConsignmentSettlement::whereIn('id', $validated['ids'])
            ->whereNotNull('ticket_id');

        if ($bundlingSettlements->count() !== count($validated['ids'])) {
            throw ValidationException::withMessages([
                'ids' => 'Pencairan konsinyasi hanya berlaku untuk transaksi bundling tiket.',
            ]);
        }

        $bundlingSettlements->update([
            'status' => 'paid',
            'settled_at' => Carbon::now(),
            'notes' => $validated['notes'] ?? 'Pencairan dana konsinyasi akhir bulan (EOM)'
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Status pencairan konsinyasi ke UMKM berhasil diperbarui menjadi LUNAS/PAID.',
        ]);
    }

    /**
 * Rekap Laporan untuk kebutuhan Ekspor / Cetak Berita Acara Penyerahan Dana EOM (PDF)
 */
    public function exportReport(Request $request)
    {
        $query = ConsignmentSettlement::with(['ticket.user', 'umkmProduct'])
            ->whereNotNull('ticket_id');

        if ($request->filled('month') && $request->filled('year')) {
            $query->whereMonth('created_at', $request->month)
                ->whereYear('created_at', $request->year);
        }

        $settlements = $query->latest()->get();

        $summary = [
            'total_qty' => $settlements->sum('qty'),
            'total_umkm_income' => (int) $settlements->sum('total_umkm_income'),
            'total_pokdarwis_income' => (int) $settlements->sum('total_pokdarwis_income'),
            'total_gross' => (int) ($settlements->sum('total_umkm_income') + $settlements->sum('total_pokdarwis_income')),
        ];

        $period = [
            'month' => $request->month ?? date('m'),
            'year' => $request->year ?? date('Y'),
        ];

        // Load view khusus PDF (misal: resources/views/pdf/consignment-report.blade.php)
        $pdf = Pdf::loadView('pdf.consignment-report', [
            'settlements' => $settlements,
            'summary' => $summary,
            'period' => $period,
        ]);

        // Opsi ukuran kertas (A4, potrait/landscape)
        $pdf->setPaper('a4', 'portrait');

        // Mengunduh file PDF langsung ke browser
        return $pdf->download('Berita-Acara-Konsinyasi-' . $period['month'] . '-' . $period['year'] . '.pdf');
    }
}