@extends('frontend.layouts.app')

@section('content')
    <form id="chartInput" action="http://minidesk.laravel.coretekllc.com/chart/getTable" type="get">
        <select name="pair" id="pairOptions">
            <option disabled selected value> -- pairs -- </option>
            <option value="GBP_USD">GBP_USD</option>
            <option value="USD_GBP">USD_GBP</option>
            <option value="USD_CAD">USD_CAD</option>
            <option value="CAD_USD">CAD_USD</option>
            <option value="EUR_USD">EUR_USD</option>
            <option value="USD_EUR">USD_EUR</option>
        </select> <br/>
        <div class="chartButtons" id="timescaleButton">
            <button>1W</button>
            <button>1M</button>
            <button>3M</button>
            <button>6M</button>
            <button>1Y</button>
            <button>5Y</button>
        </div> <br/>
        <div class="chartButtons" id="candleLineButton">
            <button value="candle">Candle</button>
            <button value="line">Line</button>
        </div> <br/>
        <div class="chartButtons" id="pricePercentageButton">
            <button value="percent">%</button>
            <button value="price">$</button>
        </div>
        <div id="chart-rangeselectorContainer"></div>
    </form>
    <div id="chart-container">
        <div id="chart"></div>
    </div>

@endsection
