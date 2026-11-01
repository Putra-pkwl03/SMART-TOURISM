<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UmkmProductImage extends Model
{
    use HasFactory;

    protected $fillable = [
        'umkm_product_id',
        'image_path',
        'is_primary',
    ];

    public function product()
    {
        return $this->belongsTo(UmkmProduct::class, 'umkm_product_id');
    }
}