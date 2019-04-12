@extends('backend.layouts.app')

@section('title', app_name() . ' | ' . __('strings.backend.dashboard.title'))

@section('content')
    <script type="text/javascript" src="js/backendRefresh.js"></script>
    <div id="whole">

        <div id="panel-container">
            <div id="form-container">
                <h4>HOME CURRENCY</h4>
                <select class="pairList homeCurrency" id="homeCurrency">
                    <option disabled selected value="">--select--</option>
                    <option value="GBP">GBP</option>
                    <option value="USD">USD</option>
                    <option value="CAD">CAD</option>
                </select> <br/>

                <h4>FOREIGN CURRENCY</h4>
                <select class="pairList foreignCurrency" id="foreignCurrency">
                    <option disabled selected value="">--select--</option>
                    <option value="GBP">GBP</option>
                    <option value="USD">USD</option>
                    <option value="CAD">CAD</option>
                </select> <br/>

            </div> <hr> <br/>

            <div id="zoneInfo">
                <h4> - Zones - </h4> <br/>
                <table id="zoneTable">
                    <thead>
                        <td>#</td>
                        <td>Start date</td>
                        <td>Trade type</td>
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
