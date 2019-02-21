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
    // setting fromDate default as today;
    let today = new Date();
    document.getElementById("fromDate").value = today.toISOString().substr(0, 10);
    // document.querySelector("#fromDate").value = today;

    //===========================================================
    //                      CLICK EVENTS
    //===========================================================
    // prevent from the button can only submit once
    $('#zoneForm').on('submit', function(e) {
        e.preventDefault();
    });

    $('#submitTest').on('click', function(e){
        console.log("clicked");
        var url = 'http://minidesk.laravel.coretekllc.com/admin/chartzone/submitZone';
        var data = {
           key1: 'value1',
           key2: 'value2',
           key3: [
               'elem1',
               'elem2',
               'elem3'
           ],
           key4: {
               jkey1: 'value1',
               jkey2: 'value2',
               jkey3: 'value3',
               jkey4: 'value4',
               jkey5: [
                   'a',
                   'b',
                   'c'
               ]
           },
           _token: $('[name=_token]').val()
        };
        $.post(
            url,
            data,
            function(data){
                console.log("success: "  + data);
            }
        );

    });

    // refresh button pressed
    $('#refreshButton').on('click', function(e) {
        var inputArg = processInputForm();

        // adding timezone info
        inputArg['utc'] = - (today.getTimezoneOffset() / 60);

        // calculate timeRange and save it into inputArg
        let timeRange = '';

        let fromDate = new Date(inputArg['fromDate']);
        let ymdToday = [];
        let ymdFromDate = [];

        ymdToday['year'] = today.getFullYear();
        ymdFromDate['year'] = fromDate.getFullYear();

        ymdToday['month'] = today.getMonth();
        ymdFromDate['month'] = fromDate.getMonth();

        ymdToday['day'] = today.getDate();
        ymdFromDate['day'] = fromDate.getDate();

        if (ymdFromDate['year'] - ymdToday['year'] >= 5) {
            timeRange = '5Y';
        } else if (ymdFromDate['year'] - ymdToday['year'] >= 1) {
            timeRange = '1Y';
        } else if (ymdFromDate['month'] - ymdToday['month'] >= 6) {
            timeRange = '6M';
        } else if (ymdFromDate['month'] - ymdToday['month'] >= 3) {
            timeRange = '3M';
        } else if (ymdFromDate['month'] - ymdToday['month'] >= 1) {
            timeRange = '1M';
        } else {
            timeRange = '1W';
        }

        inputArg['timeRange'] = timeRange;
        requestData(inputArg);
    });
});

function processInputForm () {
    var inputArg = [];
    var form = document.getElementById("zoneForm");

    for (var i = 0; i < form.length; i++)
        inputArg[form.elements[i].name] = form.elements[i].value;
    return inputArg;
}

function requestData (argument) {
    // get
    //{pair: inputArg['pair'], timeRange: '1Y', utc: inputArg['utc']}
    $.get(
        'http://minidesk.laravel.coretekllc.com/admin/chartzone/getTable',
        {pair: argument['pair'], timeRange: argument['timeRange'], utc: argument['utc'], fromTime: argument['fromDate']}
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

    // get zones info that are stored in db.
    $.get(
        'http://minidesk.laravel.coretekllc.com/admin/chartzone/getZone',
        {pair: argument['pair']}

    ).done(function (data) {
        for (var i = 0; i < data.length; i++) {
            var table = document.getElementById("zoneTable");
            var row = table.insertRow(i + 1);

            // create button to delete zone;

            var btn = document.createElement("BUTTON");        // Create a <button> element
            btn.setAttribute("id", "zone_" + i);
            btn.setAttribute("class", "zoneRemoveButton");
            btn.setAttribute("value", "&#10005");
            // var t = document.createTextNode("&#10005");       // Create a text node
            // btn.appendChild(t);                                // Append the text to <button>
            // document.body.appendChild(btn);

            row.insertCell(0).innerHTML = i + 1;    // #
            row.insertCell(1).innerHTML = data[i][4].substr(0, 10);    // start date
            row.insertCell(2).innerHTML = data[i][2];    // high
            row.insertCell(3).innerHTML = data[i][3];    // low
            row.insertCell(4).innerHTML = btn;      // "remove" button

        }
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

    // set id for each series
    candlestick_series.id("candle");
    line_series.id("line");

    // hide line series
    line_series.enabled(false);

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

    // enable html for legend items
    candlestick_series.legendItem(true);
    line_series.legendItem(false);

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
                " <b>Delta O-C(%)</b> " + jsonData[length - this.index - 1][8] + "% <b>Range(L-H)</b> " + jsonData[length - this.index - 1][9] + " <b>Avg Vol(%)</b> " + jsonData[length - this.index - 1][10] + "%";
        } else {
            return "<span style='color:#455a64;font-weight:600'>" + this.index +
                "</span>: <b>O</b> ------ <b>H</b> ------ <b>L</b> ------ <b>C</b> ------<br/>" +
                "<b>Vol</b> ------ <b>Avg Vol</b> ------ <b>Delta O-C(%)</b> ------% <b>Range(L-H)</b> ------ <b>Avg Vol(%)</b> ------% ";
        }
    });


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
            series.legendItem().format( function(e) {
                var length = jsonData.length;
                return "<span style='color:#455a64;font-weight:600'>" + this.index +
                    "</span>: <b>Close</b> " + this.value + " <b>Delta O-C(%)</b> " + jsonData[length - this.index - 1][8];
            });
            break;

        case 'candle':
            series.legnedItem().clear()
            series.legendItem().format( function(e) {

                var length = jsonData.length;
                if (length > 0 && this.index < length && this.index > 0) {
                    return "<span style='color:#455a64;font-weight:600'>" + this.index +
                        "</span>: <b>O</b> " + this.open + " <b>H</b> " + this.high + " <b>L</b> " + this.low + " <b>C</b> " + this.close + "<br/>" +
                        "<b>Vol</b> " + jsonData[length - this.index - 1][6] + " <b>Avg Vol</b> " + jsonData[length - this.index - 1][7] +
                        " <b>Delta O-C(%)</b> " + jsonData[length - this.index - 1][8] + "% <b>Range(L-H)</b> " + jsonData[length - this.index - 1][9] + " <b>Avg Vol(%)</b> " + jsonData[length - this.index - 1][10] + "%";
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
    var yAxis = plot.yAxis();
    yAxis.orientation("right");

    // yscale
    var yScale = plot.yScale();
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
