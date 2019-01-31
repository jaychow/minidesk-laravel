@extends('frontend.layouts.app')

@section('content')
<div id="chart-container">
    <form id="chartInput" action="http://minidesk.laravel.coretekllc.com/chart/getTable" type="get">
        <input type="text" name="pair" />
        <button id="chartSubmit">Submit</button>
    </form>
    <div id="chart-rangeselectorContainer"></div>
    <div id="chart-rangepickerContainer"></div>
    <div id="chart"></div>
</div>

@endsection
