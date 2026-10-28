<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Models\Destination;
use App\Models\TicketItem;
use App\Models\UmkmProduct;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class TicketController extends Controller
{
    // 1. Rekapitulasi Tiket untuk Dashboard Admin (/dashboard/admin/tickets)
    public function index()
    {
        $tickets = Ticket::with(['destination', 'user', 'ticketItems.umkmProduct'])->latest()->get();
        return response()->json($tickets);
    }

    // 2. Pemesanan Tiket Baru (Online Publik / Wisatawan Login)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'destination_id' => 'required|exists:destinations,id',
            'visitor_count' => 'required|integer|min:1',
            'visit_date' => 'required|date',
            'payment_method' => 'required|string', // Pastikan metode pembayaran dikirim
            'payment_proof' => 'required|image|max:2048', // Wajib unggah bukti bayar
            'items' => 'nullable|array', 
            'items.*.umkm_product_id' => 'required_with:items|exists:umkm_products,id',
            'items.*.quantity' => 'required_with:items|integer|min:1',
        ]);

        $destination = Destination::findOrFail($validated['destination_id']);

        // Validasi EWS / Status Darurat Destinasi
        if (!$destination->is_active) {
            return response()->json([
                'message' => 'Maaf, destinasi ini sedang ditutup sementara karena status darurat EWS cuaca buruk.'
            ], 422);
        }

        return DB::transaction(function () use ($validated, $destination, $request) {
            $basePrice = $destination->ticket_price * $validated['visitor_count'];
            $itemsTotal = 0;

            // Handle Upload File Bukti Transfer
            $proofPath = null;
            if ($request->hasFile('payment_proof')) {
                $proofPath = $request->file('payment_proof')->store('payment-proofs', 'public');
            }

            // Generate Kode Unik Tiket (Contoh: JT-261028-A1B2)
            $ticketCode = 'JT-' . date('ymd') . '-' . strtoupper(Str::random(4));

            $ticket = Ticket::create([
                'ticket_code' => $ticketCode,
                'destination_id' => $destination->id,
                'user_id' => $request->user()->id, // WAJIB ADA karena dilindungi auth:sanctum
                'visitor_count' => $validated['visitor_count'],
                'visit_date' => $validated['visit_date'],
                'total_price' => $basePrice,
                'payment_method' => $validated['payment_method'],
                'payment_proof' => '/storage/' . $proofPath,
                'payment_status' => 'pending', // Menunggu verifikasi admin
                'ticket_status' => 'valid',
            ]);

            // Jika wisatawan memesan paket bundling hampers UMKM
            if (!empty($validated['items'])) {
                foreach ($validated['items'] as $itemData) {
                    $product = UmkmProduct::findOrFail($itemData['umkm_product_id']);
                    $subtotal = $product->price * $itemData['quantity'];
                    $itemsTotal += $subtotal;

                    TicketItem::create([
                        'ticket_id' => $ticket->id,
                        'umkm_product_id' => $product->id,
                        'quantity' => $itemData['quantity'],
                        'subtotal_price' => $subtotal,
                    ]);
                }
                
                // Perbarui total harga keseluruhan (Tiket + Bundling UMKM)
                $ticket->update(['total_price' => $basePrice + $itemsTotal]);
            }

            return response()->json([
                'message' => 'Pemesanan tiket berhasil! Menunggu verifikasi admin.',
                'data' => $ticket->load(['destination', 'ticketItems.umkmProduct'])
            ], 201);
        });
    }

    // 3. Verifikasi & Scan Tiket oleh Petugas Loket (/dashboard/loket/scanner)
    public function verify(Request $request)
    {
        $validated = $request->validate([
            'ticket_code' => 'required|string'
        ]);

        $ticket = Ticket::with(['destination', 'ticketItems.umkmProduct'])
            ->where('ticket_code', $validated['ticket_code'])
            ->first();

        if (!$ticket) {
            return response()->json(['message' => 'Kode tiket tidak valid atau tidak ditemukan.'], 404);
        }

        if ($ticket->ticket_status === 'used') {
            return response()->json([
                'message' => 'Peringatan: Tiket ini sudah digunakan sebelumnya (Duplikasi ditolak!).'
            ], 422);
        }

        if ($ticket->ticket_status === 'expired') {
            return response()->json(['message' => 'Tiket telah kedaluwarsa.'], 422);
        }

        // Eksekusi perubahan status menjadi used (sudah digunakan)
        $ticket->update([
            'ticket_status' => 'used',
            'used_at' => now(),
            'validated_by' => $request->user()?->id,
        ]);

        return response()->json([
            'message' => 'Tiket sah! Silakan izinkan pengunjung masuk.',
            'data' => $ticket
        ]);
    }


    // 4. Riwayat E-Ticket untuk Wisatawan yang Sedang Login (/api/user/tickets)
    public function userHistory(Request $request)
    {
        $tickets = Ticket::with(['destination', 'ticketItems.umkmProduct'])
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json([
            'message' => 'Berhasil memuat riwayat tiket.',
            'data' => $tickets
        ]);
    }

    // 5. Menyetujui Pembayaran Tiket oleh Admin
    public function approve($id)
    {
        $ticket = Ticket::findOrFail($id);

        $ticket->update([
            'payment_status' => 'paid',
            'ticket_status' => 'valid',
        ]);

        return response()->json([
            'message' => 'Pembayaran tiket berhasil diverifikasi dan disetujui!',
            'data' => $ticket
        ]);
    }

    // 6. Menolak Pembayaran Tiket dengan Keterangan oleh Admin
    public function reject(Request $request, $id)
    {
        $validated = $request->validate([
            'rejection_reason' => 'required|string|max:255',
        ]);

        $ticket = Ticket::findOrFail($id);

        $ticket->update([
            'payment_status' => 'cancelled',
            'ticket_status' => 'expired',
            // Pastikan Anda sudah menambahkan kolom 'rejection_reason' pada tabel 'tickets' via migration, 
            // atau simpan di kolom lain jika ada.
            'rejection_reason' => $validated['rejection_reason'], 
        ]);

        return response()->json([
            'message' => 'Pembayaran tiket berhasil ditolak.',
            'data' => $ticket
        ]);
    }


   public function scannedLogs(Request $request)
    {
        $logs = Ticket::with(['destination', 'user'])
            ->where('ticket_status', 'used')
            ->latest('used_at')
            ->take(50)
            ->get();

        return response()->json([
            'message' => 'Berhasil memuat log pengunjung masuk.',
            'data' => $logs
        ]);
    }
}