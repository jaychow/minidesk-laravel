<?php

namespace App\Http\Controllers\Frontend;

use App\Models\Chart_week;
use App\Models\Chart_month;
use App\Models\Chart_six_months;
use App\Models\Chart_year;
use App\Models\Chart_five_years;
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
    /**
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function index()
    {
        return view('frontend.chart');
    }

    // Check API data is exist or not ?
    protected function dataCheck($type,$timeRange,$fromTime)
    {
        $from = '';
        $to = '';
        $fromTime = $fromTime.' 05:00:00';
        $toTime = '';

        switch ($timeRange)
        {
            case "1W":
                $toTime = date("Y-m-d",strtotime("+1 week",strtotime($fromTime))).' 22:00:00';
                $from = Chart_week::where('type', $type)->whereBetween('time', array($fromTime, $toTime))->min('time');
                $to = Chart_week::where('type', $type)->whereBetween('time', array($fromTime, $toTime))->max('time');
                if((strtotime($from) <= strtotime($fromTime)) && (strtotime($to) >= strtotime($toTime)))
                break;
            case "1M":
                $toTime = date("Y-m-d",strtotime("+1 month",strtotime($fromTime))).' 22:00:00';
                $from = Chart_month::where('type', $type)->whereBetween('time', array($fromTime, $toTime))->min('time');
                $to = Chart_month::where('type', $type)->whereBetween('time', array($fromTime, $toTime))->max('time');
                break;
            case "6M":
                $toTime = date("Y-m-d",strtotime("+6 month",strtotime($fromTime))).' 22:00:00';
                $from = Chart_six_months::where('type', $type)->whereBetween('time', array($fromTime, $toTime))->min('time');
                $to = Chart_six_months::where('type', $type)->whereBetween('time', array($fromTime, $toTime))->max('time');
                break;
            case "1Y":
                $toTime = date("Y-m-d",strtotime("+1 year",strtotime($fromTime))).' 22:00:00';
                $from = Chart_year::where('type', $type)->whereBetween('time', array($fromTime, $toTime))->min('time');
                $to = Chart_year::where('type', $type)->whereBetween('time', array($fromTime, $toTime))->max('time');
                break;
            case "5Y":
                $toTime = date("Y-m-d",strtotime("+5 year",strtotime($fromTime))).' 22:00:00';
                $from = Chart_five_years::where('type', $type)->whereBetween('time', array($fromTime, $toTime))->min('time');
                $to = Chart_five_years::where('type', $type)->whereBetween('time', array($fromTime, $toTime))->max('time');
                break;
        }

        if((strtotime($from) <= strtotime($fromTime)) && (strtotime($to) >= strtotime($toTime)))
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    // Get API data from Oanda
    protected function getAPI($type, $utc, $fromTime,$timeRange,$chart_model)
    {
        $token = env('OANDA_API_KEY');
        $client = new Client(['base_uri' => 'https://api-fxpractice.oanda.com/']);
        $headers = [
            'Authorization' => 'Bearer ' . $token,
            'accountid' => env('OANDA_ACCOUNT_ID'),
        ];
        $response ='';

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
            $this->storeAPI($output,$chart_model);

            // Give frontend data with time calibration
            $final = [];

            foreach ($output as $data)
            {
                $final[] =
                    [
                        $time = date("Y-m-d H:i:s", strtotime($data[0] . '' . $utc . ' hour')),
                        $data[1],
                        $data[2],
                        $data[3],
                        $data[4],
                        $data[5],
                        $data[6],
                    ];
            }
            return response()->json($final);
        }

        catch (RequestException $e)
        {
//            echo Psr7\str($e->getRequest());
//            echo Psr7\str($e->getResponse());
            echo "Can not get this API data" . "<br>";
            echo $fromTime . "<br>";
            echo $timeRange . "<br>";
            echo $type . "<br>";
            exit;
        }
    }

    // Preproccing API data
    protected function getCandles($result)
    {
        $output = [];
        $currencyType = $result->instrument;
        foreach ($result->candles as $candle) {
            // Filter some uselesss text from time
            $Filter_text = array("T", ".000000000Z");
            $mid = $candle->mid;
            $output[] =
                [
                    $time = str_replace($Filter_text, ' ', $candle->time),
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
            $fromOpen = $value[2];
            $fromHigh = $value[3];
            $fromLow = $value[4];
            $fromClose = $value[5];
            $toOpen = 1 / $fromOpen;
            $toHigh = 1 / $fromHigh;
            $toLow = 1 / $fromLow;
            $toClose = 1 / $fromClose;
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

        // Filter duplicated data in DB
        $chart_model::where('type', $fromType)->orwhere('type', $toType)->whereBetween('time', array($fromTime, $toTime))->delete();

        // Insert data into DB
        $chart_model::insert($query);
    }

    // Response frontend request
    public function getTable(Request $request)  //Request $request
    {
        // Common parameter (Default)
        $type = ($request->get('pair') == '') ? 'USD_CAD':$request->get('pair');
        $utc = ($request->get('utc') =='') ? -8:$request->get('utc');
        $timeRange = ($request->get('timeRange') == '') ? '1Y':$request->get('timeRange');
        $fromTime = ($request->get('from') == '') ? date("Y-m-d", strtotime('-1 year')):$request->get('from');
        $chart_model = new Chart_year;
        
        if (!(($timeRange == '5Y') || ($timeRange == '1Y') || ($timeRange == '6M') || ($timeRange == '1M') || ($timeRange == '1W')))
        {
            $timeRange = "1Y";
        }
        // Temporary use
        switch ($timeRange)
        {
            case "1W":
                $fromTime = date("Y-m-d", strtotime('-1 week'));
                $chart_model = new Chart_week;
                break;
            case "1M":
                $fromTime = date("Y-m-d", strtotime('-1 month'));
                $chart_model = new Chart_month;
                break;
            case "6M":
                $fromTime = date("Y-m-d", strtotime('-6 month'));
                $chart_model = new Chart_six_months;
                break;
            case "1Y":
                $fromTime = date("Y-m-d", strtotime('-1 year'));
                $chart_model = new Chart_year;
                break;
            case "5Y":
                $fromTime = date("Y-m-d", strtotime('-5 year'));
                $chart_model = new Chart_five_years;
                break;
        }

        // Check API data is exist or not ?
        $exist = $this->dataCheck($type,$timeRange,$fromTime);

        if ($exist)     // Get data from Database
        {
            $toTime = date("Y-m-d",strtotime("+1 week",strtotime($fromTime))).' 22:00:00';
            $result = $chart_model::where('type', $type)->whereBetween('time', array($fromTime.' 05:00:00', $toTime))->orderBy('time', 'desc')->get();
            $output = [];

            foreach ($result as $data)
            {
                $output[] =
                    [
                        $time = date("Y-m-d H:i:s", strtotime($data->time . '' . $utc . ' hour')),
                        $data->type,
                        $data->open,
                        $data->high,
                        $data->low,
                        $data->close,
                        $data->volume,
                    ];
            }
                return response()->json($output);
            }
        else    // Call Oanda API
        {
            $this->getAPI($type, $utc, $fromTime,$timeRange,$chart_model);
        }
    }
}
