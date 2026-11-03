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
        'initial_stock',
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

    /**
     * Relasi ke item tiket (Penjualan via Bundling Tiket)
     */
    public function ticketItems()
    {
        return $this->hasMany(TicketItem::class);
    }

    /**
     * Shortcut untuk langsung mengambil data Tiket yang memesan produk ini
     */
    public function tickets()
    {
        return $this->belongsToMany(Ticket::class, 'ticket_items')
                    ->withPivot('quantity', 'subtotal_price')
                    ->withTimestamps();
    }
}