<?php
/**
 * Created by PhpStorm.
 * User: rocky
 * Date: 2/1/19
 * Time: 8:33 PM
 */

namespace App\Models;
use Illuminate\Database\Eloquent\Model;


class ChartYear extends Model
{
    // Assign table from DB
    protected $table = 'chart_year_data';

    // Do not let created_at & updated_at columns exist
    public $timestamps = false;

    protected $fillable = ['time','type','open','high','low','close','volume'];
}