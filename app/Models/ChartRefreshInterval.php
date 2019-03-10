<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class ChartRefreshInterval extends Model
{
    // Assign table from DB
    protected $table = 'chart_refresh_interval';

    // Let created_at & updated_at columns exist
    public $timestamps = true;

    protected $fillable = ['id','created_at','updated_at','interval'];
}