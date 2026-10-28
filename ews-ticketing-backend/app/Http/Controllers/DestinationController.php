<?php

namespace App\Http\Controllers;

use App\Models\Destination;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DestinationController extends Controller
{
    // 1. Ambil semua daftar destinasi (Mendukung filter aktif untuk publik)
    public function index(Request $request)
    {
        $query = Destination::query();

        // Jika request dari Landing Page Publik (misal: /api/destinations?active=true)
        if ($request->has('active') && $request->boolean('active')) {
            $query->where('is_active', true);
        }

        $destinations = $query->latest()->get();

        return response()->json($destinations);
    }

    // 2. Simpan destinasi atau paket wisata baru (Mendukung Upload File Gambar)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'location' => 'required|string|max:255',
            'ticket_price' => 'required|integer|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048', // Jika upload file gambar
            'image_url' => 'nullable|string', // Jika kirim URL/Path langsung
            'is_active' => 'boolean',
        ]);

        // Default status aktif jika tidak diisi
        $validated['is_active'] = $request->has('is_active') ? $request->boolean('is_active') : true;

        // Penanganan upload file gambar (Opsional)
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('destinations', 'public');
            $validated['image_url'] = Storage::url($path);
        }

        $destination = Destination::create($validated);

        return response()->json([
            'message' => 'Destinasi berhasil ditambahkan',
            'data' => $destination
        ], 201);
    }

    // 3. Tampilkan detail satu destinasi
    public function show(Destination $destination)
    {
        return response()->json($destination);
    }

    // 4. Perbarui data destinasi (Mendukung Upload Gambar Baru)
    public function update(Request $request, Destination $destination)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'location' => 'sometimes|required|string|max:255',
            'ticket_price' => 'sometimes|required|integer|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'image_url' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        if ($request->hasFile('image')) {
            // Hapus gambar lama jika ada di storage
            if ($destination->image_url && !filter_var($destination->image_url, FILTER_VALIDATE_URL)) {
                $oldPath = str_replace('/storage/', '', $destination->image_url);
                Storage::disk('public')->delete($oldPath);
            }

            $path = $request->file('image')->store('destinations', 'public');
            $validated['image_url'] = Storage::url($path);
        }

        $destination->update($validated);

        return response()->json([
            'message' => 'Destinasi berhasil diperbarui',
            'data' => $destination
        ]);
    }

    // 5. Toggle Status Operasional / Darurat EWS (Aktif <-> Nonaktif/Darurat)
    public function toggleStatus(Destination $destination)
    {
        $destination->is_active = !$destination->is_active;
        $destination->save();

        return response()->json([
            'message' => 'Status operasional destinasi berhasil diubah',
            'data' => $destination
        ]);
    }

    // 6. Hapus destinasi
    public function destroy(Destination $destination)
    {
        // Hapus file gambar terkait di storage jika ada
        if ($destination->image_url && !filter_var($destination->image_url, FILTER_VALIDATE_URL)) {
            $oldPath = str_replace('/storage/', '', $destination->image_url);
            Storage::disk('public')->delete($oldPath);
        }

        $destination->delete();

        return response()->json([
            'message' => 'Destinasi berhasil dihapus'
        ]);
    }
}