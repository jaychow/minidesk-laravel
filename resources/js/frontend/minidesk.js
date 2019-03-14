//---------------------------------------------------------------
//                      GLOBAL VARIABLES
//---------------------------------------------------------------
// Create chart variables
// create stock chart
var chart = anychart.stock();

// create data table on loaded data
// var historyDataTable = anychart.data.table(0, 'yyyy-MM-dd HH:mm:ss');
var historyDataTable = anychart.data.table();
var futureDataTable = anychart.data.table();

// raw data (NOTICE!!! format of jsonData should be an array that is accepted format for dataTable.)
var jsonHistoryData = [], jsonZonesData = [], singleCandle = [];

// create plot for chart
var historyPlot;

// create mapping for candle and line;
var candle_mapping, line_mapping;

// options of user input
var chartSettings, ticketInputs;

// drawing instances
var zoneBlocks, horizontalLine;

// time interval counter
var updateCandleInterval = 5; // 5 minutes
var updateIntervalCounts = {};
var candleUpdateCounter = 0, zoneUpdateCounter = 0;

// timer
var updateCandle = null, updateZone = null;
var counter = 0;

var candleUnitTime = {"1W": 1, "1M": 4, "3M": 24, "6M": 24, "1Y": 24*7, "5Y": 24*31};

// utc timezone offset;
var utcOffset = new Date().getTimezoneOffset();

