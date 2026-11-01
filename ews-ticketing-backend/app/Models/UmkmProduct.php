<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UmkmProduct extends Model
{
    use HasFactory;

    protected $fillable = [
        'umkm_id',
        'name',
        'slug',
        'description',
        'price',
        'stock',
        'umkm_share_amount',
        'is_active',
    ];

    /**
     * Relasi ke multi-gambar produk (Galeri)
     */
    public function images()
    {
        return $this->hasMany(UmkmProductImage::class);
    }

    /**
     * Relasi ke pencatatan konsinyasi/bagi hasil
     */
    public function consignmentSettlements()
    {
        return $this->hasMany(ConsignmentSettlement::class);
    }
}