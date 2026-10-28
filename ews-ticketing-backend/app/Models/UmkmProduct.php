<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UmkmProduct extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'price',
        'stock',
        'umkm_share_amount',
        'is_active',
    ];

    public function consignmentSettlements()
    {
        return $this->hasMany(ConsignmentSettlement::class);
    }
}