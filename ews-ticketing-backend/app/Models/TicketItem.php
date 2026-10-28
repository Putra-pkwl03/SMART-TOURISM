<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TicketItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'ticket_id',
        'umkm_product_id',
        'quantity',
        'subtotal_price',
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