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
    public function index()
    {
        $tickets = Ticket::with(['destination.images', 'user', 'ticketItems.umkmProduct'])->latest()->get();
        return response()->json($tickets);
    }

    // 2. Pemesanan Tiket Paket Bundling All-In
    public function store(Request $request)
    {
        $validated = $request->validate([
            'destination_id' => 'required|exists:destinations,id',
            'visitor_count' => 'required|integer|min:1',
            'visit_date' => 'required|date',
            'payment_method' => 'required|string', 
            'payment_proof' => 'required|image|max:2048', 
            'items' => 'nullable|array', 
            'items.*.umkm_product_id' => 'required_with:items|exists:umkm_products,id',
            'items.*.quantity' => 'required_with:items|integer|min:1',
        ]);

        $destination = Destination::findOrFail($validated['destination_id']);

        if (!$destination->is_active) {
            return response()->json([
                'message' => 'Maaf, destinasi ini sedang ditutup sementara karena status darurat EWS cuaca buruk.'
            ], 422);
        }

        return DB::transaction(function () use ($validated, $destination, $request) {
            // Karena ini ALL-IN, total harga murni dihitung dari harga paket destinasi dikali jumlah pengunjung.
            // Harga satuan produk UMKM tidak ditambahkan lagi ke total tagihan pembeli.
            $totalPackagePrice = $destination->ticket_price * $validated['visitor_count'];

            $proofPath = null;
            if ($request->hasFile('payment_proof')) {
                $proofPath = $request->file('payment_proof')->store('payment-proofs', 'public');
            }

            $ticketCode = 'JT-' . date('ymd') . '-' . strtoupper(Str::random(4));

            $ticket = Ticket::create([
                'ticket_code' => $ticketCode,
                'destination_id' => $destination->id,
                'user_id' => $request->user()->id, 
                'visitor_count' => $validated['visitor_count'],
                'visit_date' => $validated['visit_date'],
                'total_price' => $totalPackagePrice, // Harga All-In Paket
                'payment_method' => $validated['payment_method'],
                'payment_proof' => '/storage/' . $proofPath,
                'payment_status' => 'pending', 
                'ticket_status' => 'valid',
            ]);

            // Catat item produk UMKM yang didapat dalam paket bundling
            if (!empty($validated['items'])) {
                foreach ($validated['items'] as $itemData) {
                    $product = UmkmProduct::findOrFail($itemData['umkm_product_id']);
                    
                    // Subtotal item dicatat sebagai 0 atau proporsional karena sudah termasuk dalam harga all-in paket
                    TicketItem::create([
                        'ticket_id' => $ticket->id,
                        'umkm_product_id' => $product->id,
                        'quantity' => $itemData['quantity'],
                        'subtotal_price' => 0, // All-in sudah tercover di total_price paket
                    ]);
                }
            }

            return response()->json([
                'message' => 'Pemesanan tiket paket bundling berhasil! Menunggu verifikasi admin.',
                'data' => $ticket->load(['destination', 'ticketItems.umkmProduct'])
            ], 201);
        });
    }

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

        if ($ticket->payment_status !== 'paid') {
            return response()->json([
                'message' => 'Tiket belum diverifikasi pembayarannya oleh Admin.'
            ], 422);
        }

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

    // 5. Menyetujui Pembayaran Tiket oleh Admin (Kalkulasi Bagi Hasil All-In)
    public function approve($id)
    {
        $ticket = Ticket::with(['destination', 'ticketItems.umkmProduct'])->findOrFail($id);

        if ($ticket->payment_status === 'paid') {
            return response()->json([
                'message' => 'Pembayaran ini sudah pernah disetujui sebelumnya.'
            ], 422);
        }

        return DB::transaction(function () use ($ticket) {
            foreach ($ticket->ticketItems as $item) {
                $product = $item->umkmProduct;

                if ($product) {
                    if ($product->stock < $item->quantity) {
                        throw new \Exception("Gagal menyetujui: Stok produk '{$product->name}' sisa {$product->stock}, tidak mencukupi untuk pesanan ini.");
                    }

                    // Kurangi stok fisik produk UMKM
                    $product->decrement('stock', $item->quantity);

                    // HITUNG BAGI HASIL KONSINYASI UNTUK PAKET ALL-IN
                    // 1. Hak mutlak UMKM per unit dikali jumlah kuantiti
                    $totalUmkmIncome = ($product->umkm_share_amount ?? 0) * $item->quantity;
                    
                    // 2. Bagian Pokdarwis adalah sisa dari Harga Paket All-In dikurangi Hak UMKM
                    // Contoh: Paket Rp 80.000 - Hak UMKM Rp 20.000 = Rp 60.000 untuk Pokdarwis.
                    $totalPokdarwisIncome = $ticket->total_price - $totalUmkmIncome;

                    \App\Models\ConsignmentSettlement::create([
                        'ticket_id' => $ticket->id,
                        'umkm_product_id' => $product->id,
                        'qty' => $item->quantity,
                        'total_umkm_income' => $totalUmkmIncome,
                        'total_pokdarwis_income' => max(0, $totalPokdarwisIncome),
                    ]);
                }
            }

            // Jika tiket tidak memiliki item UMKM (murni tiket biasa tanpa bundling)
            if ($ticket->ticketItems->isEmpty()) {
                // Seluruh pendapatan masuk ke Pokdarwis
            }

            $ticket->update([
                'payment_status' => 'paid',
                'ticket_status' => 'valid',
            ]);

            return response()->json([
                'message' => 'Pembayaran paket bundling berhasil disetujui dan bagi hasil konsinyasi tercatat!',
                'data' => $ticket->load(['destination', 'ticketItems.umkmProduct'])
            ]);
        });
    }

    public function reject(Request $request, $id)
    {
        $validated = $request->validate([
            'rejection_reason' => 'required|string|max:255',
        ]);

        $ticket = Ticket::findOrFail($id);

        $ticket->update([
            'payment_status' => 'cancelled',
            'ticket_status' => 'expired',
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