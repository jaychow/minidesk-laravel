<?php

namespace App\Http\Controllers\Frontend;
use App\Models\Chart;
use App\Http\Controllers\Controller;
use GuzzleHttp\Client;
use GuzzleHttp\Psr7;
use GuzzleHttp\Exception\RequestException;
use Illuminate\Http\Request;

date_default_timezone_set('America/Los_Angeles');

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

    public function getAPI($type)//Request $request
    {
        $token = env('OANDA_API_KEY');
        $client = new Client(['base_uri' => 'https://api-fxpractice.oanda.com/']);
        //$type = $request->get('currency');
        $headers = [
            'Authorization' => 'Bearer '. $token,
            'accountid' => env('OANDA_ACCOUNT_ID'),
        ];
        try
        {
            $response = $client->request('GET', 'v3/instruments/'.$type.'/candles?granularity=H1&count=1000', [
                'headers' => $headers
            ]);
        }
        catch (RequestException $e)
        {
//            echo Psr7\str($e->getRequest());
//            echo Psr7\str($e->getResponse());
            echo "Can not get this API data !";
            exit;
        }

        $result = $response->getBody();;

        $result = json_decode($result);

        $output = $this->getCandles($result);

        echo json_encode($output);

        $this->storeAPI($output);
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
                    $time = str_replace($Filter_text,' ',$candle->time),
                    $currencyType,
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
            $query[] =
                [
                    'time' => $value[0],
                    'type' => $value[1],
                    'open' => $value[2],
                    'high' => $value[3],
                    'low' => $value[4],
                    'close' => $value[5],
                    'volume' => $value[6]
                ];
        }
        //$finalQuery = $this->fliterData($query);
        Chart::insert($query);
    }

    // Filter duplicated data
//    public function filterData($query)
//    {
//        $result = Chart::where('type',$query[0][0])->orderBy('time','desc')->get();
//
//        foreach ($result as $data)
//        {
//            if()
//            {
//
//            }
//            else
//            {
//
//            }
//        }
//    }

    // Response frontend request
    public function getTable(Request $request)  //Request $request
    {
        //$type = 'USD_CAD';
        $type = $request->get('pair');

        // Time interval
        $time2 = date("Y-m-d h:i:s");
        $time1 = date("Y-m-d h:i:s",strtotime('-1 hour'));

        // Check API data is exist or not ?
        $exist = Chart::where('type',$type)->whereBetween('time',array($time1,$time2))->exists();

        if($exist)
        {
            $output = [];
            $result = Chart::where('type',$type)->orderBy('time','desc')->get();
            foreach ($result as $data)
            {
                $output[]=
                    [
                        $data->time,
                        $data->type,
                        $data->open,
                        $data->high,
                        $data->low,
                        $data->close,
                        $data->volume,
                    ];
            }
            echo json_encode($output);
        }
        else
        {
            $this->getAPI($type);
        }
    }
}

