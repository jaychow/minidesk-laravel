<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;


class ChartData extends Model
{
    // Assign table from DB
    protected $table = 'chart_data';

    // Do not let created_at & updated_at columns exist
    public $timestamps = false;

    protected $fillable = ['time','type','open','high','low','close','volume','price_change','price_range','time_scale'];
}
