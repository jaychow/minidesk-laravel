@extends('frontend.layouts.app')

@section('content')

    <div class="chart-container" id="chart-container">
        <div class="top-area">
            <chart-header></chart-header>
        </div>
        <chart
            v-bind:ticket-inputs="ticketInputs"
        ></chart>
        <div class="bottom-area">
            <chart-footer></chart-footer>
        </div>
    </div>

    <div id="user-panel">
        <div class="chartInput" id="chartInput">
            <sidebar
                v-bind:today="today"
                v-bind:home-currency="homeCurrency"
                v-bind:foreign-currency="foreignCurrency"
                v-on:change-home-currency="changeHomeCurrency"
                v-on:change-foreign-currency="changeForeignCurrency"
            ></sidebar>
        </div>
    </div>
@endsection