//---------------------------------------------------------------
//                      OTHER FUNCTION
//---------------------------------------------------------------
$(document).ready(function() {

    var today = new Date();
    document.getElementById("tradeDate").min = today.toISOString().substr(0,10);

    // initiate form and some settings for chart
    initiateChartSettings(today);
    initiateTicketInputs();

    // drop down list initialization
    // document.getElementById("homeCurrency").selectedIndex = -1;

    // initiate time interval counts
    updateIntervalCounts['1W'] = 60 / updateCandleInterval; // 1h/candle, increase 1 candle every intervals.
    updateIntervalCounts['1M'] = 60 * 4 / updateCandleInterval; // 4h/candle, increase 1 candle every intervals.
    updateIntervalCounts['3M'] = 60 * 24; // 1D/candle, increase 1 candle every intervals.
    updateIntervalCounts['1Y'] = 60 * 24 * 7; // 1W/candle, increase 1 candle every intervals.
    updateIntervalCounts['5Y'] = 60 * 24 * 31; // 1M/candle, increase 1 candle every intervals.

    // update candle refresh interval
    // chartSettings['refreshInterval'] = getRefreshInterval();
    getRefreshInterval();
    switch(chartSettings['refreshInterval']) {
        case "S5":
            updateCandleInterval = 5 / 60;
            break;
        case "S10":
            updateCandleInterval = 10 / 60;
            break;
        case "S15":
            updateCandleInterval = 15 / 60;
            break;
        case "S30":
            updateCandleInterval = 30 / 60;
            break;
        case "M1":
            updateCandleInterval = 1;
            break;
        case "M2":
            updateCandleInterval = 2;
            break;
        case "M4":
            updateCandleInterval = 4;
            break;
        case "M5":
            updateCandleInterval = 5;
            break;
        case "M10":
            updateCandleInterval = 10;
            break;
        case "M15":
            updateCandleInterval = 15;
            break;
        case "M30":
            updateCandleInterval = 30;
            break;
        case "H1":
            updateCandleInterval = 60;
            break;
    }
    //===========================================================
    //                CLICK EVENTS (chartsettings)
    //===========================================================


    $('#homeCurrency').on('change', function(e) {

        var homeCurrency = e.target.value;
        var foreignCurrency = document.getElementById("foreignCurrency");

        // disable the same option in foreignCurrency drop down list
        var length = document.getElementById("foreignCurrency").length;
        for (var i = 0; i < length; i++) {
            if (foreignCurrency.options[i].value == homeCurrency) {
                foreignCurrency.options[i].disabled = true;
            } else {
                foreignCurrency.options[i].disabled = false;
            }
        }

        // every time when user select homeCurrency, he will need to select foreignCurrency again.
        foreignCurrency.selectedIndex = "0";
        chartSettings['pair'] = "";
        ticketInputs['homeCurrency'] = homeCurrency;
        ticketInputs['foreignCurrency'] = "";

        // disable timer to request single candle
        if (updateCandle != null) clearInterval(updateCandle);

    });

    $('#foreignCurrency').on('change', function(e) {
        var foreignCurrency = e.target;
        var homeCurrency = document.getElementById("homeCurrency");
        var counter = 0;
        // if user haven't yet choose home currency
        if (homeCurrency.value == "") {
            alert("Please select home currency first");
            foreignCurrency.selectedIndex = "0";
        } else {
            // save input
            chartSettings['pair'] = updatePair();
            ticketInputs['foreignCurrency'] = foreignCurrency.value;

            // update title of plot
            document.getElementById("currencyTitle").innerHTML = foreignCurrency.value;

            // make button of choice for chart visible
            document.getElementById("pricePercentageButton").style.visibility = "visible";
            document.getElementById("timescaleButton").style.visibility = "visible";
            document.getElementById("candleLineButton").style.visibility = "visible";


            // disable timer to request single candle
            if (updateCandle != null) clearInterval(updateCandle);

            // set Interval
            updateCandle = kickStartTimer();

            pairUpdatePlot();
            console.log("---------------------------------");
            console.log("            Initiate             ");
            console.log("---------------------------------");
            console.log("#0\t\tW (json[0])\t\t" + jsonHistoryData[0]);
            console.log("---------------------------------");


            // adding space for one candle that show instant currency
            // updateEmptySpace(false);

            // update trade explaination if ticket inputs are all determined
            if (ticketInputs['tradeType'] != "" && chartSettings['pair'] != "" && ticketInputs['transactionAmount'] != 0) {
                document.getElementById("tradeExplaination").innerHTML = updateTradeExplaination(ticketInputs['homeCurrency'], ticketInputs['foreignCurrency'], ticketInputs['tradeType'], ticketInputs['transactionAmount']);
            }

            // update yLabel color
            if (ticketInputs['tradeType'] != "") {
                updateYlabelsColor(historyPlot.yAxis(), chartSettings['ylabelType'], ticketInputs['tradeType']);
            }

            // set Interval
            // updateCandle = setInterval(updateSingleData, updateCandleInterval * 60 * 1000); // updateCandleInterval (unit: minute)
            // updateCandle = kickStartTimer();
        }

    });

    $('#pairOptions').on('change', function(e) {
        //chartSettings = processForm('chartInput');
        // update pair in chart settings
        chartSettings['pair'] = e.target.value;


        // set Interval
        // updateCandle = setInterval(updateSingleData, updateCandleInterval * 60 * 1000);
    });

    // prevent from the button can only submit once
    $('#chartInput').on('submit', function(e) {
        e.preventDefault();
    });

    // timescale buttons pressed (1D/1W/1M/3M/1Y/5Y)
    $('#timescaleButton').on('click', function(e) {
        if (e.target != e.currentTarget) {
            var clickedItem = e.target.textContent;
            console.log(clickedItem);

            // update settings only when no trade date is determined
            if (ticketInputs['tradeDate'] == "") {
                // save timescale setting
                chartSettings['timescale'] = clickedItem;

                // disable button that was pressed
                $('.timescaleButton').each(function(i, button) {
                    if (button.value == chartSettings['timescale']) {
                        button.disabled = true;
                    } else {
                        button.disabled = false;
                    }
                });

                // request data from
                requestCandleData(chartSettings, false);

                // render new data onto chart
                renderHistoryDataToChart();

            } else {

                if (clickedItem != ticketInputs['timescale']) {

                    // save timescale setting
                    chartSettings['timescale'] = clickedItem;

                    // disable button that was pressed
                    $('.timescaleButton').each(function(i, button) {
                        if (button.value == chartSettings['timescale']) {
                            button.disabled = true;
                        } else {
                            button.disabled = false;
                        }
                    });

                    // request data from
                    requestCandleData(chartSettings, false);

                    // render new data onto chart
                    renderHistoryDataToChart();

                    // cancel empty space
                    updateEmptySpace(false);

                    // remove horizontal projection line (if it exist)
                    historyPlot.annotations().removeAnnotation(horizontalLine);

                } else {


                    // save timescale setting
                    chartSettings['timescale'] = clickedItem;
                    // disable button that was pressed
                    $('.timescaleButton').each(function(i, button) {
                        if (button.value == chartSettings['timescale']) {
                            button.disabled = true;
                        } else {
                            button.disabled = false;
                        }
                    });

                    // request data from
                    requestCandleData(chartSettings, false);

                    // render new data onto chart
                    renderHistoryDataToChart();

                    // increase empty space
                    updateEmptySpace(true);

                    // update horizontal projection line
                    horizontalLine = updateSegmentLine(chartSettings['ylabelType']);
                }
            }

        }
    });

    // type of graph (candle/line)
    $('#candleLineButton').on('click', function(e) {
        if (e.target != e.currentTarget) {
            var clickedItem = e.target.value;

            // save the chart type(candle/line)
            chartSettings['type'] = clickedItem;
            console.log(clickedItem);

            // disable button that was pressed
            document.getElementById("candleButton").disabled = (clickedItem == 'candle') ? true : false;
            document.getElementById("lineButton").disabled = (clickedItem == 'line') ? true : false;


            // update chart
            switchChartType(clickedItem);
        }
    });

    // axes labels (% or $)
    $('#pricePercentageButton').on('click', function(e) {
        if (e.target != e.currentTarget) {
           var clickedItem = e.target.value;

           // save the ylabel type
           chartSettings['ylabelType'] = clickedItem;

           // disable button that was pressed
           document.getElementById("percentButton").disabled = (clickedItem == 'percent') ? true : false;
           document.getElementById("priceButton").disabled = (clickedItem == 'price') ? true : false;
           document.getElementById("userButton").disabled = (clickedItem == 'user') ? true : false;

           // switch yaxis type
           switchYaxisType(clickedItem);

           if (ticketInputs['tradeDate'] != "") {
               // remove previous segment line
               historyPlot.annotations().removeAllAnnotations();

               // update projection and zone data to plot
               updateEmptySpace(true);
               horizontalLine = updateSegmentLine(chartSettings['ylabelType']);
               zoneBlocks = updateZoneBlocks(jsonZonesData);
           }
           // update yLabel color
           if (ticketInputs['tradeType'] != "") {
               updateYlabelsColor(historyPlot.yAxis(), chartSettings['ylabelType'], ticketInputs['tradeType']);
           }
        }
    });

    //===========================================================
    //                CLICK EVENTS (ticketInputs)
    //===========================================================
    $('#transactionAmount').on('change', function (e) {
        if (e.target.value > 0) {
            // change transactionAmount input borderColor as black;
            $(this).removeClass('error');

            // update ticketInputsƒ
            ticketInputs['transactionAmount'] = e.target.value;

            // update trade explaination if ticket inputs are all determined
            if (ticketInputs['tradeType'] != "" && chartSettings['pair'] != "" && ticketInputs['transactionAmount'] != 0) {
                document.getElementById("tradeExplaination").innerHTML = updateTradeExplaination(ticketInputs['homeCurrency'], ticketInputs['foreignCurrency'], ticketInputs['tradeType'], ticketInputs['transactionAmount']);
            }
        } else {
            alert("Please enter positive amount");
            $(this).addClass('error');
        }
    })

    $('#tradeDate').on('change', function(e) {

        // remove the previous ticket indicator class from that button
        if (ticketInputs['tradeDate'] != "") {
            $('#' + ticketInputs['timescale'] + "Button").removeClass('ticketTimescaleIndicator');
        }


        // save the input of trade date
        ticketInputs['tradeDate'] = document.getElementById('tradeDate').value;

        var today = new Date();
        var tradeDate = new Date(new Date(ticketInputs['tradeDate']).getTime() + today.getTimezoneOffset() * 60000);


        // calculate differece of today and trade date
        console.log('Today: ' + today);
        console.log('Trade Date: ' + tradeDate);
        deltaTime = calculateDeltaTime(today, tradeDate); // today and tradeDate should be date object instead of string

        // decide timescale of chart
        if (deltaTime['year'] >= 1) {
            chartSettings['timescale'] = "5Y";
        } else if (deltaTime['month'] >= 6) {
            chartSettings['timescale'] = "1Y";
        } else if (deltaTime['month'] >= 3) {
            chartSettings['timescale'] = "6M";
        } else if (deltaTime['month'] >= 1) {
            chartSettings['timescale'] = "3M";
        } else if (deltaTime['day'] >= 7) {
            chartSettings['timescale'] = "1M";
        } else {
            chartSettings['timescale'] = "1W";
        }
        ticketInputs['timescale'] = chartSettings['timescale'];



        // refresh button status: disabled
        var buttonGroup = document.getElementsByClassName("timescaleButton");
        $('.timescaleButton').each(function(i, button) {
            if (button.value == chartSettings['timescale']) {
                button.disabled = true;
            } else {
                button.disabled = false;
            }
        });

        $('#' + ticketInputs['timescale'] + "Button").addClass('ticketTimescaleIndicator');

        // update candle plot only when user have choose pairs
        if (historyDataTable.bc.b.length > 0) {
            // disable timer to request single candle
            if (updateCandle != null) clearInterval(updateCandle);

            // set Interval
            updateCandle = kickStartTimer();

            pairUpdatePlot();
        }


    });

    $('#buySellButton').on('click', function(e) {
        if (e.target != e.currentTarget) {
            var clickedItem = e.target.value;

            // save the trade type: but or sell
            ticketInputs['tradeType'] = clickedItem;

            // disable button that was pressed
            document.getElementById("buyButton").disabled = (clickedItem == 'buy') ? true : false;
            document.getElementById("sellButton").disabled = (clickedItem == 'sell') ? true : false;

            if (chartSettings['pair'] != "" && ticketInputs['tradeDate'] != "") {

                // remove previous segment line
                historyPlot.annotations().removeAllAnnotations();

                // zones recommendation (color depends on buy/sell)
                horizontalLine = updateSegmentLine(chartSettings['ylabelType']);
                zoneBlocks = updateZoneBlocks(jsonZonesData);

                // update color of yLabel
                updateYlabelsColor(historyPlot.yAxis(), chartSettings['ylabelType'], ticketInputs['tradeType']);
            }

            // update trade explaination if ticket inputs are all determined
            if (ticketInputs['tradeType'] != "" && chartSettings['pair'] != "" && ticketInputs['transactionAmount'] != 0) {
                document.getElementById("tradeExplaination").innerHTML = updateTradeExplaination(ticketInputs['homeCurrency'], ticketInputs['foreignCurrency'], ticketInputs['tradeType'], ticketInputs['transactionAmount']);
            }
        }
    });

    // submit trading ticket
    $('#submitButton').on('click', function(e) {
        // update transaction amount
        ticketInputs['transactionAmount'] = document.getElementById("transactionAmount").value;

        // switch ylabelType
        chartSettings['ylabelType'] = "user";

        // check whether all the input is determined
        if (!formIsComplete()) {
            var unfinishList = [];
            var length = Object.keys(ticketInputs).length;
            for (var i = 0; i < length; i++) {
                if (ticketInputs[Object.keys(ticketInputs)[i]] == "") {
                    unfinishList.push(Object.keys(ticketInputs)[i]);
                }
            }
            alert("Please fill in: " + unfinishList.toString());

        } else {
            // change the yAxis type
            switchYaxisType("user");

            // set user icon for yAxis label type is visible
            document.getElementById("userButton").style.visibility = "visible";
            document.getElementById("userButton").disabled = true;
            document.getElementById("priceButton").disabled = false;
            document.getElementById("percentButton").disabled = false;


            // submit the ticket info to backend and save into database;
            submitTicket(ticketInputs);

            // update color of yLabel
            updateYlabelsColor(historyPlot.yAxis(), chartSettings['ylabelType'], ticketInputs['tradeType']);
        }



    });

});

