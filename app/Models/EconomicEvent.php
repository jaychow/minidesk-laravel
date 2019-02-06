<?php
/**
 * Created by PhpStorm.
 * User: rocky
 * Date: 2/5/19
 * Time: 7:20 PM
 */

namespace App\Models;
use Illuminate\Database\Eloquent\Model;


class EconomicEvent extends Model
{
    // Assign table from DB
    protected $table = 'economic_event';

    // Do not let created_at & updated_at columns exist
    public $timestamps = false;

    protected $fillable = ['time','type','open','high','low','close','volume'];

}