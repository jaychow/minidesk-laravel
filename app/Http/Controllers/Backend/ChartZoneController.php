<?php

namespace App\Http\Controllers\Backend;

use App\Models\ChartZone;
use App\Http\Controllers\Controller;
use GuzzleHttp\Client;
use function GuzzleHttp\json_encode;
use GuzzleHttp\Psr7;
use GuzzleHttp\Exception\RequestException;
use Illuminate\Http\Request;

date_default_timezone_set('Europe/London'); // UTC + 0

class ChartZoneController extends Controller
{
    public function index()
    {
        return view('backend.chartzone');
    }

    // Response backend request -> Zone data
    public function getZone(Request $request)  //Request $request
    {
        // Common parameter (Default)
        $currency = $request->get('pair');
        $result = ChartZone::where('currency', $currency)->orderBy('high', 'desc')->get();
        $output = [];

        foreach ($result as $data)
        {
            $output[] =
                [
                    $data->currency,
                    $data->trade,
                    $data->high,
                    $data->low,
                    $data->date,
                ];
        }

        return response()->json($output);
    }

    // Receive data from backend -> Zone data
    public function submitZone(Request $request)  //Request $request
    {
        // Common parameter (Default)
        $currency = $request->get('pair');
        $fromTimes = $request->get('fromTime');
        $highs = $request->get('high');
        $lows = $request->get('low');

        $query = [] ;
        $i = 0;

        foreach ($fromTimes as $value)
        {
            $query[] =
                [
                    'created_at' => now(),
                    'currency' => $currency,
                    'trade' => 'Buy',
                    'enable'=> true,
                    'date' => $fromTimes[$i],
                    'high' => $highs[$i],
                    'low' => $lows[$i]
                ];
            $i = $i + 1;
        }

        try
        {
            // Refresh data in DB
            ChartZone::where('currency', $currency)->delete();

            // Insert data into DB
            ChartZone::insert($query);
        }
        catch(\Illuminate\Database\QueryException $ex)
        {
            return 'Fail to insert the data into DB';
        }
        return 'OK';
    }
}
