@extends('frontend.layouts.app')

@section('content')

    <div class="chart-container" id="chart-container">
        <div class="top-area">
            <div class="currency-title">
                <p id="currencyTitle"></p>
            </div>
            <div class="pricePercentage-area" id="pricePercentageButton">
                <button class="chartAreaButton pricePercentageButton" value="percent">%</button>
                <button class="chartAreaButton pricePercentageButton" value="price">$</button>
                <button class="chartAreaButton pricePercentageButton" value="user" id="userIconButton" style="visibility:hidden;"><img src="https://img.icons8.com/windows/32/000000/user.png"></button>
            </div>
                {{--<button class="pricePercentageButton" value="percent">%</button>--}}
                {{--<button class="pricePercentageButton" value="price">$</button>--}}
                {{--<input class="pricePercentageButton" value="user" type="image" id="userIconButton" alt="Your order" style="visibility:hidden;"--}}
                {{--src="https://img.icons8.com/windows/32/000000/user.png">--}}
                {{--<button class="pricePercentageButton" value="user" id="userIconButton" style="visibility:hidden;"><img src="https://img.icons8.com/windows/32/000000/user.png"></button>--}}

        </div>
        <div class="chart" id="chart"></div>
        <div class="bottom-area">
            <div class="timescale-area" id="timescaleButton">
                <button class="timescaleButton choice" value="1W">1W</button>
                <button class="timescaleButton" value="1M">1M</button>
                <button class="timescaleButton" value="3M">3M</button>
                <button class="timescaleButton" value="6M">6M</button>
                <button class="timescaleButton" value="1Y">1Y</button>
                <button class="timescaleButton" value="5Y">5Y</button>
            </div>
            <div class="candleLine-area" id="candleLineButton">
                <button class="chartAreaButton candleLineButton" value="candle">Candle</button>
                <button class="chartAreaButton candleLineButton" value="line">Line</button>
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
                <br/>

                <select class="pairList homeCurrency" id="homeCurrency">
                    <option disabled selected value="">--select--</option>
                    <option value="GBP">GBP</option>
                    <option value="USD">USD</option>
                    <option value="CAD">CAD</option>
                </select>
                 <br/>
                <br>

                <h4> FOREIGN CURRENCY</h4>
                <br/>

                <select class="pairList foreignCurrency" id="foreignCurrency">
                    <option disabled selected value="">--select--</option>
                    <option value="GBP">GBP</option>
                    <option value="USD">USD</option>
                    <option value="CAD">CAD</option>
                </select> <br/>
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

                <p id="tradeExplaination"></p> </br>
                <button class="refreshButton" id="refreshButton">&#8634</button>
                <button class="submitButton" id="submitButton">submit</button>
                <br>
                <br>
                <br>

            </div>


        </form> </br>


    </div>
    <div class="card-footer">
        <a href="https://icons8.com/icon/22396/user">User icon by Icons8</a> <br>
        <a href="https://fonts.googleapis.com/css?family=Varela+Round">User font by Varela Round</a>
        <link href="https://fonts.googleapis.com/css?family=Varela+Round" rel="stylesheet">
    </div>

@endsection
