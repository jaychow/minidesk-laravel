<?php

namespace App\Http\Controllers\Backend;

use App\Models\ZoneEditor;
use App\Http\Controllers\Controller;
use GuzzleHttp\Client;
use function GuzzleHttp\json_encode;
use GuzzleHttp\Psr7;
use GuzzleHttp\Exception\RequestException;
use Illuminate\Http\Request;

date_default_timezone_set('Europe/London'); // UTC + 0

class ZoneEditorController extends Controller
{
    public function index()
    {
        return view('backend.zoneeditor');
    }

    // Response backend request -> Zone data
    public function getZone(Request $request)  //Request $request
    {
        // Common parameter (Default)
        $currency = $request->get('pair');
        $result = ZoneEditor::where('currency', $currency)->orderBy('high', 'desc')->get();
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
        $trades = $request->get('trade');
        $highs = $request->get('high');
        $lows = $request->get('low');

        $query = [] ;
        $i = 0;

        foreach ($fromTimes as $value)
        {
            // Detect the empty data in json array
            if(($fromTimes[$i] == '') || ($highs[$i] == '') || ($lows[$i] == '')){break;}
            $query[] =
                [
                    'created_at' => now(),
                    'currency' => $currency,
                    'trade' => $trades[$i],
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
            ZoneEditor::where('currency', $currency)->delete();

            // Insert data into DB
            ZoneEditor::insert($query);
        }
        catch(\Illuminate\Database\QueryException $ex)
        {
            return 'Fail to insert the data into DB';
        }
        return 'OK';
    }
}
