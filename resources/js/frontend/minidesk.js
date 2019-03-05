//---------------------------------------------------------------
//                      GLOBAL VARIABLES
//---------------------------------------------------------------
// Create chart variables
// create stock chart
var chart = anychart.stock();
var chart_right = anychart.stock();
// chart_right = anychart.line();

// create data table on loaded data
var historyDataTable = anychart.data.table();
var futureDataTable = anychart.data.table();

// raw data (NOTICE!!! format of jsonData should be an array that is accepted format for dataTable.)
var jsonHistoryData, jsonFutureData;

// create plot for chart
var historyPlot, futureTrendPlot;

// create mapping for candle and line;
var candle_mapping, line_mapping;
var futureline_mapping;

// options of user input
var chartSettings, ticketInputs;

// flag
var finish_update;

//---------------------------------------------------------------
//                      INITIAL CHART
//---------------------------------------------------------------


//---------------------------------------------------------------
//                      OTHER FUNCTION
//---------------------------------------------------------------
$(document).ready(function() {
    var tradeType = '';

    var today = new Date();
    document.getElementById("tradeDate").min = today.toISOString().substr(0,10);

    //===========================================================
    //                CLICK EVENTS (chartsettings)
    //===========================================================

    $('#pairOptions').on('change', function(e) {
        chartSettings = processForm('chartInput');
        chartSettings['timescale'] = '1Y';

        // adding timezone info
        chartSettings['utc'] = - (today.getTimezoneOffset() / 60);

        // update paragraph
        showInfo(chartSettings['pair']);

        // request GET/POST to backend
        requestData(chartSettings);



        //var data_json = $.parseJSON(data);
        if (historyDataTable.bc.b.length > 0)
            renderHistoryDataToChart();
        else
            initiateChartSetting();
    });

    // prevent from the button can only submit once
    $('#chartInput').on('submit', function(e) {
        e.preventDefault();
    });

    // timescale buttons pressed (1D/1W/1M/3M/1Y/5Y)
    $('#timescaleButton').on('click', function(e) {
        if (e.target != e.currentTarget) {
            var clickedItem = e.target.textContent;
            chartSettings['timescale'] = clickedItem;
            console.log(clickedItem);
            requestData(chartSettings);
        }
    });

    // type of graph (candle/line)
    $('#candleLineButton').on('click', function(e) {
        if (e.target != e.currentTarget) {
            var clickedItem = e.target.value;
            chartSettings['type'] = clickedItem;
            console.log(clickedItem);
            switchChartType(clickedItem)
        }
    });

    // axes labels (% or $)
    $('#pricePercentageButton').on('click', function(e) {
       if (e.target != e.currentTarget) {
           var clickedItem = e.target.value;
           chartSettings['ylabelType'] = clickedItem;
           switchYaxisType(clickedItem);
       }
    });

    //===========================================================
    //                CLICK EVENTS (ticketInputs)
    //===========================================================

    $('#tradeDate').on('change', function(e) {
        // update the second point of future trend (jsonFutureData)
        setFutureSecondPoint(e.target.value);

        // render data to chart
        renderFutureDataToChart();

        // change deployment of two plots in chart container
        changeChartDeployment();

        // render data in righthand side plot
        showHidePlot();
    });

    $('#buySellButton').on('click', function(e) {
        if (e.target != e.currentTarget) {
            var clickedItem = e.target.value;

            // save the trade type: but or sell
            tradeType = clickedItem;

            // disable button that was pressed
            document.getElementById("buyButton").disabled = (clickedItem == 'buy') ? true : false;
            document.getElementById("sellButton").disabled = (clickedItem == 'sell') ? true : false;

            // zones recommendation (color depends on buy/sell)
            /* TO BE FINISH */
        }
    });

    // submit trading ticket
    $('#submitButton').on('click', function(e) {
        var pair = document.getElementById("pairOptions").value.split("_");
        ticketInputs = processForm('tradingTicketForm');
        ticketInputs['tradeType'] = tradeType;
        ticketInputs['tradeCurrency'] = pair[0];
        ticketInputs['homeCurrency'] = pair[1];

        // submit the ticket info to backend and save into database;
        submitTicket(ticketInputs);
    });

});

function processForm (form) {
    var inputArg = [];
    var form = document.getElementById(form);

    for (var i = 0; i < form.length; i++)
        inputArg[form.elements[i].name] = form.elements[i].value;
    return inputArg;
}

