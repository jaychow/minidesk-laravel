import Anychart from 'anychart';
import { setChartMapping, setXAxis, setYLabel} from './chart_setting.js'
// import chart_style from './chart_style';

const utcOffset = new Date().getTimezoneOffset();

function chartInit(chart, el) {
    // Anychart.format.locales.default.numberLocale.decimalsCount = 4;
    // Anychart.format.locales.default.numberLocale.scale = true;
    // Anychart.fromJson not support chart type "stock" yet
    // chart.chart = new Anychart.fromJson(chart_style);

    //create new chart object
    chart.historyDataTable = Anychart.data.table();   
    chart.chart = Anychart.stock();

    chart.historyPlot = chart.chart.plot(0);
    chart.historyPlot.height('100%')
                    .width('100%')
                    .yGrid(false)
                    .xGrid(false)
                    .yMinorGrid(false)
                    .xMinorGrid(false);

    // chart position
    chart.chart.bounds(0, 10, '90%', '100%');

    let candle_mapping = chart.historyDataTable.mapAs({
        'open': 2,
        'high': 3,
        'low': 4,
        'close': 5
    });

    // History data (line)
    let line_mapping = chart.historyDataTable.mapAs({
        'value': 5
    });
    //init two chart series
    const candlestick_series = chart.historyPlot.candlestick(candle_mapping);
    const line_series = chart.historyPlot.line(line_mapping);
    candlestick_series.id("candle");
    line_series.id("line");

    // chart type
    chart.series = {
        candlestick_series: candlestick_series,
        line_series: line_series
    };

    // init legend setting
    chart.historyPlot.legend(true);
    chart.historyPlot.legend().removeAllListeners();
    chart.historyPlot.legend().height(50);
    chart.historyPlot.legend().paginator(false);
    chart.historyPlot.legend().iconSize(0);
    candlestick_series.legendItem().useHtml(true);
    line_series.legendItem().useHtml(true);
    
    // init chart type with candle
    setChartMapping(chart);

    setXAxis(chart);

    let yAxis = chart.historyPlot.yAxis();
    yAxis.labels().fontColor("#8b8dbb");
    setYLabel(chart);

    // disable tooltip
    chart.chart.tooltip(false);

    // disable scroller
    chart.chart.scroller().enabled(false);

    //chart perloader init
    chart.preloader = Anychart.ui.preloader();
    chart.preloader.render(el);  
    chart.chart.container(el);
    console.log('chartInit');

    // init test data
    // Anychart.data.loadCsvFile('https://cdn.anychart.com/csv-data/csco-daily.csv', function (data) {
    //     showData(data, chart);
    // });

    // chart.chart.container('chart').draw();
}



function getMinY(data) {
    if(data.length > 0)
        return data.reduce((min, p) => p[5] < min ? p[5] : min, data[0][5]);
    else
        return;
}

function getMaxY(data) {
    if(data.length > 0)
        return data.reduce((max, p) => p[5] > max ? p[5] : max, data[0][5]);
    else
        return;
}



export { chartInit };
