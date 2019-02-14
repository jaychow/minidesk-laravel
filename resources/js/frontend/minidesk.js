//---------------------------------------------------------------
//                      GLOBAL VARIABLES
//---------------------------------------------------------------
// Create chart variables
// create stock chart
var chart = anychart.stock();

// create data table on loaded data
var dataTable = anychart.data.table();

// create plot for chart
var plot;

//---------------------------------------------------------------
//                      INITIAL CHART
//---------------------------------------------------------------


//---------------------------------------------------------------
//                      OTHER FUNCTION
//---------------------------------------------------------------
$(document).ready(function() {
    var inputArg;

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

    // timescale buttons pressed
    $('#timescaleButton').on('click', function(e) {
        if (e.target != e.currentTarget) {
            var clickedItem = e.target.textContent;
            inputArg['timescale'] = clickedItem;
            console.log(clickedItem);
            requestData(inputArg);
        }
    });

    // type of graph
    $('#candleLineButton').on('click', function(e) {
        if (e.target != e.currentTarget) {
            var clickedItem = e.target.value;
            inputArg['type'] = clickedItem;
            console.log(clickedItem);
            switchType(clickedItem)
        }
    });

});
function requestData (argument) {
    //{pair: inputArg['pair'], timeRange: '1Y', utc: inputArg['utc']}
    $.get(
        '/chart/getTable',
        {pair: argument['pair'], timeRange: argument['timescale'], utc: argument['utc']}
    ).done(function (data) {
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

function processInputForm () {
    var inputArg = [];
    var form = document.getElementById("chartInput");

    for (var i = 0; i < form.length; i++)
        inputArg[form.elements[i].name] = form.elements[i].value;
    return inputArg;
}

function initiateChartSetting (data) {
    // map loaded data for candlestick/line
    var candle_mapping = dataTable.mapAs({
        'open': 2,
        'high': 3,
        'low': 4,
        'close': 5,
        'value': 6
    });

    var line_mapping = dataTable.mapAs({
        'value': 5
    })

    // Put the data into data table
    dataTable.addData(data);

    // create first plot on the chart and set settings
    plot = chart.plot(0);

    plot.height('75%')
        .yGrid(false)
        .xGrid(false)
        .yMinorGrid(false)
        .xMinorGrid(false);

    // create candlestick and line series
    candlestick_series = plot.candlestick(candle_mapping);
    line_series = plot.line(line_mapping)

    // set id for each series
    candlestick_series.id("candle")
    line_series.id("line")

    /*
    // set settings for event markers
    var eventMarkers = plot.eventMarkers();
    // set markers data
    eventMarkers.data([{
            date: '2001-09-11',
            description: '9-11 attacks'
        },
        {
            date: '2003-03-20',
            description: 'Iraq War'
        }
    ]);
    */
    chart.container("chart");
    chart.draw();
}

function renderDataToChart (data) {
    console.log('REFRESH!');
    // Clear dataTable;
    dataTable.remove();
    dataTable.addData(data);
}

function switchType(type) {
    for (var i = 0; i < plot.getSeriesCount(); i++) {
        plot.getSeriesAt(i).enabled(false);
    }
    var series = plot.getSeries(type);
    series.enabled(true);
}