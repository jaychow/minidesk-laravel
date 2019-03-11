<?php
/**
 * Created by PhpStorm.
 * User: rocky
 * Date: 2/1/19
 * Time: 8:33 PM
 */

namespace App\Models;
use Illuminate\Database\Eloquent\Model;


class TradeSettingRecord extends Model
{
    // Assign table from DB
    protected $table = 'trade_setting_record';

    // Do not let created_at & updated_at columns exist
    public $timestamps = false;

    protected $fillable = ['id','account','home_currency','foreign_currency','trade','amount','date'];
}