@extends('backend.layouts.app')

@section('title', app_name() . ' | ' . __('strings.backend.dashboard.title'))

@section('content')
    <div id="whole">

        <div id="panel-container">
            <div id="form-container">
                <select name="pair" id="pairOptions">
                    <option disabled selected value> -- pairs -- </option>
                    <option value="GBP_USD">GBP_USD</option>
                    <option value="USD_GBP">USD_GBP</option>
                    <option value="USD_CAD">USD_CAD</option>
                    <option value="CAD_USD">CAD_USD</option>
                    <option value="EUR_USD">EUR_USD</option>
                    <option value="USD_EUR">USD_EUR</option>
                </select>

            </div> <hr> <br/>

            <div id="zoneInfo">
                <h4> - Zones - </h4> <br/>
                <table id="zoneTable">
                    <thead>
                        <td>#</td>
                        <td>Start date</td>
                        <td>High price</td>
                        <td>Low price</td>
                        <td>Clear Column</td>
                    </thead>
                    <tbody id="zoneTableBody">

                    </tbody>
                </table> <br/>

                @csrf
                <button id="submitButton">Submit</button>

            </div>
        </div>
    </div>




@endsection
