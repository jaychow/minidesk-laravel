<?php

namespace App\Http\Controllers\Frontend;

use App\Models\ChartWeek;
use App\Models\ChartMonth;
use App\Models\ChartSixMonths;
use App\Models\ChartYear;
use App\Models\ChartFiveYears;
use App\Http\Controllers\Controller;
use GuzzleHttp\Client;
use function GuzzleHttp\json_encode;
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
    public function index()
    {
        return view('frontend.chart');
    }

    // Check API data is exist or not ?
    protected function dataCheck($type,$timeRange,$fromTime)
    {
        $from = '';
        $to = '';
        $toTime = date("Y-m-d H").':00:00';

        switch ($timeRange)
        {
            case "1W":
                $from = ChartWeek::where('type', $type)->whereBetween('time', array($fromTime, $toTime))->min('time');
                $to = ChartWeek::where('type', $type)->whereBetween('time', array($fromTime, $toTime))->max('time');
                break;
            case "1M":
                $from = ChartMonth::where('type', $type)->whereBetween('time', array($fromTime, $toTime))->min('time');
                $to = ChartMonth::where('type', $type)->whereBetween('time', array($fromTime, $toTime))->max('time');
                break;
            case "3M":
                $from = ChartSixMonths::where('type', $type)->whereBetween('time', array($fromTime, $toTime))->min('time');
                $to = ChartSixMonths::where('type', $type)->whereBetween('time', array($fromTime, $toTime))->max('time');
                break;
            case "6M":
                $from = ChartSixMonths::where('type', $type)->whereBetween('time', array($fromTime, $toTime))->min('time');
                $to = ChartSixMonths::where('type', $type)->whereBetween('time', array($fromTime, $toTime))->max('time');
                break;
            case "1Y":
                $from = ChartYear::where('type', $type)->whereBetween('time', array($fromTime, $toTime))->min('time');
                $to = ChartYear::where('type', $type)->whereBetween('time', array($fromTime, $toTime))->max('time');
                break;
            case "5Y":
                $from = ChartFiveYears::where('type', $type)->whereBetween('time', array($fromTime, $toTime))->min('time');
                $to = ChartFiveYears::where('type', $type)->whereBetween('time', array($fromTime, $toTime))->max('time');
                break;
        }

        // No data in DB
        if(($from == NULL) ||($to == NULL))
        {
            return false;
        }

        if(($timeRange == '1W')||($timeRange == '1M'))
        {
            if($timeRange == '1M')
            {
                $toTime = date("Y-m-d H", strtotime('-4 hour')).':00:00';
                // Decide whether the data is in DB or not?
                if((strtotime($from) <= strtotime($fromTime)) && (strtotime($to) >= strtotime($toTime)))
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            else
            {
                // Decide whether the data is in DB or not?
                if((strtotime($from) <= strtotime($fromTime)) && (strtotime($to) >= strtotime($toTime)))
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
        }
        else
        {
            $fromTime = date("Y-m-d",strtotime($fromTime));
            $from = date("Y-m-d",strtotime($from));
            $toTime = date("Y-m-d");
            $to = date("Y-m-d",strtotime($to));

            // Decide whether the data is in DB or not?
            if((strtotime($from) <= strtotime($fromTime)) && (strtotime($to) >= strtotime($toTime)))
            {
                return true;
            }
            else
            {
                return false;
            }
        }
    }

    // Get API data from Oanda
    protected function getAPI($type, $utc, $fromTime,$timeRange,$chart_model)
    {
        // Use to identify is the currenvy need to change ?
        $reverseFlag = 0;

        $token = env('OANDA_API_KEY');
        $client = new Client(['base_uri' => 'https://api-fxpractice.oanda.com/']);
        $headers = [
            'Authorization' => 'Bearer ' . $token,
            'accountid' => env('OANDA_ACCOUNT_ID'),
        ];
        $response ='';
        $fromTime = date("Y-m-d",strtotime($fromTime));
        do
        {
            try
            {
                switch ($timeRange)
                {
                    case "1W":
                        $response = $client->request('GET', 'v3/instruments/' . $type . '/candles?from=' . $fromTime . '&granularity=H1', [
                            'headers' => $headers
                        ]);
                        break;
                    case "1M":
                        $response = $client->request('GET', 'v3/instruments/' . $type . '/candles?from=' . $fromTime . '&granularity=H4', [
                            'headers' => $headers
                        ]);
                        break;
                    case "3M":
                        $response = $client->request('GET', 'v3/instruments/' . $type . '/candles?from=' . $fromTime . '&granularity=D', [
                            'headers' => $headers
                        ]);
                        break;
                    case "6M":
                        $response = $client->request('GET', 'v3/instruments/' . $type . '/candles?from=' . $fromTime . '&granularity=D', [
                            'headers' => $headers
                        ]);
                        break;
                    case "1Y":
                        $response = $client->request('GET', 'v3/instruments/' . $type . '/candles?from=' . $fromTime . '&granularity=W', [
                            'headers' => $headers
                        ]);
                        break;
                    case "5Y":
                        $response = $client->request('GET', 'v3/instruments/' . $type . '/candles?from=' . $fromTime . '&granularity=M', [
                            'headers' => $headers
                        ]);
                        break;
                }

                $result = $response->getBody();
                $result = json_decode($result);
                $output = $this->getCandles($result);

                // Give frontend data with time calibration
                $final = [];

                // Calculate average volume
                $average = $this->averageVolume($output,'API');

                if($reverseFlag >= 1)
                {
                    foreach ($output as $data)
                    {
                        $final[] =
                            [
                                $time = date("Y-m-d H:i:s", strtotime($data[0] .' ' .$utc.' hour')),
                                $type,
                                number_format(1/$data[2],5),
                                number_format(1/$data[3],5),
                                number_format(1/$data[4],5),
                                number_format(1/$data[5],5),
                                $data[6],
                                $average,
                                $percentage = $this->priceChange(1/$data[2],1/$data[5]),
                                $range = $this->priceRange(1/$data[3],1/$data[4])
                            ];
                    }
                }
                else
                {
                    foreach ($output as $data)
                    {
                        $final[] =
                            [
                                $time = date("Y-m-d H:i:s", strtotime($data[0] .' ' .$utc.' hour')),
                                $data[1],
                                $data[2],
                                $data[3],
                                $data[4],
                                $data[5],
                                $data[6],
                                $average,
                                $percentage = $this->priceRange($data[2],$data[5]),
                                $range = $this->priceRange($data[3],$data[4])
                            ];
                    }
                }
                $this->storeAPI($final,$chart_model);
                return response()->json($final);
                //echo json_encode($final);
            }

            catch (RequestException $e)
            {
                // Change type
                if($reverseFlag == 0)
                {
                    $temp = explode('_', $type);
                    $from = $temp[0];
                    $to = $temp[1];
                    $type = $to . '_' . $from;
                    $reverseFlag = $reverseFlag + 1;
                    continue;
                }
                else
                {
                    echo "Can not get this API data" . "<br>";
                    echo $fromTime . "<br>";
                    echo $timeRange . "<br>";
                    echo $type . "<br>";
                    exit;
                }
            }
        }while ($reverseFlag >=1);
    }

    // Preproccing API data
    protected function getCandles($result)
    {
        $output = [];
        $currencyType = $result->instrument;
        foreach ($result->candles as $candle)
        {
            // Filter some uselesss text from time
            $Filter_text = array("T", ".000000000Z");
            $mid = $candle->mid;
            $output[] =
                [
                    $time = str_replace($Filter_text, ' ', $candle->time),
                    $currencyType,
                    number_format($mid->o,5),
                    number_format($mid->h,5),
                    number_format($mid->l,5),
                    number_format($mid->c,5),
                    $candle->volume
                ];
        }
        return array_reverse($output);
    }

    // Store API data into the DB
    protected function storeAPI($data,$chart_model)
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
            $fromType = $from . '_' . $to;
            $toType = $to . '_' . $from;
            $time = $value[0];
            $volume = $value[6];
            $priceChange = $value[8];
            $priceRange = $value[9];
            $fromOpen = $value[2];
            $fromHigh = $value[3];
            $fromLow = $value[4];
            $fromClose = $value[5];
            $toOpen = 1 / $fromOpen;
            $toHigh = 1 / $fromLow;
            $toLow = 1 / $fromHigh;
            $toClose = 1 / $fromClose;
            $query[] =
                [
                    'time' => $time,
                    'type' => $fromType,
                    'open' => $fromOpen,
                    'high' => $fromHigh,
                    'low' => $fromLow,
                    'close' => $fromClose,
                    'volume' => $volume,
                    'price_change' => $priceChange,
                    'price_range' => $priceRange
                ];
            $query[] =
                [
                    'time' => $time,
                    'type' => $toType,
                    'open' => $toOpen,
                    'high' => $toHigh,
                    'low' => $toLow,
                    'close' => $toClose,
                    'volume' => $volume,
                    'price_change' => $this->priceChange($toOpen,$toClose),
                    'price_range' => $this->priceRange($toHigh,$toLow)
                ];
        }

        // Filter duplicated data in DB
        $chart_model::where('type', $fromType)->orwhere('type', $toType)->whereBetween('time', array($fromTime, $toTime))->delete();

        // Insert data into DB
        $chart_model::insert($query);
    }

    // Calculate average volume
    protected function averageVolume($output,$source)
    {
        $counter = 0;
        $sum = 0;

        if($source == 'DB')
        {
            foreach ($output as $data)
            {
                $counter = $counter + 1;
                $sum = $sum + $data->volume;
            }
        }
        else
        {
            foreach ($output as $data)
            {
                $counter = $counter + 1;
                $sum = $sum + $data[6];
            }
        }

        return intval($sum/$counter);
    }

    // Calculate the price percentage change of each candlestick
    protected function priceChange($open,$close)
    {
        $result = (($close - $open)/$open)*100;
        return number_format($result,3);
    }

    // Calculate the price range of each candlestick
    protected function priceRange($high,$low)
    {
        return number_format($high - $low,5);
    }

    // Response frontend request
    public function getTable(Request $request)  //Request $request
    {
        // Common parameter (Default)
        $type = ($request->get('pair') == '') ? 'USD_CAD':$request->get('pair');
        $utc = ($request->get('utc') =='') ? -8:$request->get('utc');
        $timeRange = ($request->get('timeRange') == '') ? '1Y':$request->get('timeRange');
        $fromTime = '';
        $chart_model = new ChartYear;
        
        if (!(($timeRange == '5Y') || ($timeRange == '1Y') || ($timeRange == '6M') || ($timeRange == '1M') || ($timeRange == '3M') || ($timeRange == '1W')))
        {
            $timeRange = "1Y";
        }
        // Select time scale , each time scale start from open market time
        switch ($timeRange)
        {
            case "1W":
                $fromTime = date("Y-m-d", strtotime('-1 week')).' 05:00:00';
                $chart_model = new ChartWeek;
                break;
            case "1M":
                $fromTime = date("Y-m-d", strtotime('-1 month')).' 02:00:00';
                $chart_model = new ChartMonth;
                break;
            case "3M":
                $fromTime = date("Y-m-d", strtotime('-3 month')).' 21:00:00';
                $chart_model = new ChartSixMonths;
                break;
            case "6M":
                $fromTime = date("Y-m-d", strtotime('-6 month')).' 21:00:00';
                $chart_model = new ChartSixMonths;
                break;
            case "1Y":
                $fromTime = date("Y-m-d", strtotime('-1 year')).' 21:00:00';
                $chart_model = new ChartYear;
                break;
            case "5Y":
                $fromTime = date("Y-m-d", strtotime('-5 year')).' 21:00:00';
                $chart_model = new ChartFiveYears;
                break;
        }

        // Check API data is exist or not ?
        $exist = $this->dataCheck($type,$timeRange,$fromTime);

        if ($exist)     // Get data from Database
        {
            $result = $chart_model::where('type', $type)->whereBetween('time', array($fromTime,date("Y-m-d H:i:s")))->orderBy('time', 'desc')->get();
            $output = [];

            // Calculate average volume
            $average = $this->averageVolume($result,'DB');

            foreach ($result as $data)
            {
                $output[] =
                    [
                        $time = date("Y-m-d H:i:s", strtotime($data->time .' ' .$utc.' hour')),
                        $data->type,
                        $data->open,
                        $data->high,
                        $data->low,
                        $data->close,
                        $data->volume,
                        $average,
                        $percentage = $this->priceChange($data->open,$data->close),
                        $range = $this->priceRange($data->high,$data->low)
                    ];
            }

                return response()->json($output);
            }
        else    // Call Oanda API
        {
            return $this->getAPI($type, $utc, $fromTime,$timeRange,$chart_model);
        }
    }
}
