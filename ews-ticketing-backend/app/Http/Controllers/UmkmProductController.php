<?php

namespace App\Http\Controllers;

use App\Models\UmkmProduct;
use App\Models\UmkmProductImage;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class UmkmProductController extends Controller
{
    /**
     * Menampilkan daftar produk milik UMKM (API / Dashboard)
     */
    public function index(Request $request)
    {
        $query = UmkmProduct::with('images');

        if ($request->has('umkm_id')) {
            $query->where('umkm_id', $request->umkm_id);
        }

        $products = $query->latest()->get();

        return response()->json([
            'status' => 'success',
            'data' => $products
        ]);
    }

    /**
     * Menyimpan produk baru beserta multi-gambar
     */
    public function store(Request $request)
    {
        // Sesuaikan dengan validasi (umkm_id dibuat nullable / diisi otomatis dari auth)
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|integer|min:0',
            'initial_stock' => 'required|integer|min:0', 
            'umkm_share_amount' => 'required|integer|min:0',
            'images.*' => 'image|mimes:jpeg,png,jpg|max:2048',
        ]);

        // Otomatis assign umkm_id dari user yang sedang login (atau relasi UMKM-nya)
        // Jika tabel users berelasi langsung dengan umkm, atau user ID itu sendiri adalah UMKM ID:
        $user = $request->user();
        
        // Cek jika user memiliki relasi umkm atau simpan ID user langsung
        // (Sesuaikan jika Anda punya kolom umkm_id di tabel users, misal: $user->umkm_id)
        $validated['umkm_id'] = $user->umkm_id ?? $user->id; 

        $validated['slug'] = Str::slug($validated['name']) . '-' . uniqid();
        $validated['is_active'] = true;
        
        // Stok berjalan otomatis disamakan dengan stok awal saat pertama dibuat
        $validated['stock'] = $validated['initial_stock'];

        // Simpan produk utama
        $product = UmkmProduct::create($validated);

        // Proses Upload Multi-Gambar
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $index => $image) {
                $path = $image->store('products', 'public');

                UmkmProductImage::create([
                    'umkm_product_id' => $product->id,
                    'image_path' => $path,
                    'is_primary' => $index === 0 ? true : false, 
                ]);
            }
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Produk dan galeri berhasil ditambahkan.',
            'data' => $product->load('images')
        ], 201);
    }

    /**
     * Menampilkan detail produk tertentu
     */
    public function show($id)
    {
        $product = UmkmProduct::with('images')->findOrFail($id);

        return response()->json([
            'status' => 'success',
            'data' => $product
        ]);
    }

    /**
     * Memperbarui data produk dan opsi tambah/hapus gambar
     */
    public function update(Request $request, $id)
    {
        $product = UmkmProduct::with('images')->findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'price' => 'sometimes|integer|min:0',
            'initial_stock' => 'sometimes|integer|min:0',
            'stock' => 'sometimes|integer|min:0',
            'umkm_share_amount' => 'sometimes|integer|min:0',
            'is_active' => 'sometimes|boolean',
            'images.*' => 'image|mimes:jpeg,png,jpg|max:2048',
            'removed_image_ids' => 'nullable|array',
            'removed_image_ids.*' => 'integer|exists:umkm_product_images,id',
        ]);

        if (isset($validated['name'])) {
            $validated['slug'] = Str::slug($validated['name']) . '-' . $product->id;
        }

        $product->update($validated);

        // 1. PROSES HAPUS GAMBAR LAMA
        if ($request->has('removed_image_ids')) {
            $imagesToRemove = UmkmProductImage::whereIn('id', $request->removed_image_ids)
                ->where('umkm_product_id', $product->id)
                ->get();

            foreach ($imagesToRemove as $img) {
                if (Storage::disk('public')->exists($img->image_path)) {
                    Storage::disk('public')->delete($img->image_path);
                }
                $img->delete();
            }
        }

        // 2. PROSES TAMBAH GAMBAR BARU
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('products', 'public');

                UmkmProductImage::create([
                    'umkm_product_id' => $product->id,
                    'image_path' => $path,
                    'is_primary' => $product->images()->count() === 0 ? true : false,
                ]);
            }
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Produk berhasil diperbarui.',
            'data' => $product->load('images')
        ]);
    }

    /**
     * Menghapus produk beserta file gambarnya di storage
     */
    public function destroy($id)
    {
        $product = UmkmProduct::with('images')->findOrFail($id);

        foreach ($product->images as $image) {
            if (Storage::disk('public')->exists($image->image_path)) {
                Storage::disk('public')->delete($image->image_path);
            }
        }

        $product->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Produk dan seluruh gambarnya berhasil dihapus.'
        ]);
    }

    /**
     * Endpoint untuk memperbarui atau menambah stok (Update Stok Cepat / Restock)
     */
    public function updateStock(Request $request, $id)
    {
        $request->validate([
            'stock' => 'required|integer|min:0'
        ]);

        $product = UmkmProduct::findOrFail($id);
        
        // Menghitung selisih penambahan stok (jika stok baru lebih besar dari stok lama)
        $oldStock = $product->stock;
        $newStock = $request->stock;
        $diff = $newStock - $oldStock;

        // Jika ada penambahan stok (restock), ikuti juga penambahan pada initial_stock (stok awal titipan)
        if ($diff > 0) {
            $product->initial_stock = ($product->initial_stock ?? $oldStock) + $diff;
        }

        // Perbarui sisa stok berjalan
        $product->stock = $newStock;
        $product->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Stok produk berhasil diperbarui.',
            'data' => $product
        ]);
    }
}