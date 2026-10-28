<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ConsignmentSettlement extends Model
{
    use HasFactory;

    protected $fillable = [
        'ticket_id',
        'umkm_product_id',
        'qty',
        'total_umkm_income',
        'total_pokdarwis_income',
    ];

    public function ticket()
    {
        return $this->belongsTo(Ticket::class);
    }

    public function umkmProduct()
    {
        return $this->belongsTo(UmkmProduct::class);
    }
}