function processForm (form) {
    var inputArg = [];
    var form = document.getElementById(form);

    for (var i = 0; i < form.length; i++)
        inputArg[form.elements[i].name] = form.elements[i].value;
    return inputArg;
}

function requestCandleData (argument, singleData) {
    var requestSingleCurrentCurrency = (singleData == true) ? "current" : "whole";

    // utc: argument['utc'],
    //{pair: inputArg['pair'], timeRange: '1Y', utc: inputArg['utc']}
    console.log('Request ' + requestSingleCurrentCurrency + ": P# " + argument['pair'] + " / I# " + argument['refreshInterval'])
    $.get({
            url: 'http://minidesk.laravel.coretekllc.com/chart/getTable',
            data: {
                pair: argument['pair'],
                timeRange: argument['timescale'],
                utc: 0,
                status: requestSingleCurrentCurrency,
                interval: argument['refreshInterval']
            },
            async: false
        }
    ).done(function (historyData) {
        if (singleData) {
            // clear single candle
            singleCandle.splice(0, singleCandle.length);

            // copy history data to singleCandle
            singleCandle = historyData.slice();

        } else {
            // clear jsonHistoryData
            jsonHistoryData.splice(0, jsonHistoryData.length);


            // copy history data to jsonHistoryData
            jsonHistoryData = historyData.slice();

            // jsonHistoryData.forEach(function(element) {
            //
            // });
        }
    }).fail(function (data) {
        console.log("Error: " + data);
    }).always(function (data) {

    });
}

