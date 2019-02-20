<?php
/**
 * Created by PhpStorm.
 * User: rocky
 * Date: 2/1/19
 * Time: 8:33 PM
 */

namespace App\Models;
use Illuminate\Database\Eloquent\Model;


class ChartZone extends Model
{
    // Assign table from DB
    protected $table = 'chart_zone';

    // Let created_at & updated_at columns exist
    public $timestamps = true;

    protected $fillable = ['id','created_at	','updated_at','currency','trade','color','enable','high','low','date'];
}