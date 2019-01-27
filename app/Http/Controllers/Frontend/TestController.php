<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use GuzzleHttp\Client;
use Session;
use Illuminate\Http\Request;
use App\Chart;
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


        $output = $this->getCandles($result); // b

//        // Count the number of data from FX Street API
//        $amount =  count($result->{'candles'});
//
//        for($i = 0;$i < $amount;$i++)
//        {
//            $time = $result->{'candles'}[$i]->{'time'};
//            $Filter_text = array("T",".000000000Z");
//            $time = str_replace($Filter_text,' ',$time);
//            $open = $result->{'candles'}[$i]->{'mid'}->{'o'};
//            $high = $result->{'candles'}[$i]->{'mid'}->{'h'};
//            $low = $result->{'candles'}[$i]->{'mid'}->{'l'};
//            $close = $result->{'candles'}[$i]->{'mid'}->{'c'};
//
//            echo "Time: ".$time."<br>";
//            echo "Open price: ".$open."<br>";
//            echo "Highest price: ".$high."<br>";
//            echo "Lowest price: ".$low."<br>";
//            echo "Close price: ".$close."<br>";
//            echo "<br>";
//        }
        foreach($output as $FirstValue)
        {
            Chart::API_data($FirstValue[0],$FirstValue[1],$FirstValue[2],$FirstValue[3],$FirstValue[4]);
        }
    }

    public function getCandles($result)
    {
        $output = [];

        foreach($result->candles as $candle)
        {
            $Filter_text = array("T",".000000000Z");
            $mid = $candle->mid;

            $output[] =
            [
                $candle = str_replace($Filter_text,' ',$candle->time),
                $mid->o,
                $mid->h,
                $mid->l,
                $mid->c
            ];
        }
        return $output;
    }
}
