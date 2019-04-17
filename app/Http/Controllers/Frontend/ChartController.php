<?php

namespace App\Http\Controllers\Frontend;

use App\Models\ChartData;
use App\Models\ZoneEditor;
use App\Models\ChartRefreshInterval;
use App\Models\TradeSettingRecord;
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
        $toTime = date("Y-m-d H").':00:00';
        $from = ChartData::where('type', $type)->where('time_scale',$timeRange)->whereBetween('time', array($fromTime, $toTime))->min('time');
        $to = ChartData::where('type', $type)->where('time_scale',$timeRange)->whereBetween('time', array($fromTime, $toTime))->max('time');

        // No data in DB
        if (!$from || !$to )
        {
            return false;
        }

        if ($timeRange == '1M')
        {
            $toTime = date("Y-m-d H", strtotime('-4 hour')) . ':00:00';
        }

        if($timeRange == '1W')
        {
            $toTime = date("Y-m-d H") . ':00:00';
        }

        if ((strtotime($from) <= strtotime($fromTime)) && (strtotime($to) >= strtotime($toTime)))
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    // Get API data from Oanda
    protected function getFromAPI($type, $utc, $fromTime,$timeRange)
    {
        // Use to identify is the currency need to change ?
        $reverseFlag = 0;
        $sourceCurrency = $type;
        $token = env('OANDA_API_KEY');
        $client = new Client(['base_uri' => 'https://api-fxpractice.oanda.com/']);
        $headers = [
            'Authorization' => 'Bearer ' . $token,
            'accountid' => env('OANDA_ACCOUNT_ID'),
        ];
        $response ='';
        $fromTime = date("Y-m-d",strtotime($fromTime));
        $granularity = $this->_getGranularity($timeRange);

        do
        {
            try
            {
                $response = $client->request('GET', "v3/instruments/{$type}/candles", [
                    'headers' => $headers,
                    'query' => [
                        'from' => $fromTime,
                        'granularity' => $granularity
                    ]
                ]);

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
                                $sourceCurrency,
                                number_format(1/$data[2],5),
                                number_format(1/$data[4],5),
                                number_format(1/$data[3],5),
                                number_format(1/$data[5],5),
                                $data[6],
                                $average,
                                $percentage = $this->priceChange(1/$data[2],1/$data[5]),
                                $range = $this->priceRange(1/$data[4],1/$data[3]),
                                $volumeChange = $this->volumeChange($data[6],$average)
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
                                $percentage = $this->priceChange($data[2],$data[5]),
                                $range = $this->priceRange($data[3],$data[4]),
                                $volumeChange = $this->volumeChange($data[6],$average)
                            ];
                    }
                }
                $this->storeAPI($final,$timeRange);
                return $final;
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
                    echo $e->getMessage();
                    exit;
                }
            }
        }while ($reverseFlag >=1);
    }

    // Get current currency data from Oanda
    protected function getCurrentData($type,$interval,$utc)
    {
        // Use to identify is the currency need to change ?
        $reverseFlag = 0;
        $sourceCurrency = $type;
        $token = env('OANDA_API_KEY');
        $client = new Client(['base_uri' => 'https://api-fxpractice.oanda.com/']);
        $headers = [
            'Authorization' => 'Bearer ' . $token,
            'accountid' => env('OANDA_ACCOUNT_ID'),
        ];

        do
        {
            try
            {
                $response = $client->request('GET', 'v3/instruments/' . $type . '/candles?granularity='.$interval.'&count=1', [
                            'headers' => $headers
                        ]);

                $result = $response->getBody();
                $result = json_decode($result);
                $final_result = $this->getCandles($result);
                if($reverseFlag >= 1)
                {
                    $output =
                        [
                            $time = date("Y-m-d H:i:s", strtotime($final_result[0][0] .' ' .$utc.' hour')),
                            $sourceCurrency,
                            number_format(1/$final_result[0][2],5),
                            number_format(1/$final_result[0][4],5),
                            number_format(1/$final_result[0][3],5),
                            number_format(1/$final_result[0][5],5),
                            $final_result[0][6],
                            'NA',
                            $percentage = $this->priceChange(1/$final_result[0][2],1/$final_result[0][5]),
                            $range = $this->priceRange(1/$final_result[0][4],1/$final_result[0][3]),
                            'NA'
                        ];
                    return $output;
                }
                else
                {
                    $output =
                        [
                            $time = date("Y-m-d H:i:s", strtotime($final_result[0][0] .' ' .$utc.' hour')),
                            $type,
                            number_format($final_result[0][2],5),
                            number_format($final_result[0][3],5),
                            number_format($final_result[0][4],5),
                            number_format($final_result[0][5],5),
                            $final_result[0][6],
                            'NA',
                            $percentage = $this->priceChange($final_result[0][2],$final_result[0][5]),
                            $range = $this->priceRange($final_result[0][3],$final_result[0][4]),
                            'NA'
                        ];
                    return $output;
                }
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
    protected function storeAPI($data,$timeRange)
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
                    'price_range' => $priceRange,
                    'time_scale' => $timeRange
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
                    'price_range' => $this->priceRange($toHigh,$toLow),
                    'time_scale' => $timeRange
                ];
        }

        // Filter duplicated data in DB
        ChartData::where('type', $fromType)->where('time_scale',$timeRange)->orwhere('type', $toType)->whereBetween('time', array($fromTime, $toTime))->delete();

        // Insert data into DB
        ChartData ::insert($query);
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

    // Calculate volume % change
    protected function volumeChange($volume,$averageVolume)
    {
        $result = (($volume - $averageVolume) / $averageVolume)*100;
        return number_format($result,3);
    }

    // Calculate the price % change of each candlestick
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

    // Mapping the zone's data to front end % axis
    protected function zonePercentage($value,$baseValue)
    {
        if($baseValue == '')
        {
            return 'Empty';
        }
        else
        {
            $result = (($value - $baseValue) / $baseValue)*100;
            return number_format($result,2);
        }
    }

    // Response frontend request -> Chart data
    public function getTable(Request $request)
    {
        // Common parameter (Default)
        $type      = ($request->get('pair') == '') ? 'USD_CAD' : $request->get('pair');
        $utc       = ($request->get('utc') == '') ? - 8 : $request->get('utc');
        $timeRange = ($request->get('timeRange') == '') ? '1Y' : $request->get('timeRange');
        $status    = $request->get('status');
        $interval  = ($request->get('interval') == '') ? 'M5' : $request->get('interval');

        $fromTime = '';

        if ($status == 'current')
        {
            return $this->getCurrentData($type, $interval, $utc);
        }

        $fromTime = $this->_getFromTime($timeRange,$utc);
        // Check API data is exist or not ?
        $exist = $this->dataCheck($type, $timeRange, $fromTime);

        if ($exist)
        {
            // Get data from Database
            $data = $this->getFromModel($type, $fromTime, $timeRange,$utc);
        }
        else
        {
            // Call Oanda API
            $data = $this->getFromAPI($type, $utc, $fromTime, $timeRange);
        }

        return response()->json($data);
    }

    public function getFromModel($type, $fromTime, $timeRange,$utc)
    {
        $result = ChartData::where('type', $type)->where('time_scale', $timeRange)->whereBetween(
            'time',
            array(
                $fromTime,
                date(
                    "Y-m-d H:i:s"
                )
            )
        )->orderBy('time', 'desc')->get();
        $output = [];

        // Calculate average volume
        $average = $this->averageVolume($result, 'DB');

        foreach ($result as $data) {
            $output[] =
                [
                    $time = date("Y-m-d H:i:s", strtotime($data->time . ' ' . $utc . ' hour')),
                    $data->type,
                    $data->open,
                    $data->high,
                    $data->low,
                    $data->close,
                    $data->volume,
                    $average,
                    $data->price_change,
                    $data->price_range,
                    $volumeChange = $this->volumeChange($data->volume, $average)
                ];
        }

        return $output;
    }

    protected function _getFromTime($timeRange)
    {
        // Select time scale , each time scale start from open market time
        switch ($timeRange)
        {
            case "1W":
                $fromTime = date("Y-m-d", strtotime('-1 week')) . ' 05:00:00';
                break;
            case "1M":
                $fromTime = date("Y-m-d", strtotime('-1 month')) . ' 02:00:00';
                break;
            case "3M":
                $fromTime = date("Y-m-d", strtotime('-3 month')) . ' 21:00:00';
                break;
            case "6M":
                $fromTime = date("Y-m-d", strtotime('-6 month')) . ' 21:00:00';
                break;
            case "1Y":
                $fromTime = date("Y-m-d", strtotime('-1 year')) . ' 21:00:00';
                break;
            case "5Y":
                $fromTime = date("Y-m-d", strtotime('-5 year')) . ' 21:00:00';
                break;
            default:
                throw new \Exception('Error time range');
        }

        return $fromTime;
    }

    // Response frontend request -> Time interval for updating the chart data
    public function getTimeInterval()  //Request $request
    {
        $result = ChartRefreshInterval::get();

        $output ='';
        foreach ($result as $data)
        {
            $output = $data->interval;
        }
        return $output;
    }

    // Response frontend request -> Zone data
    public function getZone(Request $request)  //Request $request
    {
        // Common parameter (Default)
        $currency = $request->get('pair');
        $trade = $request->get('trade');
        $percentage = $request->get('percentage');
        $latestData = $request->get('value');

        if($trade == 'All')
        {
            $result = ZoneEditor::where('currency', $currency)->orderBy('high', 'desc')->get();
        }
        else
        {
            $result = ZoneEditor::where('currency', $currency)->where('trade',$trade)->orderBy('high', 'desc')->get();
        }

        $output = [];
        // After mapping to percentage (Latest), response the data of zone editor
        if($percentage == 'true')
        {
            foreach ($result as $data)
            {
                $output[] =
                    [
                        $data->currency,
                        $data->trade,
                        $high = $this->zonePercentage($data->high,$latestData),
                        $low = $this->zonePercentage($data->low,$latestData),
                        $data->date
                    ];
            }
        }
        else
        {
            foreach ($result as $data)
            {
                $output[] =
                    [
                        $data->currency,
                        $data->trade,
                        $data->high,
                        $data->low,
                        $data->date
                    ];
            }
        }
        return response()->json($output);
    }

    // Receive data from frontend -> User's trade setting record
    public function saveTradeSetting(Request $request)  //Request $request
    {
        // Common parameter (Default)
        $id = ($request->get('id') == '') ? '0':$request->get('id');
        $account = $request->get('account');
        $home_currency = $request->get('home_currency');
        $foreign_currency= $request->get('foreign_currency');
        $trade = $request->get('trade');
        $amount = $request->get('amount');
        $date = $request->get('date');

        // Check is this trade setting record exist ?
        $result = TradeSettingRecord::where('id', $id)->exists();
        if(!$result)
        {
            $query[] =
                [
                    'account' => $account,
                    'home_currency' => $home_currency,
                    'foreign_currency' => $foreign_currency,
                    'trade' => $trade,
                    'amount' => $amount,
                    'date' => $date
                ];
            try
            {
                // Insert data into DB
                TradeSettingRecord::insert($query);
            }
            catch(\Illuminate\Database\QueryException $ex)
            {
                return 'Fail to insert the data into DB';
            }
            return 'OK';
        }
        else
        {
            $query = array(
                    'home_currency' => $home_currency,
                    'foreign_currency' => $foreign_currency,
                    'trade' => $trade,
                    'amount' => $amount,
                    'date' => $date
            );
            try
            {
                // Update the trade setting record
                TradeSettingRecord::where('id',$id)->update($query);
            }
            catch(\Illuminate\Database\QueryException $ex)
            {
                return 'Fail to insert the data into DB';
            }
            return 'OK';
        }
    }

    // Response frontend request -> User's trade setting record
    public function getTradeSetting(Request $request)  //Request $request
    {
        // Common parameter (Default)
        $account = $request->get('account');

        // Check is this account had trade setting record ?
        $result = TradeSettingRecord::where('account', $account)->exists();
        if(!$result)
        {
            return 'This account does not exist';
        }
        else
        {
            $result = TradeSettingRecord::where('account', $account)->get();
            $output = [];
            foreach ($result as $data)
            {
                $output[] =
                    [
                        $data->id,
                        $data->account,
                        $data->home_currency,
                        $data->trade_currency,
                        $data->trade,
                        $data->amount,
                        $data->date
                    ];
            }
            return response()->json($output);
        }
    }

    private function _getGranularity($timeRange)
    {
        switch ($timeRange)
        {
            case "1W":
                return "H1";
            case "1M":
                return "H4";
            case "3M":
                return "D";
            case "6M":
                return "D";
            case "1Y":
                return "D";
            case "5Y":
                return "M";
        }

        return false;
    }
}
