<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UmkmOfflineSale extends Model
{
    use HasFactory;

    protected $fillable = [
        'cashier_id',
        'receipt_code',
        'payment_method',
        'total_amount',
    ];

    public function cashier()
    {
        return $this->belongsTo(User::class, 'cashier_id');
    }

    public function items()
    {
        return $this->hasMany(ConsignmentSettlement::class, 'offline_sale_id');
    }
}
