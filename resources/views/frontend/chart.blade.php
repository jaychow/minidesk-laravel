@extends('frontend.layouts.app')

@section('content')

    <div class="chart-container" id="chart-container">
        <div class="top-area">
            <chart-header></chart-header>
        </div>
        <chart></chart>
        <div class="bottom-area">
            <chart-footer></chart-footer>
        </div>
    </div>

    <div id="user-panel">
        <div class="chartInput" id="chartInput">
            <sidebar
                v-bind:today="today"
            ></sidebar>
        </div>
    </div>
@endsection
