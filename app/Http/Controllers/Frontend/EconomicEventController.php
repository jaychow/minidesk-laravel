<?php

namespace App\Http\Controllers\Frontend;

use App\Models\EconomicEvent;
use App\Http\Controllers\Controller;

class EconomicEventController extends Controller
{
    public function index()
    {
        return view('frontend.chart');
    }

}