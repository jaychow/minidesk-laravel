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
    anychart.format.inputDateTimeFormat('yyyy-MM-dd HH:mm:ss');
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
    chart.chart.bounds(-40, 10, '98%', '100%');

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

    //set series color
    line_series.stroke("2 #8b8dbb");
    // candlestick_series.normal().fallingFill("#4B4860", 0.3);

    candlestick_series.normal().fallingFill("#FFB735");
    candlestick_series.normal().fallingStroke("#FFB735");
    candlestick_series.hovered().fallingFill("#FFB735");
    candlestick_series.hovered().fallingStroke("#FFB735");
    candlestick_series.selected().fallingFill("#FFB735");
    candlestick_series.selected().fallingStroke("#FFB735");
  
    candlestick_series.normal().risingFill("#906A96");
    candlestick_series.normal().risingStroke("#906A96");
    candlestick_series.hovered().risingFill("#906A96");
    candlestick_series.hovered().risingStroke("#906A96");
    candlestick_series.selected().risingFill("#906A96");
    candlestick_series.selected().risingStroke("#906A96");
    // init legend setting
    chart.historyPlot.legend(true);
    chart.historyPlot.legend().title().useHtml(true);
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
    // yAxis.stroke({color:'#4B4860'});
    yAxis.labels().fontColor("#8b8dbb");
    setYLabel(chart);

    // disable tooltip
    chart.chart.tooltip(false);

    // disable scroller
    chart.chart.scroller().enabled(false);

    //chart perloader init
    chart.preloader = Anychart.ui.preloader();
    chart.preloader.render();
    document.getElementsByClassName('anychart-loader-rotating-plane')[0].innerHTML = `
        <img src="img/frontend/hedgedesk.gif"
        style="max-width:100%;
        max-height:100%;">
        `;
    // chart.preloader.render(el);  
    chart.chart.container("chart");
    console.log('chartInit!');

    // init test data
    // Anychart.data.loadCsvFile('https://cdn.anychart.com/csv-data/csco-daily.csv', function (data) {
    //     showData(data, chart);
    // });

    // chart.chart.container('chart').draw();
}

export { chartInit };
