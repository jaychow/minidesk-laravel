<?php
/**
 * Created by PhpStorm.
 * User: rocky
 * Date: 3/9/19
 * Time: 2:21 PM
 */

namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class ChartTimeInterval extends Model
{
    // Assign table from DB
    protected $table = 'chart_time_interval';

    // Let created_at & updated_at columns exist
    public $timestamps = true;

    protected $fillable = ['account','created_at','updated_at','interval'];
}