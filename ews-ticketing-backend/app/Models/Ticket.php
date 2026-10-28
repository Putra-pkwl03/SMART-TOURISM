<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    use HasFactory;

    protected $fillable = [
        'ticket_code',
        'destination_id',
        'user_id',
        'visitor_count',
        'visit_date',
        'total_price',
        'payment_status',
        'payment_method',   
        'payment_proof',
        'ticket_status',
        'used_at',
        'validated_by',
    ];

    public function destination()
    {
        return $this->belongsTo(Destination::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function ticketItems()
    {
        return $this->hasMany(TicketItem::class);
    }

    public function consignmentSettlements()
    {
        return $this->hasMany(ConsignmentSettlement::class);
    }
}