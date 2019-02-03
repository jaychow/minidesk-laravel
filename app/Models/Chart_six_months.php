<?php
/**
 * Created by PhpStorm.
 * User: rocky
 * Date: 2/1/19
 * Time: 8:44 PM
 */

namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Chart_six_months extends Model
{
    // Assign table from DB
    protected $table = 'chart_six_months_data';

    // Do not let created_at & updated_at columns exist
    public $timestamps = false;

    protected $fillable = ['time','type','open','high','low','close','volume'];
}