function requestData (argument) {
    //{pair: inputArg['pair'], timeRange: '1Y', utc: inputArg['utc']}
    $.get({
            url: 'http://minidesk.laravel.coretekllc.com/chart/getTable',
            data: {
                pair: argument['pair'],
                timeRange: argument['timescale'],
                utc: argument['utc'],
                currentCurrency: 'false'
            },
            async: false
        }
    ).done(function (historyData) {
        // update hitory data points
        jsonHistoryData = historyData;

        // update the first point of future plot
        setFutureFirstPoint();

    }).fail(function (data) {
        console.log("Error: " + data);
    }).always(function (data) {

    });
}

function showInfo (pair) {
    let pairStr = pair.split("_");
    document.getElementById('pInfo').innerHTML = 'Your home currency: <b>' + pairStr[1] + '</b>and want to operate on <b>' + pairStr[0] + '</b>.'

}

function setFutureFirstPoint () {
    jsonFutureData = [];
    // var jsonLine = JSON.parse({JSON.stringify(jsonHistoryData[0]), JSON.stringify()
    jsonFutureData.push(JSON.parse(JSON.stringify(jsonHistoryData[0])));
    jsonFutureData.push(JSON.parse(JSON.stringify(jsonHistoryData[0])));
}

function setFutureSecondPoint (date) {
    jsonFutureData[1][0] = date + jsonHistoryData[0][0].substr(10);
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
        'close': 5,
        // 'value': 6,
        // 'average_volume': 7,        // further info (show in legend when hovering around)
        // 'delta_volume_p': 8,       // further info (show in legend when hovering around)
        // 'delta_volume': 9,          // further info (show in legend when hovering around)
        // 'average_volume_p': 10     // further info (show in legend when hovering around)

    });

    // History data (line)
    line_mapping = historyDataTable.mapAs({
        'value': 5
    });

    // Future Trend data (line)
    futureline_mapping = futureDataTable.mapAs({
        'value': 5
    });


    // Put the data into data table
    historyDataTable.addData(jsonHistoryData);
    futureDataTable.addData(jsonFutureData);

    //===========================================================
    //          Plot Postition, Height, and Width Settings
    //===========================================================

    // create first plot on the chart and set settings
    historyPlot = chart.plot(0);
    futureTrendPlot = chart_right.plot(0);

    historyPlot.height('100%')
        .width('100%')
        .yGrid(false)
        .xGrid(false)
        .yMinorGrid(false)
        .xMinorGrid(false);

    futureTrendPlot.height('100%')
        .width('100%')
        .yGrid(false)
        .xGrid(false)
        .yMinorGrid(false)
        .xMinorGrid(false);

    // chart position
    // chart.bounds(0, 0, '95%', '80%');

    // setting portion of plot in the same array (2/3, 1/3)
    // historyPlot.bounds(0, 0, '66%', '80%');
    // futureTrendPlot.bounds('66%', 0, '34%', '80%');// chart position

    // chart position
    chart.padding(0);
    chart.bounds(0, 0, '60%', '100%');
    chart_right.padding(0);
    chart_right.bounds('60%', 0, '34%', '100%');

    // create candlestick and line series
    var candlestick_series = historyPlot.candlestick(candle_mapping);
    var line_series = historyPlot.line(line_mapping);

    var futureLine_series = futureTrendPlot.line(futureline_mapping);

    // set id for each series
    candlestick_series.id("candle");
    line_series.id("line");
    futureLine_series.id("futureLine");

    // hide line series
    line_series.enabled(false);
    futureLine_series.enabled(true);

    //===========================================================
    //          X-axis and Y-axis (and labels)
    //===========================================================

    // x-axis(date-time) format settings for history plot
    var xAxis_0 = historyPlot.xAxis();
    xAxis_0.orientation("bottom");

    // x-axis(date-time) format settings for future plot
    var xAxis_1 = futureTrendPlot.xAxis();
    xAxis_1.orientation("bottom");

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

    // y-scale for both history and future trend plot
    var yScale_0 = historyPlot.yScale();
    yScale_0.comparisonMode("none");

    // y-scale for both history and future trend plot
    var yScale_1 = futureTrendPlot.yScale();
    yScale_1.comparisonMode("none");

    // adding synchronizeation of scalability



    // y-axis(price) format settings for history plot
    var yAxis_0 = historyPlot.yAxis(false);
    // yAxis_0.orientation("right");
    // yAxis_0.scale(yScale_0);
    // yAxis_0.labels().format("{%value}{decimalsCount:4, zeroFillDecimals:true}");

    // y-axis(price) format settings for future Trend plot
    var yAxis_1 = futureTrendPlot.yAxis();
    yAxis_1.orientation("left");
    yAxis_1.labels().enabled(false);
    yAxis_1.scale(yScale_0);


    //===========================================================
    //                      Legend
    //===========================================================

    // enable legend
    historyPlot.legend(true);
    futureTrendPlot.legend(false);

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
    //                      Crosshair
    //===========================================================

    // enable/disable the crosshair
    historyPlot.crosshair(true);
    futureTrendPlot.crosshair(false);

    // configure the crosshair
    historyPlot.crosshair().xLabel().format(function(e) {
        return anychart.format.dateTime(this.value, "MMM d, yyyy");
    });
    historyPlot.crosshair().yLabel().format("{%value}{decimalsCount:4, zeroFillDecimals:true}");


    // // set settings for event markers
    // var eventMarkers = historyPlot.eventMarkers();
    // // set markers data
    // eventMarkers.data([{
    //         date: '2001-09-11',
    //         description: '9-11 attacks'
    //     },
    //     {
    //         date: '2003-03-20',
    //
    //         description: 'Iraq War'
    //     }
    // ]);

    // configure the format of legend items
    // historyPlot.legend().itemsFormat(function() {
    //     var series = this.series;
    //     if (series.getType() == "line") {
    //         return "<span style='color:#455a64;font-weight:600'>" +
    //             series.name() + ":</span> " + this.value;
    //     }
    //     if (series.getType() == "ohlc") {
    //         return "<span style='color:#455a64;font-weight:600'>" +
    //             series.name() + ":</span> " +
    //             this.open + " / " + this.high + " / " +
    //             this.low + " / " + this.close;
    //     }
    // });

    //===========================================================
    //                   Disable
    //===========================================================

    // disable tooltip
    chart.tooltip(false);
    chart_right.tooltip(false);

    // disable scroller
    chart.scroller().enabled(false);
    chart_right.scroller().enabled(false);

    // disable future trend plot
    // chart_right.plot(0).enabled(false);

    chart.container(stage);
    chart.draw();
    chart_right.container(stage);
    chart_right.draw();
}