function initiateChartSettings (today) {
    var today = new Date()
    chartSettings = {};
    chartSettings['pair'] = "";
    chartSettings['timescale'] = "1Y";
    chartSettings['ylabelType'] = "price";
    chartSettings['type'] = "candle";
    chartSettings['refreshInterval'] = "M10";

    // adding timezone info
    chartSettings['utc'] = - (today.getTimezoneOffset() / 60);

}

function initiateTicketInputs () {
    ticketInputs = {};
    ticketInputs['homeCurrency'] = "";
    ticketInputs['foreignCurrency'] = "";
    ticketInputs['tradeType'] = "";
    ticketInputs['tradeDate'] = "";
    ticketInputs['transactionAmount'] = 0;
    ticketInputs['timescale'] = "1Y";
}

function initiateChartSetting () {

    var stage = acgraph.create('chart');
    //===========================================================
    //                   Data Manipulation
    //===========================================================

    // History data (candlestick)
    candle_mapping = historyDataTable.mapAs({
        'open': 2,
        'high': 3,
        'low': 4,
        'close': 5
    });

    // History data (line)
    line_mapping = historyDataTable.mapAs({
        'value': 5
    });

    // Put the data into data table
    historyDataTable.addData(jsonHistoryData);

    //===========================================================
    //          Plot Postition, Height, and Width Settings
    //===========================================================

    // create first plot on the chart and set settings
    historyPlot = chart.plot(0);

    historyPlot.height('100%')
        .width('100%')
        .yGrid(false)
        .xGrid(false)
        .yMinorGrid(false)
        .xMinorGrid(false);


    // chart position
    chart.bounds(0, 0, '90%', '100%');

    // setting portion of plot in the same array (2/3, 1/3)
    // historyPlot.bounds(0, 0, '66%', '80%');
    // futureTrendPlot.bounds('66%', 0, '34%', '80%');// chart position

    // create candlestick and line series
    var candlestick_series = historyPlot.candlestick(candle_mapping);
    var line_series = historyPlot.line(line_mapping);

    // set id for each series
    candlestick_series.id("candle");
    line_series.id("line");

    // hide line series
    line_series.enabled(false);

    //===========================================================
    //          X-axis and Y-axis (and labels)
    //===========================================================

    // x-axis(date-time) format settings for history plot
    var xAxis = historyPlot.xAxis();
    xAxis.orientation("bottom");

    // setting label on x-axis
    xAxis.labels().format(function() {
        return anychart.format.dateTime(this.value, "MMM d, yyyy", utcOffset);
    });
    // xLabels.fontFamily("Assistant");
    xAxis.labels().fontColor("#8b8dbb");

    // setting y scale type as dateTime and adjusting minimum and maximum values
    // var dateScale = anychart.scales.dateTime();
    // var dateTicks = dateScale.ticks();
    // dateTicks.interval(0, 1);
    // var dateMinorTicks = dateScale.minorTicks();
    // dateMinorTicks.interval(0, 0, 15);
    // historyPlot.xScale(dateScale);

    // var ticks = historyPlot.xScale().ticks();
    // ticks.interval(0, 1);    // Y, M, D, h, m, s
    // var minorTicks = historyPlot.xScale().minorTicks();
    // minorTicks.interval(0, 0, 15);

    // TODO use "switchYaxisType()" function
    // y-scale for both history and future trend plot (default: % mode)
    var yScale = historyPlot.yScale();
    yScale.comparisonMode("percent");
    yScale.compareWith("seriesEnd");
    yScale.ticks().interval(1);




    // y-axis(price) format settings for history plot
    var yAxis = historyPlot.yAxis();

    yAxis.orientation("right");
    yAxis.scale(yScale);
    yAxis.labels().format(function() {
        var currency = (this.value + 100) / 100 * jsonHistoryData[0][5];

        return "$ " + (Math.round(currency * 10000) / 10000).toFixed(4);
    });
    yAxis.labels().fontColor("#8b8dbb");

    //===========================================================
    //                      Crosshair
    //===========================================================

    // enable/disable the crosshair
    historyPlot.crosshair(true);

    // configure the crosshair
    historyPlot.crosshair().xLabel().format(function() {
        // TODO reformat dateTime
        // return this.value;

        return anychart.format.dateTime(this.value, "MMM d, yyyy hh:mm", utcOffset);
    });
    historyPlot.crosshair().yLabel().format(function() {
        var currency = (this.value + 100) / 100 * jsonHistoryData[0][5];

        return (Math.round(currency * 10000) / 10000).toFixed(4);
    });
    historyPlot.crosshair().xLabel().fontColor("white");
    historyPlot.crosshair().xLabel().background({
        fill: "#4a475f",
        stroke: "#4a475f"
    });

    historyPlot.crosshair().xLabel().fontColor("white");
    historyPlot.crosshair().yLabel().background({
        fill: "#4a475f",
        stroke: "#4a475f"
    });

    //===========================================================
    //                      Legend
    //===========================================================

    // enable legend
    historyPlot.legend(true);

    // remove all the listener of legend (click and hover)
    historyPlot.legend().removeAllListeners();

    // set position and alignment of legend
    // change size in height
    historyPlot.legend().height(50);

    // adjust the paginator
    historyPlot.legend().paginator(false);

    // set the source mode of the legend
    historyPlot.legend().iconSize(0);

    // enable html for legend items
    candlestick_series.legendItem(true);
    line_series.legendItem(false);

    // legend style
    candlestick_series.legendItem().useHtml(true);
    // info_series.legendItem().iconType('rising-falling');

    // configure the format of legend items (candlestick)
    candlestick_series.legendItem().format( function(e) {
        var length = jsonHistoryData.length;
        if (length > 0 && this.index < length && this.index > 0) {
            return "<span style='color:#455a64;font-weight:600'>" + this.index +
                "</span>: <b>O</b> " + this.open + " <b>H</b> " + this.high + " <b>L</b> " + this.low + " <b>C</b> " + this.close + "<br/>" +
                "<b>Vol</b> " + jsonHistoryData[length - this.index - 1][6] + " <b>Avg Vol</b> " + jsonHistoryData[length - this.index - 1][7] +
                " <b>Delta O-C(%)</b> " + jsonHistoryData[length - this.index - 1][8] + "% <b>Range(L-H)</b> " + jsonHistoryData[length - this.index - 1][9] + " <b>Avg Vol(%)</b> " + jsonHistoryData[length - this.index - 1][10] + "%";
        } else {
            return "<span style='color:#455a64;font-weight:600'>" + this.index +
                "</span>: <b>O</b> ------ <b>H</b> ------ <b>L</b> ------ <b>C</b> ------<br/>" +
                "<b>Vol</b> ------ <b>Avg Vol</b> ------ <b>Delta O-C(%)</b> ------% <b>Range(L-H)</b> ------ <b>Avg Vol(%)</b> ------% ";
        }
    });

    //===========================================================
    //                   Disable
    //===========================================================

    // disable tooltip
    chart.tooltip(false);

    // disable scroller
    chart.scroller().enabled(false);

    chart.container(stage);
    chart.draw();
}

