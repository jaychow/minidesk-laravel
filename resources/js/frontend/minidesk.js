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

$(document).ready(function(){
    // Create chart variables



    // Click events: submit button in chart
    $('#chartSubmit').on('click',function(e){
        var data = $('#chartInput').serialize();

        $.get(
            '/chart/getTable',
            {pair: data, timeRange: '1Y'},
        ).done(function(data){
            var data =$.parseJSON(data);
            console.log(data);
            renderDataToChart(data);
        }).fail(function(data){
            console.log("Error: " + data);
        }).always(function(data){

        });
    });

    // prevent from the button can only submit once
    $('#chartInput').on('submit',function(e){
        e.preventDefault();
    });


    // Range selector button is pressed
    $('#chart-rangeselectorContainer').on('click', function(e) {
       if (e.target != e.currentTarget) {
           var clickedItem = e.target.textContent;
           alert(clickedItem);
       }
    });

function renderDataToChart (data) {
    // Selector Range Definition
    var customRanges = [
        {
            'text': '1D',
            'type': 'unit',
            'unit': 'day',
            'count': 1,
            'anchor': 'last-data'
        },
        {
            'text': '1W',
            'type': 'unit',
            'unit': 'day',
            'count': 7,
            'anchor': 'last-data'
        },
        {
            'text': '1M',
            'type': 'unit',
            'unit': 'day',
            'count': 31,
            'anchor': 'last-data'
        },
        {
            'text': '6M',
            'type': 'unit',
            'unit': 'day',
            'count': 186,    // 31 * 6 = 186
            'anchor': 'last-data'
        },
        {
            'text': '1Y',
            'type': 'unit',
            'unit': 'year',
            'count': 1,
            'anchor': 'last-data'
        },
        {
            'text': '5Y',
            'type': 'unit',
            'unit': 'year',
            'count': 5,
            'anchor': 'last-data'
        }
    ];

    // Splitting data
    var dataSplit = [];

    while (data.length > 0)
        dataSplit.push(data.splice(0, 1000)); // split data into array whose size is 1000

    // Clear dataTable;
    dataTable.remove();

    // Adding data
    var i;
    for (i = 0; i < dataSplit.length; i++) {
        dataTable.addData(dataSplit[i]);
    }

    // map loaded data for the ohlc series
    var mapping = dataTable.mapAs({
        'open': 2,
        'high': 3,
        'low': 4,
        'close': 5,
        'value': 6
    });

    // set chart title
    chart.title('it work right.');

    // create first plot on the chart and set settings
    var plot = chart.plot(0);
    plot.height('75%')
        .yGrid(true)
        .xGrid(true)
        .yMinorGrid(true)
        .xMinorGrid(true);

    // create candlestick series
    var series = plot.candlestick(mapping);
    series.name('NYMEX Crude Oil Futures');
    series.legendItem().iconType('rising-falling');

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
        },
        {
            date: '2008-08-20',
            description: 'Global financial collapse'
        },
        {
            date: '2009-02-05',
            description: 'OPEC cuts production targets 4.2 mmbpd'
        },
        {
            date: '2009-11-15',
            description: 'Greece\'s debt crisis'
        },
        {
            date: '2011-03-11',
            description: 'Japan earthquake'
        },
        {
            date: '2014-12-01',
            description: 'Russian financial crisis'
        },
        {
            date: '2015-03-15',
            description: 'OPEC production quota unchanged'
        },
        {
            date: '2017-11-15',
            description: 'Just fot fun !'
        }
    ]);

    // create second plot
    var volumePlot = chart.plot(1);
    // set yAxis labels formatter
    volumePlot.yAxis().labels().format('{%Value}{scale:(1000)(1)|(k)}');
    // set crosshair y-label formatter
    volumePlot.crosshair().yLabel().format('{%Value}{scale:(1000)(1)|(k)}');

    // create volume series on the plot
    var volumeSeries = volumePlot.column(mapping);
    // set series settings
    volumeSeries.name('Volume');

    // create scroller series with mapped data
    chart.scroller().area(mapping);
    /*
    // set container id for the chart
    chart.container('chart');
    // initiate chart drawing
    chart.draw();

    // create range picker
    var rangePicker = anychart.ui.rangePicker();  // rangePicker included in chart
    rangePicker.render(document.getElementById("chart-rangepickerContainer"));
    // init range picker
    //rangePicker.render(chart);

    // create range selector
    var rangeSelector = anychart.ui.rangeSelector();    // rangeSelector included in chart
    rangeSelector.render(document.getElementById('chart-rangeselectorContainer'));
    rangeSelector.ranges(customRanges);
    //rangeSelector.addEventListener("click", identifyClickedButton, false);
    // init range selector
    //rangeSelector.render(chart);
    */

    var rangePicker = anychart.ui.rangePicker();
    var rangeSelector = anychart.ui.rangeSelector();

    // specify which chart range selector controls
    rangeSelector.target(chart);
    rangePicker.target(chart);

    // Render the range selection controls into containers on a page
    rangeSelector.render(document.getElementById("chart-rangeselectorContainer"));
    rangePicker.render(document.getElementById("chart-rangepickerContainer"));

    // Customize range selector
    rangeSelector.ranges(customRanges);

    chart.container("chart");
    chart.draw();
}