//---------------------------------------------------------------
//                      GLOBAL VARIABLES
//---------------------------------------------------------------
// Create chart variables
// create stock chart
var chart = anychart.stock();

// create data table on loaded data
var historyDataTable = anychart.data.table();
var futureDataTable = anychart.data.table();

// raw data (NOTICE!!! format of jsonData should be an array that is accepted format for dataTable.)
var jsonHistoryData, jsonZonesData;

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
var updateCandle, updateZone;



//---------------------------------------------------------------
//                      OTHER FUNCTION
//---------------------------------------------------------------
$(document).ready(function() {
    var tradeType = '';

    // chartSettings = {};

    var today = new Date();
    document.getElementById("tradeDate").min = today.toISOString().substr(0,10);

    // initiate form and some settings for chart
    initiateChartSettings(today);
    initiateTicketInputs();

    // initiate time interval counts
    updateIntervalCounts['1W'] = 60 / updateCandleInterval; // 1h/candle, increase 1 candle every intervals.
    updateIntervalCounts['1M'] = 60 * 4 / updateCandleInterval; // 4h/candle, increase 1 candle every intervals.
    updateIntervalCounts['3M'] = 60 * 24; // 1D/candle, increase 1 candle every intervals.
    updateIntervalCounts['1Y'] = 60 * 24 * 7; // 1W/candle, increase 1 candle every intervals.
    updateIntervalCounts['5Y'] = 60 * 24 * 31; // 1M/candle, increase 1 candle every intervals.

    //===========================================================
    //                CLICK EVENTS (chartsettings)
    //===========================================================

    $('#pairOptions').on('change', function(e) {
        //chartSettings = processForm('chartInput');
        // update pair in chart settings
        chartSettings['pair'] = e.target.value;

        // send request of candles data
        requestCandleData(chartSettings, false);

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
            updateEmptySpace();
            horizontalLine = updateSegmentLine(chartSettings['ylabelType']);
            zoneBlocks = updateZoneBlocks(jsonZonesData);
        }

        // set Interval
        // updateCandle = setInterval(updateSingleData, updateCandleInterval * 60 * 1000);
    });

    // prevent from the button can only submit once
    $('#chartInput').on('submit', function(e) {
        e.preventDefault();
    });

    // timescale buttons pressed (1D/1W/1M/3M/1Y/5Y)
    // $('#timescaleButton').on('click', function(e) {
    //     if (e.target != e.currentTarget) {
    //         var clickedItem = e.target.textContent;
    //         chartSettings['timescale'] = clickedItem;
    //         console.log(clickedItem);
    //
    //         // request data from
    //         requestCandleData(chartSettings, false);
    //
    //         // render new data onto chart
    //         renderHistoryDataToChart();
    //
    //         // update the empty space in chart if there is any
    //         if (document.getElementById('tradeDate').value != "") {
    //             updateEmptySpace();
    //             horizontalLine = updateSegmentLine(chartSettings['ylabelType']);
    //         }
    //     }
    // });

    // type of graph (candle/line)
    $('#candleLineButton').on('click', function(e) {
        if (e.target != e.currentTarget) {
            var clickedItem = e.target.value;
            chartSettings['type'] = clickedItem;
            console.log(clickedItem);
            switchChartType(clickedItem);
        }
    });

    // axes labels (% or $)
    $('#pricePercentageButton').on('click', function(e) {
       if (e.target != e.currentTarget) {
           var clickedItem = e.target.value;
           chartSettings['ylabelType'] = clickedItem;
           switchYaxisType(clickedItem);

           if (ticketInputs['tradeDate'] != "") {
               // remove previous segment line
               historyPlot.annotations().removeAllAnnotations();

               // update projection and zone data to plot
               updateEmptySpace();
               horizontalLine = updateSegmentLine(chartSettings['ylabelType']);
               zoneBlocks = updateZoneBlocks(jsonZonesData);
           }

           // update color of yLabel
           updateYlabelsColor(historyPlot.yAxis(), chartSettings['ylabelType'], ticketInputs['tradeType']);
       }
    });

    //===========================================================
    //                CLICK EVENTS (ticketInputs)
    //===========================================================

    $('#tradeDate').on('change', function(e) {


        ticketInputs['tradeDate'] = document.getElementById('tradeDate').value;

        var today = new Date();
        var tradeDate = new Date(ticketInputs['tradeDate']);


        // calculate differece of today and trade date
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
        } else if (deltaTime['week'] >= 1) {
            chartSettings['timescale'] = "1M";
        } else {
            chartSettings['timescale'] = "1W";
        }

        // update candle plot only when user have choose pairs
        if (historyDataTable.bc.b.length > 0) {
            // send request of candles data
            requestCandleData(chartSettings,false);

            // send request of zones data
            requestZoneData(chartSettings);

            // render data to plot
            renderHistoryDataToChart();

            // remove previous segment line
            historyPlot.annotations().removeAllAnnotations();

            // update the projection on the future plot
            updateEmptySpace();
            horizontalLine = updateSegmentLine(chartSettings['ylabelType']);
            zoneBlocks = updateZoneBlocks(jsonZonesData);

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

function requestCandleData (argument, singleData) {
    var requestSingleCurrentCurrency = (singleData == true) ? "true" : "false";

    //{pair: inputArg['pair'], timeRange: '1Y', utc: inputArg['utc']}
    $.get({
            url: 'http://minidesk.laravel.coretekllc.com/chart/getTable',
            data: {
                pair: argument['pair'],
                timeRange: argument['timescale'],
                utc: argument['utc'],
                currentCurrency: requestSingleCurrentCurrency
            },
            async: false
        }
    ).done(function (historyData) {
        // update hitory data points
        jsonHistoryData = historyData;

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

    // adding timezone info
    chartSettings['utc'] = - (today.getTimezoneOffset() / 60);
}

function initiateTicketInputs () {
    ticketInputs = {};
    ticketInputs['tradeType'] = "";
    ticketInputs['tradeDate'] = "";
    ticketInputs['transactionAmount'] = 0;
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
    chart.bounds(0, 0, '95%', '80%');

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
        return ((this.value + 100) / 100 * jsonHistoryData[0][5]).toFixed(4);
    });

    //===========================================================
    //                      Crosshair
    //===========================================================

    // enable/disable the crosshair
    historyPlot.crosshair(true);

    // configure the crosshair
    historyPlot.crosshair().xLabel().format(function(e) {
        return anychart.format.dateTime(this.value, "MMM d, yyyy");
    });
    historyPlot.crosshair().yLabel().format(function() {
        return ((this.value + 100) / 100 * jsonHistoryData[0][5]).toFixed(4);
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
                return "<span style='color:#455a64;font-weight:600'>" + this.index +
                    "</span>: <b>Close</b> " + this.value + " <b>Delta O-C(%)</b> " + jsonHistoryData[length - this.index - 1][8];
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
                return ((this.value + 100) / 100 * jsonHistoryData[0][5]).toFixed(4);
            })
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
                return ((this.value + 100) / 100 * jsonHistoryData[0][5]).toFixed(4);
            });
            break;
    }
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
            alert(message);
        }
    });
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

function updateEmptySpace () {
    var tradeDate = new Date(document.getElementById('tradeDate').value);

    // check the difference of today and trade date
    dd = countDifferenceOfDate(new Date, tradeDate);

    // adding empty space of 1/2 data at the right-side of chart
    addEmptySpaceInChart(chart, historyDataTable.bc.b.length / 2, dd);

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

    // TO-DO
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
    var defaultColor = "#717b83";

    // get a number of labels on the Y axis
    var count = yAxis.labels().getLabelsCount();

    // setting the threshold of color
    var standardValue = (pricePercentageType == "percent") ? 0 : jsonHistoryData[0][5];

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
        if (tradeType == "") {
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

function updateSingleData (chartSettings, counter) {
    requestCandleData(chartSettings,true);
    if (candleUpdateCounter < updateIntervalCounts[chartSettings['timescale']]) { // update one point
        // only update
    }
}