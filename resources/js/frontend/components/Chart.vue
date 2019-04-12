<template>
    <div class="chart" id="chart"></div>
</template>

<script>
    export default {
        name: 'chart',
        props: [
            'ticketInputs'
        ],
        data() {
            return {
                jsonHistoryData: [],
                chartSettings: {},
                intervalMapToMinutes: {
                    "S5": 5 / 60,
                    "S10": 10 / 60,
                    "S15": 15 / 60,
                    "S30": 30 / 60,
                    "M1": 1,
                    "M2": 2,
                    "M4": 4,
                    "M10": 10,
                    "M15": 15,
                    "M30": 30,
                    "H1": 60
                },
                updateCandleInterval: 1,
                updateIntervalCounts: {}
        }
        },
        mounted() {
            console.log("Chart mounted");
            this.initUpdateInterval()

            //this.initChart();
        },
        methods: {
            initUpdateInterval() {
                this.updateCandleInterval = this.intervalMapToMinutes[this.chartSettings['refreshInterval']];
                this.updateIntervalCounts['1W'] = 60 / this.updateCandleInterval; // 60m/candle, need updateIntervalCounts['1W'] time to update 1 candle until it is set.
                this.updateIntervalCounts['1M'] = 60 * 4 / this.updateCandleInterval; // 240m/candle, increase 1 candle every intervals.
                this.updateIntervalCounts['3M'] = 60 * 24 / this.updateCandleInterval; // 60m*24/candle, increase 1 candle every intervals.
                this.updateIntervalCounts['1Y'] = 60 * 24 * 7 / this.updateCandleInterval; // 1W/candle, increase 1 candle every intervals.
                this.updateIntervalCounts['5Y'] = 60 * 24 * 31 / this.updateCandleInterval; // 1M/candle, increase 1 candle every intervals.
            },
            initChart() {
                const chart = anychart.stock();
                const historyDataTable = anychart.data.table();
                const stage = acgraph.create('chart');
                //===========================================================
                //                   Data Manipulation
                //===========================================================

                // History data (candlestick)
                const candle_mapping = historyDataTable.mapAs({
                    'open': 2,
                    'high': 3,
                    'low': 4,
                    'close': 5
                });

                // History data (line)
                const line_mapping = historyDataTable.mapAs({
                    'value': 5
                });

                // Put the data into data table
                historyDataTable.addData(this.jsonHistoryData);

                //===========================================================
                //          Plot Postition, Height, and Width Settings
                //===========================================================

                // create first plot on the chart and set settings
                const historyPlot = chart.plot(0);

                historyPlot.height('100%')
                    .width('100%')
                    .yGrid(false)
                    .xGrid(false)
                    .yMinorGrid(false)
                    .xMinorGrid(false);


                // chart position
                chart.bounds(0, 0, '90%', '100%');

                // setting portion of plot in the same array (2/3, 1/3)
                // historyPlot.bounds(0, 0, '66%', '80%');
                // futureTrendPlot.bounds('66%', 0, '34%', '80%');// chart position

                // create candlestick and line series
                const candlestick_series = historyPlot.candlestick(candle_mapping);
                const line_series = historyPlot.line(line_mapping);

                // set id for each series
                candlestick_series.id("candle");
                line_series.id("line");

                // hide line series
                line_series.enabled(false);

                //===========================================================
                //          X-axis and Y-axis (and labels)
                //===========================================================

                // x-axis(date-time) format settings for history plot
                const xAxis = historyPlot.xAxis();
                xAxis.orientation("bottom");

                // setting label on x-axis
                xAxis.labels().format(function () {
                    return anychart.format.dateTime(this.value, "MMM d, yyyy", utcOffset);
                });
                xAxis.labels().fontColor("#8b8dbb");

                // TODO use "switchYaxisType()" function
                // y-scale for both history and future trend plot (default: % mode)
                const yScale = historyPlot.yScale();
                yScale.comparisonMode("percent");
                yScale.compareWith("seriesEnd");
                yScale.ticks().interval(1);

                // y-axis(price) format settings for history plot
                const yAxis = historyPlot.yAxis();

                yAxis.orientation("right");
                yAxis.scale(yScale);
                yAxis.labels().format(this.formatYAxis);
                yAxis.labels().fontColor("#8b8dbb");

                //===========================================================
                //                      Crosshair
                //===========================================================

                // enable/disable the crosshair
                historyPlot.crosshair(true);

                // configure the crosshair
                historyPlot.crosshair().xLabel().format(function () {
                    // TODO reformat dateTime
                    // return this.value;

                    return anychart.format.dateTime(this.value, "MMM d, yyyy hh:mm", utcOffset);
                });
                historyPlot.crosshair().yLabel().format(this.formatYLabel);
                historyPlot.crosshair().xLabel().fontColor("white");
                historyPlot.crosshair().xLabel().background({
                    fill: "#4a475f",
                    stroke: "#4a475f"
                });

                historyPlot.crosshair().xLabel().fontColor("white");
                historyPlot.crosshair().yLabel().background({
                    fill: "#4a475f",
                    stroke: "#4a475f"
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
                candlestick_series.legendItem().format(this.formatLegend);

                //===========================================================
                //                   Disable
                //===========================================================

                // disable tooltip
                chart.tooltip(false);

                // disable scroller
                chart.scroller().enabled(false);

                chart.container(stage);
                chart.draw();
            },
            formatLegend() {
                const length = this.jsonHistoryData.length;
                if (length > 0 && this.index < length && this.index > 0) {
                    return "<span style='color:#455a64;font-weight:600'>" + this.index +
                        "</span>: <b>O</b> " + Number(this.open).toFixed(4) + " <b>H</b> " + Number(this.high).toFixed(4) + " <b>L</b> " + Number(this.low).toFixed(4) + " <b>C</b> " + Number(this.close).toFixed(4) + "<br/>" +
                        "<b>Vol</b> " + this.jsonHistoryData[length - this.index - 1][6].toLocaleString() + " <b>Avg Vol</b> " + this.jsonHistoryData[length - this.index - 1][7].toLocaleString() +
                        " <b>Delta O-C(%)</b> " + Number(this.jsonHistoryData[length - this.index - 1][8]).toFixed(2) + "% <b>Range(L-H)</b> " + Number(this.jsonHistoryData[length - this.index - 1][9]).toFixed(4) + " <b>Avg Vol(%)</b> " + Number(this.jsonHistoryData[length - this.index - 1][10]).toFixed(2) + "%";
                } else {
                    return "<span style='color:#455a64;font-weight:600'>" + this.index +
                        "</span>: <b>O</b> ------ <b>H</b> ------ <b>L</b> ------ <b>C</b> ------<br/>" +
                        "<b>Vol</b> ------ <b>Avg Vol</b> ------ <b>Delta O-C(%)</b> ------% <b>Range(L-H)</b> ------ <b>Avg Vol(%)</b> ------% ";
                }
            },
            formatYAxis() {
                if (this.jsonHistoryData.length > 0) {
                    const currency = (this.value + 100) / 100 * this.jsonHistoryData()[0][5];
                    return "$ " + (Math.round(currency * 10000) / 10000).toFixed(4);
                }
            },
            formatYLabel() {
                if (this.jsonHistoryData.length > 0) {
                    const currency = (this.value + 100) / 100 * this.jsonHistoryData()[0][5];
                    return (Math.round(currency * 10000) / 10000).toFixed(4);
                }
            }
        }
    }
</script>
