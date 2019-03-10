@extends('backend.layouts.app')

@section('title', app_name() . ' | ' . __('strings.backend.chartrefreshinterval.title'))

@section('content')
    <div id="whole">
        <div id="panel-container">
            <div id="form-container">&nbsp;</div>
            <hr /><br />
            <div id="refreshInfo">
                <span style="font-family: arial, helvetica, sans-serif; font-size: 14pt;">- Select refresh time of the chart -</span>
                <br/><br/>
                <div id="form-container">
                    <select name="interval" id="intervalOptions">
                        <option disabled selected value> -- Interval -- </option>
                        <option value="S5">5 second</option>
                        <option value="S10">10 second</option>
                        <option value="S15">15 second</option>
                        <option value="S30">30 second</option>
                        <option value="M1">1 minute</option>
                        <option value="M2">2 minute</option>
                        <option value="M4">4 minute</option>
                        <option value="M5">5 minute</option>
                        <option value="M10">10 minute</option>
                        <option value="M15">15 minute</option>
                        <option value="M30">30 minute</option>
                        <option value="H1">1 hour</option>
                        <option value="H2">2 hour</option>
                        <option value="H3">3 hour</option>
                        <option value="H4">4 hour</option>
                        <option value="H6">6 hour</option>
                        <option value="H8">8 hour</option>
                        <option value="H12">12 hour</option>
                        <option value="D">1 day</option>
                    </select>
                </div>
                <br/>@csrf <button id="submitInterval">Submit</button>
            </div>
        </div>
    </div>
@endsection