function renderHistoryDataToChart () {
    console.log('REFRESH HISTORY DATATABLE!');

    // Clear historyDataTable;
    historyDataTable.remove();

    // Update new data to data table (history)
    historyDataTable.addData(jsonHistoryData);
}

function switchChartType(type) {
    // hide all the series in plot, hide the legend of all series
    for (var i = 0; i < historyPlot.getSeriesCount(); i++) {
        historyPlot.getSeriesAt(i).enabled(false);
        historyPlot.getSeriesAt(i).legendItem(false);
    }

    // show the type user assigned only
    var series = historyPlot.getSeries(type);
    series.enabled(true);
    series.legendItem(true);

    // enable html for legend items
    series.legendItem().useHtml(true);

    // set the source mode of the legend
    //historyPlot.legend().iconSize(0);

    // configure the format of legend items
    switch(type) {
        case 'line':
            series.legendItem().format( function(e) {
                var length = jsonHistoryData.length;
                if (length > 0 && this.index < length && this.index > 0) {
                    return "<span style='color:#455a64;font-weight:600'>" + this.index +
                        "</span>: <b>Close</b> " + this.value + " <b>Delta O-C(%)</b> " + jsonHistoryData[length - this.index - 1][8];

                } else {
                    return "<span style='color:#455a64;font-weight:600'>" + this.index +
                        "</span>: <b>Close</b> ------ <b>Delta O-C(%)</b> ------%";
                }

            });
            break;

        case 'candle':
            series.legendItem().format( function(e) {
                var length = jsonHistoryData.length;
                if (length > 0 && this.index < length && this.index > 0) {
                    return "<span style='color:#455a64;font-weight:600'>" + this.index +
                        "</span>: <b>O</b> " + this.open + " <b>H</b> " + this.high + " <b>L</b> " + this.low + " <b>C</b> " + this.close + "<br/>" +
                        "<b>Vol</b> " + jsonHistoryData[length - this.index - 1][6] + " <b>Avg Vol</b> " + jsonHistoryData[length - this.index - 1][7] +
                        " <b>Delta O-C(%)</b> " + jsonHistoryData[length - this.index - 1][8] + "% <b>Range(L-H)</b> " + jsonHistoryData[length - this.index - 1][9] + " <b>Avg Vol(%)</b> " + jsonHistoryData[length - this.index - 1][10] + "%";
                } else {
                    return "<span style='color:#455a64;font-weight:600'>" + this.index +
                        "</span>: <b>O</b> ------ <b>H</b> ------ <b>L</b> ------ <b>C</b> ------<br/>" +
                        "<b>Vol</b> ------ <b>Avg Vol</b> ------ <b>Delta O-C(%)</b> ------% <b>Range(L-H)</b> ------ <b>Avg Vol(%)</b> ------% ";
                }

            });
            break;
    }
}

