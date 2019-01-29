<?php

namespace App\Models;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Model;

class Chart extends Model
{
    // Assign table from DB
    protected $table = 'chart';

    // Do not let created_at & updated_at columns exist
    public $timestamps = false;

    protected $fillable = ['Time','Type','Open','High','Low','Close','Volume'];
}




