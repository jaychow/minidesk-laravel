<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use GuzzleHttp\Client;
use App\Models\Chart;
use Illuminate\Http\Request;

/**
 * Class ChartController
 * @package App\Http\Controllers\Frontend
 */
class ChartController extends Controller
{
    /**
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function index()
    {
        return view('frontend.chart');
    }

    public function getAPI()//Request $reqiest
    {
        $type = 'USD_CAD';
        $token = env('OANDA_API_KEY');
        $client = new Client(['base_uri' => 'https://api-fxpractice.oanda.com/']);
        //$type = $reqiest->get('pair');
        $headers = [
            'Authorization' => 'Bearer '. $token,
            'accountid' => env('OANDA_ACCOUNT_ID'),
        ];
        $response = $client->request('GET', 'v3/instruments/'.$type.'/candles?granularity=M10', [
            'headers' => $headers
        ]);

        $result = $response->getBody();
        echo $result;
        $result = json_decode($result);


        $output = $this->getCandles($result);

        $this->storeAPI($output);
        //Chart::addAPIdata($output);
    }

    // Preproccing API data
    public function getCandles($result)
    {
        $output = [];
        $currencyType = $result -> instrument ;
        foreach($result->candles as $candle)
        {
            // Filter some uselesss text from time
            $Filter_text = array("T",".000000000Z");
            $mid = $candle->mid;

            $output[] =
                [
                    $currencyType,
                    $time = str_replace($Filter_text,' ',$candle->time),
                    $mid->o,
                    $mid->h,
                    $mid->l,
                    $mid->c,
                    $candle->volume
                ];
        }
        return $output;
    }

    // Store API data into the DB
    public function storeAPI($data)
    {
        $query = [];

        foreach ($data as $value)
        {
            $type = explode('_', $value[0]);
            $from = $type[0];
            $to = $type[1];

            $fromType = $from.'_'.$to;
            $toType = $to.'_'.$from;
            $time = $value[1];
            $volume = $value[6];

            $fromOpen = $value[2];
            $fromHigh = $value[3];
            $fromLow = $value[4];
            $fromClose = $value[5];

            $toOpen = 1/$fromOpen;
            $toHigh = 1/$fromHigh;
            $toLow = 1/$fromLow;
            $toClose = 1/$fromClose;

            $query[] =
                [
                    'Type' => $fromType,
                    'Time' => $time,
                    'Open' => $fromOpen,
                    'High' => $fromHigh,
                    'Low' => $fromLow,
                    'Close' => $fromClose,
                    'Volume' => $volume
                ];
            $query[] =
                [
                    'Type' => $toType,
                    'Time' => $time,
                    'Open' => $toOpen,
                    'High' => $toHigh,
                    'Low' => $toLow,
                    'Close' => $toClose,
                    'Volume' => $volume
                ];
        }
        Chart::insert($query);
    }

    // Response frontend request
    public function getTable()
    {

    }
}