function switchYaxisType(type) {
    // getting yaxis
    var yAxis = historyPlot.yAxis();
    yAxis.orientation("right");

    // transaction amount (only use in "user" mode)
    var amount = document.getElementById("transactionAmount").value;

    // yscale
    var yScale = historyPlot.yScale();
    switch(type) {
        case "percent":         // button: " % "
            yScale.comparisonMode("percent");
            yScale.compareWith("seriesEnd");
            yScale.ticks().interval(1);
            yAxis.labels().format("{%value}{decimalsCount:2, zeroFillDecimals:true} %");

            break;

        case "price":           // button: " $ "
            yScale.comparisonMode("percent");
            yAxis.labels().format(function() {
                var currency = (this.value + 100) / 100 * jsonHistoryData[0][5];

                // round to 0.0001 digit and if less add zero to 4 decimal point.
                return "$ " + (Math.round(currency * 10000) / 10000).toFixed(4);
            });
            break;

        case "user":            // submit button pressed
            yAxis.labels().format(function() {
                return "$ " + Math.round(((this.value + 100) / 100 * jsonHistoryData[0][5]) * amount).toLocaleString();
            });
            break;
    }
    yAxis.scale(yScale);

    // crosshair

    var crosshair = historyPlot.crosshair();
    switch(type) {
        case "percent":
            crosshair.yLabel().format("{%value}{decimalsCount:2, zeroFillDecimals:true} %");
            break;
        case "price":
            crosshair.yLabel().format(function() {
                var currency = (this.value + 100) / 100 * jsonHistoryData[0][5];
                // round to 0.0001 digit and if less add zero to 4 decimal point.

                return (Math.round(currency * 10000) / 10000).toFixed(4);
            });
            break;
        case "user":            // submit button pressed
            crosshair.yLabel().format(function() {
                return Math.round(((this.value + 100) / 100 * jsonHistoryData[0][5]) * amount);
            })
            break;
    }
}

//---------------------------------------------------------------
//                     Submit Trading Ticket
//---------------------------------------------------------------

function submitTicket (argument) {

    let x = confirm("Success submit");

    // TODO: change id and account value as variable when user has his own account
    if (x) {
        $.get(
            'http://minidesk.laravel.coretekllc.com/chart/saveTradeSetting',
            {id: 0, account: 'bombobutt', home_currency:argument['homeCurrency'],
                foreign_currency: argument['foreignCurrency'], trade: argument['tradeType'],
                amount: argument['transactionAmount'], date: argument['tradeDate']}
        ).always(function (message) {
            if (message != 'OK') {
                alert(message);
            }
        });
    }
}

function countDifferenceOfDate (earlierDate, laterDate) {
    return Math.ceil((laterDate - earlierDate) / 1000 / 60 / 60);
}

function addEmptySpaceInChart (theChart, countOfTicksInIntervals, hourIntervals) {
    var scale = theChart.xScale();
    var unit = hourIntervals/countOfTicksInIntervals;

    // Set maximum gap
    scale.maximumGap({intervalsCount: Math.ceil(countOfTicksInIntervals), unitType: 'hour', unitCount: Math.ceil(unit)});
}

