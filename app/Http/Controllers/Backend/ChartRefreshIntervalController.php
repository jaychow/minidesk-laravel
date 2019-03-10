<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use App\Models\ChartRefreshInterval;
use Illuminate\Http\Request;

class ChartRefreshIntervalController extends Controller
{
    public function index()
    {
        return view('backend.chartrefresh');
    }

    // Response backend request -> Chart refresh interval
    public function getInterval()
    {
        $result = ChartRefreshInterval::get();

        $output ='';
        foreach ($result as $data)
        {
            $output = $data->interval;
        }
        return $output;
    }

    // Receive data from backend -> Chart refresh interval
    public function submitInterval(Request $request)
    {
        // Common parameter (Default)
        $interval = $request->get('interval');

        $result = ChartRefreshInterval::count();
        if($result > 0)
        {
            $query = [
                'updated_at' => now(),
                'interval' => $interval
            ];
            try
            {
                // Update data into DB
                ChartRefreshInterval::where('id',1)->update($query);
            }
            catch(\Illuminate\Database\QueryException $ex)
            {
                return 'Fail to update the data into DB';
            }
        }
        else
        {
            $query = [
                'created_at' => now(),
                'interval' => $interval
            ];
            try
            {
                // Insert data into DB
                ChartRefreshInterval::insert($query);
            }
            catch(\Illuminate\Database\QueryException $ex)
            {
                return 'Fail to insert the data into DB';
            }
        }
        return 'OK';
    }
}