function renderHistoryDataToChart () {
    console.log('REFRESH HISTORY DATATABLE!');

    // Clear historyDataTable;
    historyDataTable.remove();

    // Update new data to data table (history)
    historyDataTable.addData(jsonHistoryData);


}

function renderFutureDataToChart () {
    console.log('REFRESH FUTURE DATATABLE!');

    // Clear historyDataTable;
    futureDataTable.remove();

    // Update new data to data table (future trend)
    futureDataTable.addData(jsonFutureData);

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
                return "<span style='color:#455a64;font-weight:600'>" + this.index +
                    "</span>: <b>Close</b> " + this.value + " <b>Delta O-C(%)</b> " + jsonHistoryData[length - this.index - 1][8];
            });
            break;

        case 'candle':
            series.legnedItem().clear()
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

    // yscale
    var yScale = historyPlot.yScale();
    switch(type) {
        case "percent":         // button: " % "
            yScale.comparisonMode("percent");
            yScale.compareWith("seriesEnd");
            yAxis.labels().format("{%value}{decimalsCount:2, zeroFillDecimals:true} %");
            break;

        case "price":           // button: " $ "
            yScale.comparisonMode("none");
            yAxis.labels().format("{%value}{decimalsCount:4, zeroFillDecimals:true}");
            break;
    }
    yAxis.scale(yScale);

    // crosshair
    var crosshair = chart.crosshair();
    switch(type) {
        case "percent":
            crosshair.yLabel().format("{%value}{decimalsCount:2, zeroFillDecimals:true} %");
            break;
        case "price":
            crosshair.yLabel().format("{%value}{decimalsCount:4, zeroFillDecimals:true}");
            break;
    }
}

//---------------------------------------------------------------
//                     Submit Trading Ticket
//---------------------------------------------------------------

function changeChartDeployment () {
    // x scale of future trend plot
    var dateScale = anychart.scales.dateTime();
    // var xScale_1 = futureTrendPlot.xScale();
    dateScale.maximum(jsonFutureData[0][0].substr(0,10));
    dateScale.minimum(jsonFutureData[1][0].substr(0,10));
    // futureTrendPlot.xScale(dateScale);


}

//---------------------------------------------------------------
//                     Submit Trading Ticket
//---------------------------------------------------------------

function submitTicket (argument) {
    $.get(
        'http://minidesk.laravel.coretekllc.com/chart/saveTradeSetting',
        {id: 0, account: 'bombobutt', home_currency:argument['homeCurrency'],
         trade_currency: argument['tradeCurrency'], trade: argument['tradeType'],
         amount: argument['amountInput'], date: argument['tradeDate']}
    ).always(function (message) {
        if (message != 'OK') {
            alert(data);
        }
    });
}

function showHidePlot(){
    chart_right.plot(0).enabled(true);
}