<?php

namespace App;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Model;

class Chart extends Model
{
    public static function API_data($test1,$test2,$test3,$test4,$test5)
    {

        DB::table('chart')->insert(['Time' => $test1 ,'Open' => $test2 ,'High' => $test3 ,'Low' => $test4,'Close' => $test5]);
    }
}


