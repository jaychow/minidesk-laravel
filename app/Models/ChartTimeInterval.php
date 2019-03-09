<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class ChartTimeInterval extends Model
{
    // Assign table from DB
    protected $table = 'chart_time_interval';

    // Let created_at & updated_at columns exist
    public $timestamps = true;

    protected $fillable = ['id','created_at','updated_at','day','hour','minute'];
}