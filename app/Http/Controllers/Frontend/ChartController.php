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

    public function getAPI(Request $request)
    //public function getAPI()
    {
        #$type = 'USD_CAD';
        $token = env('OANDA_API_KEY');
        $client = new Client(['base_uri' => 'https://api-fxpractice.oanda.com/']);
        #$type = 'USD_TWD';
        $type = $request->get('pair');
        $headers = [
            'Authorization' => 'Bearer '. $token,
            'accountid' => env('OANDA_ACCOUNT_ID'),
        ];
        $response = $client->request('GET', 'v3/instruments/'.$type.'/candles', [
            'headers' => $headers
        ]);
        $result = $response->getBody();
        //echo $result;
        $result = json_decode($result);
        $output = $this->getCandles($result);
        echo json_encode($output);
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
                    //$currencyType,
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

    // Response frontend request
    public function getTable()
    {

    }
}