function updateEmptySpace (tradeDateIsSelected) {
    var tradeDate = new Date(document.getElementById('tradeDate').value);

    // TODO change variable dd to hh rename(hour) and countDifferenceOfDate

    if (tradeDateIsSelected) {
        // check the difference of today and trade date
        var dd = countDifferenceOfDate(new Date, tradeDate) + 12;

        // adding empty space of 1/2 data at the right-side of chart
        addEmptySpaceInChart(chart, historyDataTable.bc.b.length / 2, dd);

    } else {
        addEmptySpaceInChart(chart, 1, candleUnitTime[chartSettings['timescale']]);
    }

}

function updateSegmentLine (pricePercentMode) {
    // access the annotations() object of the plot to work with annotations
    var controller = historyPlot.annotations();

    // change the valueAnchor according to price / percentage (mode to display money).
    // var valueAnchor = (pricePercentMode == "percent") ? 0 : jsonHistoryData[0][5];
    var valueAnchor = 0;

    // create a Line annotation
    var line = controller.line({
        xAnchor: jsonHistoryData[0][0],
        valueAnchor: valueAnchor,
        secondXAnchor: document.getElementById('tradeDate').value,
        secondValueAnchor: valueAnchor
    });

    // disable user to edit line
    line.allowEdit(false);

    return line;
}

function updateZoneBlocks (zone) {
    // access the annotations() object of the plot to work with annotations
    var controller = historyPlot.annotations();
    var valueAnchor = 0;
    const nutralColor = '#e3e3f7', highlightColor = '#bdbded';
    var sellColor, buyColor;

    // TODO
    // set superfuture as 10 years after the tradeDate
    var superFuture = '3000-01-01';

    // decide color;
    if (ticketInputs['tradeType'] == "") {
        buyColor = nutralColor;
        sellColor = nutralColor;
    } else {
        buyColor = (ticketInputs['tradeType'] == 'buy') ? highlightColor : nutralColor;
        sellColor = (ticketInputs['tradeType'] == 'sell') ? highlightColor : nutralColor;
    }

    // create rectangle annotation
    var rectangleArray = [];
    for (var i = 0; i < zone.length; i++) {
        // zone: [0: pair, 1: tradeType, 2: high, 3: low, 4: tradeDate]
        var color = (zone[i][1] == 'Buy') ? buyColor : sellColor;

        var thisZone = controller.rectangle({
            xAnchor: zone[i][4],
            valueAnchor: zone[i][3], // low
            secondXAnchor: superFuture,
            secondValueAnchor: zone[i][2], // high
            fill: color + ' 0.3',
            stroke: '0'
        });
        // disable user to edit zone rectangles
        thisZone.allowEdit(false);

        // add zone into array
        rectangleArray.push(thisZone);

    }
    return rectangleArray;
}

function requestZoneData (argument) {
    // % / $ type (ylabelType)
    // var percentage = (argument['ylabelType'] == "percent") ? "true" : "false";
    var percentage = "true";

    // get zones info that are stored in db.
    $.get({
            url: 'http://minidesk.laravel.coretekllc.com/chart/getZone',
            data: {
                pair: argument['pair'],
                trade: 'All',
                percentage: percentage,
                value: jsonHistoryData[0][5]
            },
            async: false
        }
    ).done(function (data) {
        jsonZonesData = data;
    }).fail(function (data) {
        console.log("Error: " + data);
    }).always(function (data) {

    });

}

function calculateDeltaTime (today, tradeDate) {
    // calculate timeRange and save it into inputArg
    let deltaTime = {};

    let ymdToday = [];
    let ymdFromDate = [];

    deltaTime['year'] = tradeDate.getFullYear() - today.getFullYear();
    deltaTime['month'] = tradeDate.getMonth() - today.getMonth();
    deltaTime['day'] = tradeDate.getDate() - today.getDate();

    return deltaTime;

}

function updateYlabelsColor (yAxis, pricePercentageType, tradeType) {

    // setting for colors
    var safeColor = "#0b9ca8";
    var warningColor = "#a80a47";
    var defaultColor = "#8b8dbb";

    // get a number of labels on the Y axis
    var count = yAxis.labels().getLabelsCount();

    // setting the threshold of color
    // switch(pricePercentageType) {
    //     case "percent":
    //         standardValue = 0;
    //         break;
    //     case "price":
    //         standardValue = jsonHistoryData[0][5];
    //         break;
    //     case "user":
    //         standardValue = jsonHistoryData[0][5] * document.getElementById("transactionAmount").value;
    //         break;
    // }
    // var standardValue = (pricePercentageType == "percent") ? 0 : jsonHistoryData[0][5];
    var standardValue = 0;
    // setting the color of tradeType
    var multiplier = (tradeType == "sell") ? 1 : -1;

    // go to through all labels
    for (var i = 0; i < count; i++) {

        // get label object
        var label = yAxis.labels().getLabel(i);

        // get value of the scale this label
        value = yAxis.scale().ticks().get()[i];

        // get chart average
        // avg = chart.getSeries(0).getStat('average');

        // if the value is greater
        if (label == null) {
            continue;
        } else if (tradeType == "") {
            label.fontColor(defaultColor);
        } else if ((value - standardValue) * multiplier > 0) { // safe(green)
            label.fontColor(safeColor);
        } else if ((value - standardValue) * multiplier < 0) { // dangerous(red)
            label.fontColor(warningColor);
        } else {
            label.fontColor(defaultColor);
        }
        label.draw();

    }
}

