@extends('frontend.layouts.app')

@section('content')


    <div id="chart-container">
        <div id="chart"></div>
    </div>

    <div id="user-panel">
        <form id="chartInput" action="http://minidesk.laravel.coretekllc.com/chart/getTable" type="get">
            <h4> HOME CURRENCY</h4> <br/>

            <select class="pairList" id="homeCurrency">
                <option disabled selected value="">--select--</option>
                <option value="GBP">GBP</option>
                <option value="USD">USD</option>
                <option value="CAD">CAD</option>
            </select> <br/>

            <h4> FOREIGN CURRENCY</h4> <br/>

            <select class="pairList" id="foreignCurrency">
                <option disabled selected value="">--select--</option>
                <option value="GBP">GBP</option>
                <option value="USD">USD</option>
                <option value="CAD">CAD</option>
            </select> <br/>

            <div class="chartButtons" id="timescaleButton">
                <button value="1W">1W</button>
                <button value="1M">1M</button>
                <button value="3M">3M</button>
                <button value="6M">6M</button>
                <button value="1Y">1Y</button>
                <button value="5Y">5Y</button>
            </div> <br/>

            <div class="chartButtons" id="candleLineButton">
                <button value="candle">Candle</button>
                <button value="line">Line</button>
            </div> <br/>

            <div class="chartButtons" id="pricePercentageButton">
                <button value="percent">%</button>
                <button value="price">$</button>
            </div>

        </form> </br> <hr>

        <p id="pInfo"></p> </br>

        <form id="tradingTicketForm">
            <div class="chartButtons" id="buySellButton">
                <button value="buy" id="buyButton">I WILL NEED</br>FOREIGN CURRENCY</button>
                <button value="sell" id="sellButton">I WILL NEED</br>HOME CURRENCY</button>
            </div> </br>

            <p><b>Amount: </b></p>
            <input type="number" name="transactionAmount"> </br>

            <p><b>Date: </b></p>
            <input type="date" name="tradeDate" id="tradeDate">



        </form>

        <button class="chartButtons" id="refreshButton">&#8634</button> <br />
        <button class="chartButtons" id="submitButton">submit</button>





    </div>

@endsection
