@extends('backend.layouts.app')

@section('title', app_name() . ' | ' . __('strings.backend.dashboard.title'))

@section('content')
    <div id="chart-container">
        <div id="chart"></div>
    </div>

    <form id="zoneForm" action="http://minidesk.laravel.coretekllc.com/chartzone/getTable" type="get">
        <select name="pair" id="pairOptions">
            <option disabled selected value> -- pairs -- </option>
            <option value="GBP_USD">GBP_USD</option>
            <option value="USD_GBP">USD_GBP</option>
            <option value="USD_CAD">USD_CAD</option>
            <option value="CAD_USD">CAD_USD</option>
            <option value="EUR_USD">EUR_USD</option>
            <option value="USD_EUR">USD_EUR</option>
        </select> <br/>

        <input name="fromDate" type="date" max="<?php echo date("Y-m-d"); ?>"> <br/>

        <button value="refreshButton">refresh</button> <br/> <hr>

    </form>


@endsection
