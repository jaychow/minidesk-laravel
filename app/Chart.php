<?php

namespace App;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Model;

class Chart extends Model
{
    public static function addAPIdata($source)
    {
        $query = [];
        foreach ($source as $data)
        {
            $query[] =
                [
                    'Time' => $data[0],
                    'Open' => $data[1],
                    'High' => $data[2],
                    'Low' => $data[3],
                    'Close' => $data[4],
                ];
        }
        DB::table('chart')->insert($query);
    }
    //
}


