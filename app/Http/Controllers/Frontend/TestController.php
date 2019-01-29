<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use GuzzleHttp\Client;
use App\Models\Chart;
/**
 * Class ChartController
 * @package App\Http\Controllers\Frontend
 */
class TestController extends Controller
{
    /**
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function index()
    {
        $token = env('OANDA_API_KEY');
        $client = new Client(['base_uri' => 'https://api-fxpractice.oanda.com/']);
        $type = 'USD_TWD';
        $headers = [
            'Authorization' => 'Bearer '. $token,
            'accountid' => env('OANDA_ACCOUNT_ID'),
        ];
        $response = $client->request('GET', 'v3/instruments/'.$type.'/candles', [
            'headers' => $headers
        ]);

        $result = $response->getBody();
        echo $result;
        $result = json_decode($result);


        $output = $this->getCandles($result);

        $APIData = [];

        foreach($output as $data)
        {
            $APIData[] =
                [
                    $data[0],
                    $data[1],
                    $data[2],
                    $data[3],
                    $data[4],
                    $data[5],
                    $data[6]
                ];
        }
        Chart::addAPIdata($APIData);
    }

    public function getapi()
    {
        $token = env('OANDA_API_KEY');
        $client = new Client(['base_uri' => 'https://api-fxpractice.oanda.com/']);
        $headers = [
            'Authorization' => 'Bearer '. $token,
            'accountid' => env('OANDA_ACCOUNT_ID'),
        ];
        $response = $client->request('GET', 'v3/instruments/USD_CAD/candles', [
            'headers' => $headers
        ]);

        $result = $response->getBody();
        echo $result;
        $result = json_decode($result);


        $output = $this->getCandles($result);

        $data = [];
        foreach($output as $APIData)
        {
            $data[] =
            [
                $APIData[0],
                $APIData[1],
                $APIData[2],
                $APIData[3],
                $APIData[4]
            ];
        }
        return $data;
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
}
