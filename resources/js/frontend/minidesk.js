//---------------------------------------------------------------
//                      GLOBAL VARIABLES
//---------------------------------------------------------------
// Create chart variables
// create stock chart
var chart = anychart.stock();

// create data table on loaded data
var dataTable = anychart.data.table();
var jsonData;
// create plot for chart
var plot;

// create mapping for candle and line;
var candle_mapping, line_mapping;

//---------------------------------------------------------------
//                      INITIAL CHART
//---------------------------------------------------------------


//---------------------------------------------------------------
//                      OTHER FUNCTION
//---------------------------------------------------------------
$(document).ready(function() {
    var inputArg;

    //===========================================================
    //                      CLICK EVENTS
    //===========================================================
    $('#pairOptions').on('change', function(e) {
        inputArg = processInputForm();
        inputArg['timescale'] = '1Y';

        // adding timezone info
        var d = new Date();
        inputArg['utc'] = - (d.getTimezoneOffset() / 60);

        // request GET/POST to backend
        requestData(inputArg);
    });

    // prevent from the button can only submit once
    $('#chartInput').on('submit', function(e) {
        e.preventDefault();
    });

    // timescale buttons pressed (1D/1W/1M/3M/1Y/5Y)
    $('#timescaleButton').on('click', function(e) {
        if (e.target != e.currentTarget) {
            var clickedItem = e.target.textContent;
            inputArg['timescale'] = clickedItem;
            console.log(clickedItem);
            requestData(inputArg);
        }
    });

    // type of graph (candle/line)
    $('#candleLineButton').on('click', function(e) {
        if (e.target != e.currentTarget) {
            var clickedItem = e.target.value;
            inputArg['type'] = clickedItem;
            console.log(clickedItem);
            switchChartType(clickedItem)
        }
    });

    // axes labels (% or $)
    $('#pricePercentageButton').on('click', function(e) {
       if (e.target != e.currentTarget) {
           var clickedItem = e.target.value;
           inputArg['ylabelType'] = clickedItem;
           switchYaxisType(clickedItem);
       }
    });
    //===========================================================
    //                      CLICK EVENTS
    //===========================================================

});

function processInputForm () {
    var inputArg = [];
    var form = document.getElementById("chartInput");

    for (var i = 0; i < form.length; i++)
        inputArg[form.elements[i].name] = form.elements[i].value;
    return inputArg;
}

function requestData (argument) {
    //{pair: inputArg['pair'], timeRange: '1Y', utc: inputArg['utc']}
    $.get(
        '/chart/getTable',
        {pair: argument['pair'], timeRange: argument['timescale'], utc: argument['utc']}
    ).done(function (data) {
        jsonData = data;
        //var data_json = $.parseJSON(data);
        if (dataTable.bc.b.length > 0)
            renderDataToChart(data);
        else
            initiateChartSetting(data);
    }).fail(function (data) {
        console.log("Error: " + data);
    }).always(function (data) {

    });
}


