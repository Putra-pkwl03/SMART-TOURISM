<?php

namespace Database\Seeders;

use App\Models\Destination;
use App\Models\DestinationImage;
use App\Models\UmkmProduct;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class DestinationSeeder extends Seeder
{
    public function run(): void
    {
        $products = UmkmProduct::whereIn('slug', [
            'demo-getuk-goreng-sedyomaju',
            'demo-kembang-goyang-sedyomaju',
            'demo-tape-singkong-sedyomaju',
        ])->get()->keyBy('slug');

        $destinations = [
            [
                'slug' => 'demo-paket-jelajah-jurug-gedhe',
                'name' => 'Paket Jelajah Jurug Gedhe',
                'description' => 'Data contoh paket wisata non-bundling. Silakan sesuaikan informasi dan foto melalui dashboard admin.',
                'ticket_price' => 25000,
                'product_slug' => null,
            ],
            [
                'slug' => 'demo-paket-wisata-alam-ngoro-oro',
                'name' => 'Paket Wisata Alam Ngoro-oro',
                'description' => 'Data contoh paket wisata non-bundling. Silakan sesuaikan informasi dan foto melalui dashboard admin.',
                'ticket_price' => 35000,
                'product_slug' => null,
            ],
            [
                'slug' => 'demo-paket-jelajah-dan-getuk',
                'name' => 'Paket Jelajah dan Getuk Goreng',
                'description' => 'Data contoh paket bundling dengan produk UMKM. Silakan sesuaikan informasi dan foto melalui dashboard admin.',
                'ticket_price' => 50000,
                'product_slug' => 'demo-getuk-goreng-sedyomaju',
            ],
            [
                'slug' => 'demo-paket-keluarga-dan-kembang-goyang',
                'name' => 'Paket Keluarga dan Kembang Goyang',
                'description' => 'Data contoh paket bundling dengan produk UMKM. Silakan sesuaikan informasi dan foto melalui dashboard admin.',
                'ticket_price' => 55000,
                'product_slug' => 'demo-kembang-goyang-sedyomaju',
            ],
            [
                'slug' => 'demo-paket-edukasi-dan-tape',
                'name' => 'Paket Edukasi Desa dan Tape Singkong',
                'description' => 'Data contoh paket bundling dengan produk UMKM. Silakan sesuaikan informasi dan foto melalui dashboard admin.',
                'ticket_price' => 45000,
                'product_slug' => 'demo-tape-singkong-sedyomaju',
            ],
        ];

        foreach ($destinations as $destinationData) {
            $slug = $destinationData['slug'];
            $destination = Destination::firstOrCreate(
                ['name' => $destinationData['name']],
                [
                    'type' => 'package',
                    'description' => $destinationData['description'],
                    'location' => 'Padukuhan Gembyong, Ngoro-oro, Patuk, Gunungkidul',
                    'ticket_price' => $destinationData['ticket_price'],
                    'is_active' => true,
                ],
            );

            if (!$destination->image_url) {
                $imagePath = "demo/destinations/{$slug}.svg";
                Storage::disk('public')->put($imagePath, $this->placeholderSvg($destination->name));
                $imageUrl = Storage::disk('public')->url($imagePath);
                $destination->forceFill(['image_url' => $imageUrl])->save();
            } else {
                $imageUrl = $destination->image_url;
            }

            DestinationImage::firstOrCreate(
                ['destination_id' => $destination->id, 'sort_order' => 0],
                ['image_url' => $imageUrl],
            );

            $product = $destinationData['product_slug']
                ? $products->get($destinationData['product_slug'])
                : null;

            $destination->umkmProducts()->sync($product ? [$product->id] : []);
        }
    }

    private function placeholderSvg(string $label): string
    {
        $safeLabel = htmlspecialchars(Str::limit($label, 32, ''), ENT_QUOTES | ENT_XML1, 'UTF-8');

        return <<<SVG
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#064e3b"/>
      <stop offset="1" stop-color="#14b8a6"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="900" fill="url(#bg)"/>
  <circle cx="970" cy="180" r="240" fill="#ccfbf1" opacity=".16"/>
  <path d="M0 590 260 360l190 160 270-300 480 370v310H0Z" fill="#d1fae5" opacity=".2"/>
  <path d="M0 720q280-210 590 0t610-20v200H0Z" fill="#022c22" opacity=".36"/>
  <text x="600" y="480" text-anchor="middle" fill="#ecfdf5" font-family="Arial,sans-serif" font-size="54" font-weight="700">GAMBAR CONTOH</text>
  <text x="600" y="560" text-anchor="middle" fill="#d1fae5" font-family="Arial,sans-serif" font-size="40">{$safeLabel}</text>
  <text x="600" y="620" text-anchor="middle" fill="#d1fae5" opacity=".82" font-family="Arial,sans-serif" font-size="26">Silakan ganti melalui dashboard</text>
</svg>
SVG;
    }
}
