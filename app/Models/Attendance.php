<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    use HasFactory;

    protected $fillable = [
        'uid',
        'employee_id',
        'state',
        'timestamp',
        'type',
    ];

    protected $casts = [
        'timestamp' => 'datetime',
    ];

}
