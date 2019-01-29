<?php

namespace App\Models;

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
                    'Type' => $data[0],
                    'Time' => $data[1],
                    'Open' => $data[2],
                    'High' => $data[3],
                    'Low' => $data[4],
                    'Close' => $data[5],
                    'Volume' => $data[6]
                ];
        }
        DB::table('chart')->insert($query);
    }
}


