<?php
/**
 * Created by PhpStorm.
 * User: rocky
 * Date: 2/1/19
 * Time: 8:32 PM
 */

namespace App\Models;
use Illuminate\Database\Eloquent\Model;


class ChartMonth extends Model
{
    // Assign table from DB
    protected $table = 'chart_month_data';

    // Do not let created_at & updated_at columns exist
    public $timestamps = false;

    protected $fillable = ['time','type','open','high','low','close','volume'];
}