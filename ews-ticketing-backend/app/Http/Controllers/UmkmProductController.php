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
        // Jika user memiliki umkm_id tertentu, filter berdasarkan itu. 
        // Jika admin utama, bisa melihat semua produk.
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
        $validated = $request->validate([
            'umkm_id' => 'required|integer',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|integer|min:0',
            'stock' => 'required|integer|min:0',
            'umkm_share_amount' => 'required|integer|min:0', // Bagi hasil / pendapatan bersih UMKM
            'images.*' => 'image|mimes:jpeg,png,jpg|max:2048', // Validasi file gambar
        ]);

        $validated['slug'] = Str::slug($validated['name']) . '-' . uniqid();
        $validated['is_active'] = true;

        // Simpan produk utama
        $product = UmkmProduct::create($validated);

        // Proses Upload Multi-Gambar
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $index => $image) {
                // Simpan ke storage public/products
                $path = $image->store('products', 'public');

                UmkmProductImage::create([
                    'umkm_product_id' => $product->id,
                    'image_path' => $path,
                    // Gambar pertama otomatis dijadikan gambar utama (thumbnail)
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
            'stock' => 'sometimes|integer|min:0',
            'umkm_share_amount' => 'sometimes|integer|min:0',
            'is_active' => 'sometimes|boolean',
            'images.*' => 'image|mimes:jpeg,png,jpg|max:2048',
            'removed_image_ids' => 'nullable|array', // Validasi array ID gambar yang ingin dihapus
            'removed_image_ids.*' => 'integer|exists:umkm_product_images,id',
        ]);

        if (isset($validated['name'])) {
            $validated['slug'] = Str::slug($validated['name']) . '-' . $product->id;
        }

        $product->update($validated);

        // 1. PROSES HAPUS GAMBAR LAMA YANG DIPILIH DI FRONTEND
        if ($request->has('removed_image_ids')) {
            $imagesToRemove = UmkmProductImage::whereIn('id', $request->removed_image_ids)
                ->where('umkm_product_id', $product->id)
                ->get();

            foreach ($imagesToRemove as $img) {
                // Hapus file fisik dari storage public
                if (Storage::disk('public')->exists($img->image_path)) {
                    Storage::disk('public')->delete($img->image_path);
                }
                // Hapus record dari database
                $img->delete();
            }
        }

        // 2. PROSES TAMBAH GAMBAR BARU JIKA DIUNGGAH SAAT UPDATE
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('products', 'public');

                UmkmProductImage::create([
                    'umkm_product_id' => $product->id,
                    'image_path' => $path,
                    // Jika produk sudah tidak punya gambar sama sekali, jadikan utama
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

        // Hapus file fisik gambar dari storage
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
     * Endpoint khusus untuk memperbarui stok secara cepat (Monitoring Stok/Konsinyasi)
     */
    public function updateStock(Request $request, $id)
    {
        $request->validate([
            'stock' => 'required|integer|min:0'
        ]);

        $product = UmkmProduct::findOrFail($id);
        $product->update(['stock' => $request->stock]);

        return response()->json([
            'status' => 'success',
            'message' => 'Stok produk berhasil diperbarui.',
            'data' => $product
        ]);
    }
}