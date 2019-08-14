function setChartMapping(chart){
    let option = chart.chartType;
    switch(option){
        case 'candle':
            chart.series.candlestick_series.enabled(true);
            chart.series.line_series.enabled(false);
            setLegend(chart);
            break;
        case 'line':
            chart.series.candlestick_series.enabled(false);
            chart.series.line_series.enabled(true);
            setLegend(chart);
            break;
        default:
            chart.series.candlestick_series.enabled(true);
            chart.series.line_series.enabled(false);
            setLegend(chart);
            break;
    }
}

function setXAxis(chart){
    let xAxis = chart.historyPlot.xAxis();
    xAxis.orientation("bottom");  
    // setting label on x-axis
    // todo: scale with time option
    xAxis.labels().fontColor("#8b8dbb");
    // xAxis.labels().format(function() {
    //     return anychart.format.dateTime(this.value, "MMM d, yyyy", utcOffset);
    // });
}

function setYLabel(chart){
    let option = chart.chartLabelType;
    let yAxis = chart.historyPlot.yAxis();
    yAxis.orientation("right");
    yAxis.labels().fontColor("#8b8dbb");

    let yScale = chart.historyPlot.yScale();
    let crosshair = chart.historyPlot.crosshair();
    crosshair.yStroke(null);
    switch(option){
        case 'price':
            yScale.comparisonMode("percent");
            yScale.compareWith("seriesEnd");
            yScale.ticks().interval(1);
            yAxis.labels().format(function() {
                var currency = (this.value + 100) / 100 * chart.jsonHistoryData[0][5];     
                return "$ " + (Math.round(currency * 10000) / 10000).toFixed(4);
            });

            crosshair.yLabel().format(function() {
                return "$ " + this.tickValue.toFixed(4);
            });
            break;
        case 'percent':
            yScale.comparisonMode("percent");
            yScale.compareWith("seriesEnd");
            yScale.ticks().interval(1);
            yAxis.labels().format("{%value}{decimalsCount:2, zeroFillDecimals:true} %");
            crosshair.yLabel().format(function(){
                let percent = (((this.tickValue - chart.jsonHistoryData[0][5]) / chart.jsonHistoryData[0][5])*100)
                return percent.toFixed(2) + "%";
            });
            break;
        case 'user':
            // yAxis.labels().format(function() {
            //     return "$ " + Math.round(((this.value + 100) / 100 * chart.jsonHistoryData[0][5]) * amount).toLocaleString();
            // });
            break;
        default:
            break; 
    }
    yAxis.scale(yScale);
}

function setLegend(chart){
    let option = chart.chartType;
    switch(option){
        case 'candle':
            chart.series.candlestick_series.legendItem().format( function(e) {
                var length = chart.jsonHistoryData.length;
                if (length > 0 && this.index < length && this.index > 0) {
                    return "<span style='color:#455a64;font-weight:600'>" + this.index +
                        "</span>: <b>O</b> " + Number(this.open).toFixed(4) + " <b>H</b> " + Number(this.high).toFixed(4) + " <b>L</b> " + Number(this.low).toFixed(4) + " <b>C</b> " + Number(this.close).toFixed(4) + "<br/>" +
                        "<b>Vol</b> " + chart.jsonHistoryData[length - this.index - 1][6].toLocaleString() + " <b>Avg Vol</b> " + chart.jsonHistoryData[length - this.index - 1][7].toLocaleString() +
                        " <b>Delta O-C(%)</b> " + Number(chart.jsonHistoryData[length - this.index - 1][8]).toFixed(2) + "% <b>Range(L-H)</b> " + Number(chart.jsonHistoryData[length - this.index - 1][9]).toFixed(4) + 
                        " <b>Avg Vol(%)</b> " + Number(chart.jsonHistoryData[length - this.index - 1][10]).toFixed(2) + "%";
                } else {
                    return "<span style='color:#455a64;font-weight:600'>" + this.index +
                        "</span>: <b>O</b> ------ <b>H</b> ------ <b>L</b> ------ <b>C</b> ------<br/>" +
                        "<b>Vol</b> ------ <b>Avg Vol</b> ------ <b>Delta O-C(%)</b> ------% <b>Range(L-H)</b> ------ <b>Avg Vol(%)</b> ------% ";
                }

            });
            chart.series.candlestick_series.legendItem(true);         
            chart.series.line_series.legendItem(false);
            break;
        case 'line':
            chart.series.line_series.legendItem().format( function(e) {
                var length = chart.jsonHistoryData.length;
                if (length > 0 && this.index < length && this.index > 0) {
                    return "<span style='color:#455a64;font-weight:600'>" + this.index +
                        "</span>: <b>Close</b> " + Number(this.value).toFixed(4) + " <b>Delta O-C(%)</b> " + Number(chart.jsonHistoryData[length - this.index - 1][8]).toFixed(2) + "%";

                } else {
                    return "<span style='color:#455a64;font-weight:600'>" + this.index +
                        "</span>: <b>Close</b> ------ <b>Delta O-C(%)</b> ------%";
                }
            });
            chart.series.candlestick_series.legendItem(false);
            chart.series.line_series.legendItem(true);
            break;
        default:
            chart.series.candlestick_series.legendItem(true);         
            chart.series.line_series.legendItem(false);
            break;
    }
}

function showData(chart){
    if(!chart.jsonHistoryData){
        chart.historyDataTable.addData([]);
        // chart.enabled(false);
    }else{
        chart.historyDataTable.remove();
        chart.historyDataTable.addData(chart.jsonHistoryData);
        chart.chart.container('chart').draw();
    }
    
}

export { setChartMapping, setXAxis, setYLabel, showData };
