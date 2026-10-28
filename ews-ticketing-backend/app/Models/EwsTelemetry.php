<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EwsTelemetry extends Model
{
    use HasFactory;

    protected $fillable = [
        'water_level',
        'rainfall',
        'temperature',
        'humidity',
        'status',
        'description',
    ];
}