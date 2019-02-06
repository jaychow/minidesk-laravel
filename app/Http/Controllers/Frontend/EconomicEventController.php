<?php
/**
 * Created by PhpStorm.
 * User: rocky
 * Date: 2/5/19
 * Time: 7:53 PM
 */

namespace App\Http\Controllers\Frontend;
use App\Models\EconomicEvent;

class EconomicEventController extends Controller
{
    public function index()
    {
        return view('frontend.chart');
    }

}