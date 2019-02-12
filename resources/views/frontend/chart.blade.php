@extends('frontend.layouts.app')

@section('content')
    <form id="chartInput" action="http://minidesk.laravel.coretekllc.com/chart/getTable" type="get">
        <select name="pairsOption" id="pairsOption">
            <option disabled selected value> -- pairs -- </option>
            <option value="GBP_USD">GBP_USD</option>
            <option value="USD_GBP">USD_GBP</option>
            <option value="USD_CAD">USD_CAD</option>
            <option value="CAD_USD">CAD_USD</option>
            <option value="EUR_USD">EUR_USD</option>
            <option value="USD_EUR">USD_EUR</option>
        </select>

        <div id="chart-rangeselectorContainer"></div>
    </form>
    <div id="chart-container">
        <div id="chart"></div>
    </div>

@endsection
