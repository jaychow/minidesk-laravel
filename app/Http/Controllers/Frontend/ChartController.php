<?php
namespace App\Http\Controllers\Frontend;
use App\Models\Chart_day;
use App\Models\Chart_minute;
use App\Http\Controllers\Controller;
use GuzzleHttp\Client;
use GuzzleHttp\Psr7;
use GuzzleHttp\Exception\RequestException;
use Illuminate\Http\Request;
date_default_timezone_set('Europe/London'); // UTC + 0
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

    public function getAPI($type,$utc,$fromTime,$toTime,$timeRange)
    {
        $token = env('OANDA_API_KEY');
        $client = new Client(['base_uri' => 'https://api-fxpractice.oanda.com/']);
        $headers = [
            'Authorization' => 'Bearer '. $token,
            'accountid' => env('OANDA_ACCOUNT_ID'),
        ];
        try
        {
            if(($timeRange == '1W') || ($timeRange == '1D'))
            {
                $response = $client->request('GET', 'v3/instruments/'.$type.'/candles?from='.$fromTime.'&granularity=M10', [
                    'headers' => $headers
                ]);
            }
            else
            {
                $response = $client->request('GET', 'v3/instruments/'.$type.'/candles?from='.$fromTime.'&to='.$toTime.'&granularity=D', [
                    'headers' => $headers
                ]);
            }
            $result = $response->getBody();
            $result = json_decode($result);
            $output = $this->getCandles($result);
            $this->storeAPI($output,$timeRange);

            // Give frontend data with time calibration
            $final = [];
            if(($timeRange == '1W') || ($timeRange == '1D'))
            {
                foreach ($output as $data)
                {
                    $final[]=
                        [
                            $time = date("Y-m-d H:i:s",strtotime($data[0].''.$utc.' hour')),
                            $data[1],
                            $data[2],
                            $data[3],
                            $data[4],
                            $data[5],
                            $data[6],
                        ];
                }
                echo json_encode($final);
            }
            else
            {
                foreach ($output as $data)
                {
                    $final[]=
                        [
                            $time = date("Y-m-d",strtotime($data[0].''.$utc.' hour')),
                            $data[1],
                            $data[2],
                            $data[3],
                            $data[4],
                            $data[5],
                            $data[6],
                        ];
                }
                echo json_encode($final);
            }
        }
        catch (RequestException $e)
        {
//            echo Psr7\str($e->getRequest());
//            echo Psr7\str($e->getResponse());
            echo "Can not get this API data"."<br>";
            echo $fromTime."<br>";
            echo $toTime."<br>";
            echo $timeRange."<br>";
            echo $type."<br>";
//            exit;
        }
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
        return array_reverse($output);
    }

    // Store API data into the DB
    public function storeAPI($data,$timeRange)
    {
        $query = [];
        $fromType = "";
        $toType = "";
        // Get API start time and end time
        $toTime = $data[0][0];
        $temp = array_reverse($data);
        $fromTime = $temp[0][0];
        foreach ($data as $value)
        {
            $type = explode('_', $value[1]);
            $from = $type[0];
            $to = $type[1];
            $fromType = $from.'_'.$to;
            $toType = $to.'_'.$from;
            $time = $value[0];
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
                    'time' => $time,
                    'type' => $fromType,
                    'open' => $fromOpen,
                    'high' => $fromHigh,
                    'low' => $fromLow,
                    'close' => $fromClose,
                    'volume' => $volume
                ];
            $query[] =
                [
                    'time' => $time,
                    'type' => $toType,
                    'open' => $toOpen,
                    'high' => $toHigh,
                    'low' => $toLow,
                    'close' => $toClose,
                    'volume' => $volume
                ];
        }
        $this->fliterData($query,$fromTime,$toTime,$fromType,$toType,$timeRange);
        if(($timeRange == '1W') || ($timeRange == '1D'))
        {
            Chart_minute::insert($query);
        }
        else
        {
            Chart_day::insert($query);
        }
    }

    // Filter duplicated data in DB
    public function fliterData($query,$fromTime,$toTime,$fromType,$toType,$timeRange)
    {
        if(($timeRange == '1W') || ($timeRange == '1D'))
        {
            Chart_minute::where('type',$fromType)->orwhere('type',$toType)->whereBetween('time',array($fromTime,$toTime))->delete();
        }
        else
        {
            Chart_day::where('type',$fromType)->orwhere('type',$toType)->whereBetween('time',array($fromTime,$toTime))->delete();
        }
    }

    // Process data for different time scale candlestick
    public function dataProcess($type,$timeRange)
    {
        $close = Chart_minute::orderBy('time', 'desc')->first();
        $open= Chart_minute::orderBy('time', 'asc')->first();
        $high = Chart_minute::orderBy('high', 'desc')->first();
        $low = Chart_minute::orderBy('low', 'asc')->first();
//        $output = [];
//        foreach ($result as $data)
//        {
//            $output[]=
//                [
//                    $time = date("Y-m-d H:i:s"),
//                    $data->type,
//                    $data->open,
//                    $data->high,
//                    $data->low,
//                    $data->close,
//                    $data->volume,
//                ];
//        }
        echo $close."<br>";
        echo $open."<br>";
        echo $high."<br>";
        echo $low."<br>";
        exit;
    }

    // Response frontend request
    public function getTable(Request $request)  //Request $request
    {
        // Common parameter (Default)
        $type = 'USD_CAD';
        $utc = -8;      // San Diego
        $fromTime = date("Y-m-d",strtotime('-1 year'));
        $toTime = date("Y-m-d",strtotime('-1 day'));
        $timeRange = "1D";
        $time2 = date("Y-m-d H:i:s");
        $time1 = date("Y-m-d H:i:s",strtotime('-1 day'));
        //$this->dataProcess($type,$timeRange);

      $type = $request->get('pair');
      $utc = $request->get('utc');
      $timeRange = $request->get('timeRange');
//      $fromTime = $request->get('from');
//      $toTime = $request->get('to');
        if(!(($timeRange == '5Y') || ($timeRange == '1Y') || ($timeRange == '6M') || ($timeRange == '1M') || ($timeRange == '1W') || ($timeRange == '1D')))
        {
            $timeRange = "1Y";
        }
        switch($timeRange)
        {
            case "1D":
                $fromTime = date("Y-m-d",strtotime('-1 day')).' 00:00:00';
                break;
            case "1W":
                $fromTime = date("Y-m-d",strtotime('-1 week')).' 00:00:00';
                break;
            case "1M":
                $fromTime = date("Y-m-d",strtotime('-1 month'));
                break;
            case "6M":
                $fromTime = date("Y-m-d",strtotime('-6 month'));
                break;
            case "1Y":
                $fromTime = date("Y-m-d",strtotime('-1 year'));
                break;
            case "5Y":
                $fromTime = date("Y-m-d",strtotime('-5 year'));
                break;
        }

        if(($timeRange == '1W') || ($timeRange == '1D'))
        {

            $toTime = date("Y-m-d");

            // Time interval
            $time2 = date("Y-m-d H:i:s");
            $time1 = date("Y-m-d H:i:s",strtotime('-10 minute'));

            // Check API data is exist or not ?
            $exist = Chart_minute::where('type',$type)->whereBetween('time',array($time1,$time2))->exists();
            if($exist)
            {
                $output = [];
                $result = Chart_minute::where('type',$type)->orderBy('time','desc')->get();
                foreach ($result as $data)
                {
                    $output[]=
                        [
                            $time = date("Y-m-d H:i:s",strtotime($data->time.''.$utc.' hour')),
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
                $this->getAPI($type,$utc,$fromTime,$toTime,$timeRange);
            }
        }
        else
        {
            $toTime = date("Y-m-d");

            // Time interval
            $time2 = date("Y-m-d H:i:s");
            $time1 = date("Y-m-d H:i:s");

            // Check API data is exist or not ?
            $exist = Chart_day::where('type',$type)->whereBetween('time',array($time1,$time2))->exists();
            if($exist)
            {
                $output = [];
                $result = Chart_day::where('type',$type)->orderBy('time','desc')->get();
                foreach ($result as $data)
                {
                    $output[]=
                        [
                            $time = date("Y-m-d",strtotime($data->time.''.$utc.' hour')),
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
                $this->getAPI($type,$utc,$fromTime,$toTime,$timeRange);
            }
        }
    }
}
