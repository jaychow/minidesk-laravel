@extends('frontend.layouts.app')

@section('content')
<h1>CHART</h1>
<div id="chart-container">
    <form id="chartInput" action="http://minidesk.laravel.coretekllc.com/test" type="get">
        <input type="text" name="pair" />
        <button id="chartSubmit">Submit</button>
    </form>
    <div id="chart"></div>
</div>
@endsection
