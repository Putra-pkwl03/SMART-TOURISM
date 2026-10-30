<?php

namespace App\Http\Controllers;

use App\Models\Destination;
use App\Models\DestinationImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DestinationController extends Controller
{
    public function index(Request $request)
    {
        $query = Destination::with('images'); // Load relasi multi-gambar

        if ($request->has('type')) {
            $query->where('type', $request->input('type'));
        }

        if ($request->has('active') && $request->boolean('active')) {
            $query->where('is_active', true);
        }

        return response()->json($query->latest()->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'nullable|in:destination,package',
            'description' => 'nullable|string',
            'location' => 'required|string|max:255',
            'ticket_price' => 'required|integer|min:0',
            'umkm_revenue_share' => 'nullable|numeric|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048', // Banner utama
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048', // Multi-gambar galeri
            'is_active' => 'boolean',
        ]);

        $validated['type'] = $request->input('type', 'destination');
        $validated['is_active'] = $request->has('is_active') ? $request->boolean('is_active') : true;

        // Simpan banner utama jika ada
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('destinations', 'public');
            $validated['image_url'] = Storage::url($path);
        }

        $destination = Destination::create($validated);

        // Simpan multi-gambar galeri jika diunggah
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $imgPath = $file->store('destinations/gallery', 'public');
                DestinationImage::create([
                    'destination_id' => $destination->id,
                    'image_url' => Storage::url($imgPath),
                ]);
            }
        }

        return response()->json([
            'message' => 'Destinasi atau paket berhasil ditambahkan',
            'data' => $destination->load('images')
        ], 201);
    }

    public function show(Destination $destination)
    {
        return response()->json($destination->load('images'));
    }

    public function update(Request $request, Destination $destination)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'type' => 'sometimes|in:destination,package',
            'description' => 'nullable|string',
            'location' => 'sometimes|required|string|max:255',
            'ticket_price' => 'sometimes|required|integer|min:0',
            'umkm_revenue_share' => 'nullable|numeric|min:0',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'existing_image_ids' => 'nullable|array', 
            'existing_image_ids.*' => 'integer|exists:destination_images,id',
            'image_orders' => 'nullable|array', 
            'image_orders.*' => 'integer|exists:destination_images,id', // Hanya terima angka (ID database)
            'is_active' => 'boolean',
        ]);

        $destination->update($validated);

        // 1. HAPUS FOTO LAMA YANG DIBUANG OLEH USER
        $keptImageIds = $request->input('existing_image_ids', []);
        $imagesToDelete = $destination->images()->whereNotIn('id', $keptImageIds)->get();
        foreach ($imagesToDelete as $img) {
            if ($img->image_url && !filter_var($img->image_url, FILTER_VALIDATE_URL)) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $img->image_url));
            }
            $img->delete();
        }

        // 2. UPDATE URUTAN (sort_order) UNTUK FOTO LAMA
        if ($request->has('image_orders')) {
            foreach ($request->input('image_orders') as $index => $imageId) {
                DestinationImage::where('id', $imageId)
                    ->where('destination_id', $destination->id)
                    ->update(['sort_order' => $index]);
            }
        }

        // 3. TAMBAH GALERI FOTO BARU
        if ($request->hasFile('images')) {
            $existingCount = $destination->images()->count();
            foreach ($request->file('images') as $index => $file) {
                $imgPath = $file->store('destinations/gallery', 'public');
                DestinationImage::create([
                    'destination_id' => $destination->id,
                    'image_url' => Storage::url($imgPath),
                    'sort_order' => $existingCount + $index, 
                ]);
            }
        }

        // 4. OTOMATIS JADIKAN FOTO PERTAMA SEBAGAI BANNER UTAMA
        $firstImage = $destination->images()->orderBy('sort_order')->orderBy('id')->first();
        if ($firstImage) {
            $destination->update(['image_url' => $firstImage->image_url]);
        } else {
            $destination->update(['image_url' => null]);
        }

        return response()->json([
            'message' => 'Data dan galeri berhasil diperbarui',
            'data' => $destination->load(['images' => function($q) {
                $q->orderBy('sort_order')->orderBy('id');
            }])
        ]);
    }
    
    public function destroy(Destination $destination)
    {
        if ($destination->image_url && !filter_var($destination->image_url, FILTER_VALIDATE_URL)) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $destination->image_url));
        }
        
        // Hapus file fisik galeri
        foreach($destination->images as $img) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $img->image_url));
        }

        $destination->delete();

        return response()->json(['message' => 'Data berhasil dihapus']);
    }
}