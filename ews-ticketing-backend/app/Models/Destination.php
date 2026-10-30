<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Destination extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'type',                // Penanda tipe: 'destination' (tiket murni) atau 'package' (paket bundling)
        'description',
        'location',
        'ticket_price',
        'umkm_revenue_share',  // Porsi estimasi bagi hasil untuk UMKM Sedyo Maju
        'image_url',
        'is_active',

    ];

    public function images()
    {
        return $this->hasMany(DestinationImage::class);
    }

    /**
     * Relasi ke transaksi tiket yang dipesan
     */
    public function tickets()
    {
        return $this->hasMany(Ticket::class);
    }
}