//---------------------------------------------------------------
//                      GLOBAL VARIABLES
//---------------------------------------------------------------
// Create chart variables
// create stock chart
var chart = anychart.stock();

// create data table on loaded data
var dataTable = anychart.data.table();

//---------------------------------------------------------------
//                      INITIAL CHART
//---------------------------------------------------------------


//---------------------------------------------------------------
//                      OTHER FUNCTION
//---------------------------------------------------------------
$(document).ready(function() {
    var inputArg;

    $('#pairsOption').on('change', function(e) {
        inputArg = processInputForm();
        inputArg['timeRange'] = '1W';

        // adding timezone info
        var d = new Date();
        inputArg['utc'] = - (d.getTimezoneOffset() / 60);

        // request GET/POST to backend
        requestData(inputArg);
    });

    // prevent from the button can only submit once
    $('#chartInput').on('submit', function(e) {
        e.preventDefault();

        debugger
    });

    // timescale buttons pressed
    //$('#chart-rangeselectorContainer').on('click', function(e) {
    $('#chart-timescaleButtons').on('click', function(e) {
        if (e.target != e.currentTarget) {
            var clickedItem = e.target.textContent;
            inputArg['timeRange'] = clickedItem;
            console.log(clickedItem);
            debugger
            requestData(inputArg);
        }
    });


});
function requestData (argument) {
    //{pair: inputArg['pair'], timeRange: '1Y', utc: inputArg['utc']}
    $.get(
        '/chart/getTable',
        {pair: argument['pairsOption'], timeRange: argument['timeRange'], utc: argument['utc']}
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
    debugger;
    return inputArg;
}

function initiateChartSetting (data) {
    // // Selector Range Definition
    // var customRanges = [
    //     {
    //         'text': '1W',
    //         'type': 'unit',
    //         'unit': 'day',
    //         'count': 7,
    //         'anchor': 'last-data'
    //     },
    //     {
    //         'text': '1M',
    //         'type': 'unit',
    //         'unit': 'day',
    //         'count': 31,
    //         'anchor': 'last-data'
    //     },
    //     {
    //         'text': '3M',
    //         'type': 'unit',
    //         'unit': 'day',
    //         'count': 93,
    //         'anchor': 'last-data'
    //     },
    //     {
    //         'text': '6M',
    //         'type': 'unit',
    //         'unit': 'day',
    //         'count': 186,    // 31 * 6 = 186
    //         'anchor': 'last-data'
    //     },
    //     {
    //         'text': '1Y',
    //         'type': 'unit',
    //         'unit': 'year',
    //         'count': 1,
    //         'anchor': 'last-data'
    //     },
    //     {
    //         'text': '5Y',
    //         'type': 'unit',
    //         'unit': 'year',
    //         'count': 5,
    //         'anchor': 'last-data'
    //     }
    // ];

    // map loaded data for the ohlc series
    var mapping = dataTable.mapAs({
        'open': 2,
        'high': 3,
        'low': 4,
        'close': 5,
        'value': 6
    });

    // Put the data into data table
    dataTable.addData(data);

    // create first plot on the chart and set settings
    var plot = chart.plot(0);

    plot.height('75%')
        .yGrid(false)
        .xGrid(false)
        .yMinorGrid(false)
        .xMinorGrid(false);

    // create candlestick series
    var series = plot.candlestick(mapping);
    series.name('Candlestick');
    series.legendItem().iconType('rising-falling');

    // create line series
    plot.line()
        .data(dataTable.mapAs({
            'value': 5
        }))
        .name('Line')
        .stroke('1 #6f3448');



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
    /*
    //var rangePicker = anychart.ui.rangePicker();
    var rangeSelector = anychart.ui.rangeSelector();

    // specify which chart range selector controls
    rangeSelector.target(chart);
    //rangePicker.target(chart);

    // Render the range selection controls into containers on a page
    rangeSelector.render(document.getElementById("chart-rangeselectorContainer"));
    //rangePicker.render(document.getElementById("chart-rangepickerContainer"));

    // Customize range selector
    rangeSelector.ranges(customRanges);
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