function updatePair () {
    var items = document.getElementsByClassName("pairList");
    return items["foreignCurrency"].value + "_" + items["homeCurrency"].value;
}

function pairUpdatePlot () {
    // send request of candles data
    // requestCandleData(chartSettings, true);
    requestCandleData(chartSettings, false);
    // jsonHistoryData.unshift(singleCandle);

    console.log(singleCandle, jsonHistoryData[0]);
    // send request of zones data
    requestZoneData(chartSettings);

    //var data_json = $.parseJSON(data);
    if (historyDataTable.bc.b.length > 0)
        renderHistoryDataToChart();
    else
        initiateChartSetting();

    // if trade date is determined
    if (ticketInputs['tradeDate'] != "") {
        // remove previous segment line
        historyPlot.annotations().removeAllAnnotations();

        // update projection and zone data to plot
        updateEmptySpace(true);
        horizontalLine = updateSegmentLine(chartSettings['ylabelType']);
        zoneBlocks = updateZoneBlocks(jsonZonesData);
    }

}

function formIsComplete() {
    let cnt = 0;
    var length = Object.keys(ticketInputs).length;

    for (var i = 0; i < length; i++) {
        if (ticketInputs[Object.keys(ticketInputs)[i]] == "") {
            return false;
        }
    }
    return true;
}

function updateTradeExplaination (homeCurrency, foreignCurrency, tradeType, transactionAmount) {
    var tmpMoney = transactionAmount * jsonHistoryData[0][5];
    var getMoney = "", costMoney = "";
    var msg = "";
    switch(tradeType) {
        case "buy":
            getMoney = Number(transactionAmount).toLocaleString() + " " + foreignCurrency;
            costMoney = Math.round(tmpMoney).toLocaleString() + " " + homeCurrency;

            msg = "If you transfer today, <br/>" + getMoney + " will cost you " + costMoney + ".";

            break;
        case "sell":
            getMoney = Math.round(tmpMoney).toLocaleString() + " " + homeCurrency;
            costMoney = Number(transactionAmount).toLocaleString() + " " + foreignCurrency;

            msg = "If you transfer today, <br/>" + costMoney + " will get you " + getMoney + ".";

            break;
    }
    return msg;

}

function getRefreshInterval() {
    $.get({
            url: 'http://minidesk.laravel.coretekllc.com/chart/getTimeInterval',
            async: false
        }
    ).done(function (interval) {
        // TODO: update the chartsettings
        if (interval == "") {
            alert("Admin haven't yet set up refresh interval.");
        } else {
            chartSettings['refreshInterval'];
        }

    }).fail(function (message) {
        alert("Error: " + message);
    });
}

function kickStartTimer () {
    var counter = 1;

    // TODO: use the parameter that is set in dashboard
    var updateCandle = setInterval(updateSingleData, 5000);

    function updateSingleData () {
        // TODO: change to callback function to call "requestCandleData"

        if (counter % 5 == 0) {
            // update whole jsonHistoryData
            // send request of candles data

            console.log('#' + counter + 'W (before)\t\t' + jsonHistoryData[0]);
            requestCandleData(chartSettings, false);
            console.log('#' + counter + 'W (after)\t\t\t' + jsonHistoryData[0] +'\n');

            renderHistoryDataToChart();
        } else {
            // put the latest candle at the first of jsonHistroyData
            requestCandleData(chartSettings, true);

            console.log('#' + counter + 'S (before)\t\t' + jsonHistoryData[0]);
            console.log('#' + counter + 'S (a candle)\t\t' + jsonHistoryData[0]);
            jsonHistoryData[0][3] = (Number(singleCandle[3]) > Number(jsonHistoryData[0][3])) ? singleCandle[3] : jsonHistoryData[0][3]; // update H
            jsonHistoryData[0][4] = (Number(singleCandle[4]) < Number(jsonHistoryData[0][4])) ? singleCandle[4] : jsonHistoryData[0][4]; // update L
            jsonHistoryData[0][5] = singleCandle[5]; // update C
            jsonHistoryData[0][6] += Number(singleCandle[6]);
            console.log('#' + counter + 'S (after)\t\t\t' + jsonHistoryData[0] +'\n');

            renderHistoryDataToChart();
        }

        // if trade date is determined
        if (ticketInputs['tradeDate'] != "" && ticketInputs['timescale'] == chartSettings['timescale']) {
            // remove previous segment line
            // historyPlot.annotations().removeAllAnnotations();
            historyPlot.annotations().removeAnnotation(horizontalLine);
            // update projection and zone data to plot
            // updateEmptySpace(true);
            horizontalLine = updateSegmentLine(chartSettings['ylabelType']);
            // zoneBlocks = updateZoneBlocks(jsonZonesData);
        }

        // update yLabel color
        if (ticketInputs['tradeType'] != "") {
            updateYlabelsColor(historyPlot.yAxis(), chartSettings['ylabelType'], ticketInputs['tradeType']);
        }
        counter += 1;

    }
    return updateCandle;
}
