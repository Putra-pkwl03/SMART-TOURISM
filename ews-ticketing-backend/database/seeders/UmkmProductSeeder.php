<?php

namespace Database\Seeders;

use App\Models\UmkmProduct;
use App\Models\UmkmProductImage;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UmkmProductSeeder extends Seeder
{
    public function run(): void
    {
        $umkmUser = User::where('email', 'umkm@sedyomaju.com')->firstOrFail();

        $products = [
            [
                'slug' => 'demo-getuk-goreng-sedyomaju',
                'name' => 'Getuk Goreng Sedyomaju',
                'description' => 'Data contoh untuk paket bundling. Silakan sesuaikan deskripsi dan gambar melalui dashboard UMKM.',
                'price' => 15000,
                'umkm_share_amount' => 12000,
                'stock' => 30,
            ],
            [
                'slug' => 'demo-kembang-goyang-sedyomaju',
                'name' => 'Kembang Goyang Sedyomaju',
                'description' => 'Data contoh untuk paket bundling. Silakan sesuaikan deskripsi dan gambar melalui dashboard UMKM.',
                'price' => 12000,
                'umkm_share_amount' => 10000,
                'stock' => 30,
            ],
            [
                'slug' => 'demo-tape-singkong-sedyomaju',
                'name' => 'Tape Singkong Sedyomaju',
                'description' => 'Data contoh untuk paket bundling. Silakan sesuaikan deskripsi dan gambar melalui dashboard UMKM.',
                'price' => 10000,
                'umkm_share_amount' => 8500,
                'stock' => 25,
            ],
            [
                'slug' => 'demo-lempeng-karak-sedyomaju',
                'name' => 'Lempeng Karak Sedyomaju',
                'description' => 'Data contoh produk UMKM tanpa relasi bundling. Silakan sesuaikan melalui dashboard UMKM.',
                'price' => 15000,
                'umkm_share_amount' => 12000,
                'stock' => 25,
            ],
            [
                'slug' => 'demo-keripik-singkong-sedyomaju',
                'name' => 'Keripik Singkong Sedyomaju',
                'description' => 'Data contoh produk UMKM tanpa relasi bundling. Silakan sesuaikan melalui dashboard UMKM.',
                'price' => 14000,
                'umkm_share_amount' => 11000,
                'stock' => 25,
            ],
        ];

        foreach ($products as $productData) {
            $slug = $productData['slug'];
            $product = UmkmProduct::firstOrCreate(
                ['slug' => $slug],
                [
                    'umkm_id' => $umkmUser->id,
                    'name' => $productData['name'],
                    'description' => $productData['description'],
                    'price' => $productData['price'],
                    'initial_stock' => $productData['stock'],
                    'stock' => $productData['stock'],
                    'umkm_share_amount' => $productData['umkm_share_amount'],
                    'is_active' => true,
                ],
            );

            $imagePath = "demo/products/{$slug}.svg";
            Storage::disk('public')->put($imagePath, $this->placeholderSvg($product->name));

            UmkmProductImage::firstOrCreate(
                [
                    'umkm_product_id' => $product->id,
                    'image_path' => $imagePath,
                ],
                ['is_primary' => true],
            );
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
      <stop offset="1" stop-color="#34d399"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="900" fill="url(#bg)"/>
  <circle cx="980" cy="170" r="220" fill="#d1fae5" opacity=".14"/>
  <circle cx="170" cy="780" r="300" fill="#a7f3d0" opacity=".12"/>
  <path d="M0 690 Q300 520 600 700 T1200 640 V900 H0Z" fill="#022c22" opacity=".28"/>
  <text x="600" y="420" text-anchor="middle" fill="#ecfdf5" font-family="Arial,sans-serif" font-size="54" font-weight="700">GAMBAR CONTOH</text>
  <text x="600" y="500" text-anchor="middle" fill="#d1fae5" font-family="Arial,sans-serif" font-size="42">{$safeLabel}</text>
  <text x="600" y="570" text-anchor="middle" fill="#d1fae5" opacity=".8" font-family="Arial,sans-serif" font-size="26">Silakan ganti melalui dashboard</text>
</svg>
SVG;
    }
}
