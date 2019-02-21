@extends('backend.layouts.app')

@section('title', app_name() . ' | ' . __('strings.backend.dashboard.title'))

@section('content')
    <div id="whole">
        <div id="chart-container">
            <div id="chart"></div>
        </div>

        <div id="panel-container">
            <div id="form-container">
                <form id="zoneForm">
                    <select name="pair" id="pairOptions">
                        <option disabled selected value> -- pairs -- </option>
                        <option value="GBP_USD">GBP_USD</option>
                        <option value="USD_GBP">USD_GBP</option>
                        <option value="USD_CAD">USD_CAD</option>
                        <option value="CAD_USD">CAD_USD</option>
                        <option value="EUR_USD">EUR_USD</option>
                        <option value="USD_EUR">USD_EUR</option>
                    </select> <br/>

                    <input name="fromDate" id="fromDate" type="date" max="<?php echo date("Y-m-d"); ?>"> <br/>

                </form>

                <button id="refreshButton" class="panelButton">refresh</button> <br/>
                @csrf
                <button id="submitTest" class="btn">Submit</button>

            </div> <br/> <hr> <br/>

            <div id="zoneInfo">
                <h4> - Zones - </h4> <br/>
                <table id="zoneTable">
                    <tr>
                        <td>#</td>
                        <td>Start date</td>
                        <td>High price</td>
                        <td>Low price</td>
                        <td>Remove</td>
                    </tr>
                </table>
            </div>
        </div>
    </div>




@endsection
