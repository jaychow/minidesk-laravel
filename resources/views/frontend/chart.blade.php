@extends('frontend.layouts.app')

@section('content')

    <div class="chart-container" id="chart-container">
        <div class="top-area">
            <div class="currency-title">
                <p id="currencyTitle"></p>
            </div>
            <div class="pricePercentage-area" id="pricePercentageButton" style="visibility:hidden;">
                <button class="chartAreaButton pricePercentageButton" id="userButton" value="user" style="visibility:hidden;">
                    <i class="fa fa-user"></i>
                </button>
                <button class="chartAreaButton pricePercentageButton" id="priceButton" value="price" disabled>$</button>
                <button class="chartAreaButton pricePercentageButton" id="percentButton" value="percent">%</button>
            </div>
                {{--<button class="pricePercentageButton" value="percent">%</button>--}}
                {{--<button class="pricePercentageButton" value="price">$</button>--}}
                {{--<input class="pricePercentageButton" value="user" type="image" id="userIconButton" alt="Your order" style="visibility:hidden;"--}}
                {{--src="https://img.icons8.com/windows/32/000000/user.png">--}}
                {{--<button class="pricePercentageButton" value="user" id="userIconButton" style="visibility:hidden;"><img src="https://img.icons8.com/windows/32/000000/user.png"></button>--}}

        </div>
        <div class="chart" id="chart"></div>
        <div class="bottom-area">
            <div class="timescale-area" id="timescaleButton" style="visibility:hidden;">
                <button class="timescaleButton" id="1WButton" value="1W">1W</button>
                <button class="timescaleButton" id="1MButton" value="1M">1M</button>
                <button class="timescaleButton" id="3MButton" value="3M">3M</button>
                <button class="timescaleButton" id="6MButton" value="6M">6M</button>
                <button class="timescaleButton" id="1YButton" value="1Y" disabled>1Y</button>
                <button class="timescaleButton" id="5YButton" value="5Y">5Y</button>
            </div>
            <div class="candleLine-area" id="candleLineButton" style="visibility:hidden;">
                <button class="chartAreaButton candleLineButton" id="candleButton" value="candle" disabled>Candle</button>
                <button class="chartAreaButton candleLineButton" id="lineButton" value="line">Line</button>
            </div>
        </div>
    </div>

    <div id="user-panel">
        {{--<form id="chartInput" action="http://minidesk.laravel.coretekllc.com/chart/getTable" type="get">--}}
        <div class="chartInput" id="chartInput">
            <div class="buySellButton-area">
                <div class="buySellButton" id="buySellButton">
                    <button value="buy" id="buyButton" class="buyButton">I WILL NEED</br>FOREIGN CURRENCY</button>
                    <button value="sell" id="sellButton" class="sellButton">I WILL NEED</br>HOME CURRENCY</button>
                </div> </br>
            </div>

            <div class="amount-area">
                <br>
                <br>
                <h4> HOME CURRENCY</h4>

                <select class="pairList homeCurrency" id="homeCurrency">
                    <option disabled selected value="">--select--</option>
                    <option value="GBP">GBP</option>
                    <option value="USD">USD</option>
                    <option value="CAD">CAD</option>
                </select>
                <br>
                <br>
                <br>

                <h4> FOREIGN CURRENCY</h4>

                <select class="pairList foreignCurrency" id="foreignCurrency">
                    <option disabled selected value="">--select--</option>
                    <option value="GBP">GBP</option>
                    <option value="USD">USD</option>
                    <option value="CAD">CAD</option>
                </select>
                <br>
                <br>

                <form id="tradingTicketForm">
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <span class="input-group-text">$</span>
                        </div>
                        <input type="number" id="transactionAmount" class="form-control" placeholder="Amount">
                    </div>

                    <br>
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <span class="input-group-text">Date</span>
                        </div>
                        <input type="date" name="tradeDate" id="tradeDate" class="form-control" placeholder="MM/DD/YYYY">
                    </div>
                    <br>

                </form>

                <p id="tradeExplaination"></p>
                <button class="submitButton" id="submitButton">submit</button>
                <br>
                <br>
                <br>

            </div>
        </div>
    </div>
    {{--<div class="card-footer">--}}
        {{--<a href="https://fontawesome.com/v4.7.0/icon/user">User icon by fontawesome</a> <br>--}}
        {{--<a href="https://fonts.googleapis.com/css?family=Varela+Round">User font by Varela Round</a>--}}
        {{--<link href="https://fonts.googleapis.com/css?family=Varela+Round" rel="stylesheet">--}}
    {{--</div>--}}

@endsection
