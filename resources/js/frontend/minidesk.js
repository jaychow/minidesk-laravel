anychart.onDocumentReady(function() {
// The data used in this sample can be obtained from the CDN
    // https://cdn.anychart.com/samples/stock-event-markers/stock-chart-with-event-markers/data.csv
    anychart.data.loadCsvFile('https://cdn.anychart.com/samples/stock-event-markers/stock-chart-with-event-markers/data.csv', function(data) {
        // create data table on loaded data
        var dataTable = anychart.data.table();
        dataTable.addData(data);

        // map loaded data for the ohlc series
        var mapping = dataTable.mapAs({
            'open': 1,
            'high': 2,
            'low': 3,
            'close': 4,
            'value': 7
        });

        // create stock chart
        var chart = anychart.stock();

        // set chart title
        chart.title('WTI Crude Oil Prices');

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

        // set container id for the chart
        chart.container('chart');
        // initiate chart drawing
        chart.draw();

        // create range picker
        var rangePicker = anychart.ui.rangePicker();
        // init range picker
        rangePicker.render(chart);

        // create range selector
        var rangeSelector = anychart.ui.rangeSelector();
        // init range selector
        rangeSelector.render(chart);
    });
});

$(document).ready(function(){
    $('#chartSubmit').on('click',function(e){
        var data = $('#chartInput').serialize();

        $.get(
            '/test',
            data
        ).done(function(data){
            var data =$.parseJSON(data);
            console.log(data);
        }).fail(function(data){
            console.log("Error: " + data);
        }).always(function(data){

        });
    });
    $('#chartInput').on('submit',function(e){
        e.preventDefault();
    });
});
