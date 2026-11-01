<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Destination extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'type',              
        'description',
        'location',
        'ticket_price',
        'image_url',
        'is_active',
    ];

    public function images()
    {
        return $this->hasMany(DestinationImage::class);
    }

    /**
     * Relasi ke Produk UMKM (Bundling Paket Wisata)
     */
    public function umkmProducts()
    {
        return $this->belongsToMany(UmkmProduct::class, 'destination_umkm_products', 'destination_id', 'umkm_product_id');
    }

    public function tickets()
    {
        return $this->hasMany(Ticket::class);
    }
}