function initiateChartSetting (data) {
    // map loaded data for candlestick/line
    candle_mapping = dataTable.mapAs({
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

    line_mapping = dataTable.mapAs({
        'value': 5
    });

    var vol_mapping = dataTable.mapAs({'x': 0, 'value': 6});
    var avg_volume_mapping = dataTable.mapAs({'x': 0, 'value': 7});
    var del_volume_p_mapping = dataTable.mapAs({'x': 0, 'value': 8});
    var del_volume_mapping = dataTable.mapAs({'x': 0, 'value': 9});
    var avg_volume_p_mapping = dataTable.mapAs({'x': 0, 'value': 10});


    // Put the data into data table
    dataTable.addData(data);

    // create first plot on the chart and set settings
    plot = chart.plot(0);

    plot.height('75%')
        .yGrid(false)
        .xGrid(false)
        .yMinorGrid(false)
        .xMinorGrid(false);

    // chart position
    chart.bounds(0, '3%', '95%', '80%');

    // create candlestick and line series
    var candlestick_series = plot.candlestick(candle_mapping);
    var line_series = plot.line(line_mapping);
    var vol_series = plot.line(vol_mapping);
    var avgVol_series = plot.line(avg_volume_mapping);
    var delVolPercentage_series = plot.line(del_volume_p_mapping);
    var delVol_series = plot.line(del_volume_mapping);
    var avgVolPercentage_series = plot.line(avg_volume_p_mapping);

    // set id for each series
    candlestick_series.id("candle");
    line_series.id("line");

    // set the name for series
    vol_series.name("Vol");
    avgVol_series.name("Avg Volume");
    delVolPercentage_series.name("Delta Volume(%)");
    delVol_series.name("Delta Volume");
    avgVolPercentage_series.name("Avg Volume(%)");

    // hide line series
    line_series.enabled(false);
    vol_series.enabled(false);
    avgVol_series.enabled(false);
    delVolPercentage_series.enabled(false);
    delVol_series.enabled(false);
    avgVolPercentage_series.enabled(false);

    // x-axis(date-time) format settings
    var xAxis = plot.xAxis();
    xAxis.orientation("bottom");

    // setting y scale type as dateTime and adjusting minimum and maximum values
    // var dateScale = anychart.scales.dateTime();
    // var dateTicks = dateScale.ticks();
    // dateTicks.interval(0, 1);
    // var dateMinorTicks = dateScale.minorTicks();
    // dateMinorTicks.interval(0, 0, 15);
    // plot.xScale(dateScale);

    // var ticks = plot.xScale().ticks();
    // ticks.interval(0, 1);    // Y, M, D, h, m, s
    // var minorTicks = plot.xScale().minorTicks();
    // minorTicks.interval(0, 0, 15);

    // y-axis(price) format settings
    var yAxis = plot.yAxis();
    yAxis.orientation("right");
    var yScale = plot.yScale();
    yScale.comparisonMode("none");
    yAxis.scale(yScale);
    yAxis.labels().format("{%value}{decimalsCount:4, zeroFillDecimals:true}");

    // disable tooltip
    chart.tooltip(false);

    // disable scroller
    chart.scroller().enabled(false);

    //===========================================================
    //                      LEGEND
    //===========================================================

    // enable legend
    plot.legend(true);

    // set position and alignment of legend
    // change size in height
    plot.legend().height(50);

    // adjust the paginator
    plot.legend().paginator(false);

    // set the source mode of the legend
    plot.legend().iconSize(0);
    //candlestick_series.legendItem().iconSize(0);
    // enable html for legend items
    candlestick_series.legendItem(true);
    line_series.legendItem(false);
    vol_series.legendItem(false);
    avgVol_series.legendItem(false);
    delVolPercentage_series.legendItem(false);
    delVol_series.legendItem(false);
    avgVolPercentage_series.legendItem(false);

    // legend style
    candlestick_series.legendItem().useHtml(true);
    // info_series.legendItem().iconType('rising-falling');


    // configure the format of legend items (candlestick)
    candlestick_series.legendItem().format( function(e) {
        var length = jsonData.length;
        if (length > 0 && this.index < length && this.index > 0) {
            return "<span style='color:#455a64;font-weight:600'>" + this.index +
                "</span>: <b>O</b> " + this.open + " <b>H</b> " + this.high + " <b>L</b> " + this.low + " <b>C</b> " + this.close + "<br/>" +
                "<b>Vol</b> " + jsonData[length - this.index - 1][6] + " <b>Avg Vol</b> " + jsonData[length - this.index - 1][7] +
                " <b>Delta Vol(%)</b> " + jsonData[length - this.index - 1][8] + "% <b>Range(L-H)</b> " + jsonData[length - this.index - 1][9] + " <b>Avg Vol(%)</b> " + jsonData[length - this.index - 1][10] + "%";
        } else {
            return "<span style='color:#455a64;font-weight:600'>" + this.index +
                "</span>: <b>O</b> ------ <b>H</b> ------ <b>L</b> ------ <b>C</b> ------<br/>" +
                "<b>Vol</b> ------ <b>Avg Vol</b> ------ <b>Delta Vol(%)</b> ------% <b>Range(L-H)</b> ------ <b>Avg Vol(%)</b> ------% ";
        }
    });

    // configure the format of legend items (info)
    vol_series.legendItem().format("{%seriesName}: {%value}{decimalsCount:4, zeroFillDecimals:true}");
    avgVol_series.legendItem().format("{%seriesName}: {%value}{decimalsCount:4, zeroFillDecimals:true}");
    delVolPercentage_series.legendItem().format("{%seriesName}: {%value}{decimalsCount:2, " +
        "zeroFillDecimals:true} %");
    delVol_series.legendItem().format("{%seriesName}: {%value}{decimalsCount:4, zeroFillDecimals:true}");
    avgVolPercentage_series.legendItem().format("{%seriesName}: {%value}{decimalsCount:2, zeroFillDecimals:true} %");



    //===========================================================
    //                      CROSSHAIR
    //===========================================================

    // enable the crosshair
    chart.crosshair(true);

    // configure the crosshair
    chart.crosshair().xLabel().format(function(e) {
        return anychart.format.dateTime(this.value, "MMM d, yyyy");
    });
    chart.crosshair().yLabel().format("{%value}{decimalsCount:4, zeroFillDecimals:true}");


    // // set settings for event markers
    // var eventMarkers = plot.eventMarkers();
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
    // plot.legend().itemsFormat(function() {
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

    chart.container("chart");
    chart.draw();
}

function renderDataToChart (data) {
    console.log('REFRESH!');
    // Clear dataTable;
    dataTable.remove();
    dataTable.addData(data);
}

function switchChartType(type) {
    // hide all the series in plot, hide the legend of all series
    for (var i = 0; i < plot.getSeriesCount(); i++) {
        plot.getSeriesAt(i).enabled(false);
        plot.getSeriesAt(i).legendItem(false);
    }

    // show the type user assigned only
    var series = plot.getSeries(type);
    series.enabled(true);
    series.legendItem(true);

    // enable html for legend items
    series.legendItem().useHtml(true);

    // set the source mode of the legend
    //plot.legend().iconSize(0);

    // configure the format of legend items
    switch(type) {
        case 'line':
            series.legendItem().format(
                "<span style='color:#455a64;font-weight:600'>{%seriesName}: " +
                "</span>{%value}"
            );
            break;

        case 'candle':
            series.legendItem().format( function(e) {
                var length = jsonData.length;
                if (length > 0 && this.index < length && this.index > 0) {
                    return "<span style='color:#455a64;font-weight:600'>" + this.index +
                        "</span>: <b>O</b> " + this.open + " <b>H</b> " + this.high + " <b>L</b> " + this.low + " <b>C</b> " + this.close + "<br/>" +
                        "<b>Vol</b> " + jsonData[length - this.index - 1][6] + " <b>Avg Vol</b> " + jsonData[length - this.index - 1][7] +
                        " <b>Delta Vol(%)</b> " + jsonData[length - this.index - 1][8] + "% <b>Range(L-H)</b> " + jsonData[length - this.index - 1][9] + " <b>Avg Vol(%)</b> " + jsonData[length - this.index - 1][10] + "%";
                } else {
                    return "<span style='color:#455a64;font-weight:600'>" + this.index +
                        "</span>: <b>O</b> ------ <b>H</b> ------ <b>L</b> ------ <b>C</b> ------<br/>" +
                        "<b>Vol</b> ------ <b>Avg Vol</b> ------ <b>Delta Vol(%)</b> ------% <b>Range(L-H)</b> ------ <b>Avg Vol(%)</b> ------% ";
                }

            });
            break;
    }
}

function switchYaxisType(type) {
    // getting yaxis
    var yAxis = plot.yAxis();
    yAxis.orientation("right");

    // yscale
    var yScale = plot.yScale();
    switch(type) {
        case "percent":         // button: " % "
            yScale.comparisonMode("percent");
            yScale.compareWith("seriesStart");
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