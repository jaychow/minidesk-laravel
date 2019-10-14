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

function setYLabel(chart, amount){
    let option = chart.chartLabelType;
    let yAxis = chart.historyPlot.yAxis();
    // let controller = chart.historyPlot.annotations();
    let indicator = chart.historyPlot.priceIndicator();
    indicator.value('series-end');
    indicator.stroke("gray", 2, "2 2");
    indicator.label().background().fill("Gray");
    yAxis.orientation("right");
    let yScale = chart.historyPlot.yScale();

    if(chart.jsonHistoryData.length > 0){
        let min = parseFloat(getMinY(chart.jsonHistoryData));
        let max = parseFloat(getMaxY(chart.jsonHistoryData));
        let gap = (max - min)/10;
        let ticksArray = [];
        for(var i=-2; i<=13; i++){
            ticksArray.push((min + i * gap).toFixed(4));
        }
        yScale.minimum(ticksArray[0]);
        yScale.maximum(ticksArray[15]);
        yScale.ticks().set(ticksArray);
    }
    yAxis.scale(yScale);

    let crosshair = chart.historyPlot.crosshair();
    crosshair.yStroke(null);
    
    switch(option){
        case 'price':         
            yAxis.labels().format(function() {
                return "$" + this.value;
            });
            crosshair.yLabel().format(function() {
                return "$ " + this.tickValue.toFixed(4);
            });
            indicator.label().format(function(){
                return "$" + this.value.toFixed(4);
            });
            break;
        case 'percent':
            yAxis.labels().format(function() {
                let percent = (((this.value - chart.jsonHistoryData[0][5]) / chart.jsonHistoryData[0][5])*100).toFixed(2);
                return percent + "%";
            });
            crosshair.yLabel().format(function(){
                let percent = (((this.tickValue - chart.jsonHistoryData[0][5]) / chart.jsonHistoryData[0][5])*100).toFixed(2);
                return percent + "%";
            });
            indicator.label().format(function(){
                return "current";
            });
            break;
        case 'user':
            if(amount){
                yAxis.labels().format(function() {
                    // if(chart.tradeType === "buy")
                    //     return "$" + parseFloat((amount / this.value).toFixed(2));
                    // else
                    //     return "$" + parseFloat((amount * this.value).toFixed(2));
                    return "$" + parseFloat((amount / this.value).toFixed(2));
                });
                crosshair.yLabel().format(function() {
                //     if(chart.tradeType === "buy")
                //     return "$" + parseFloat((amount / this.value).toFixed(2));
                // else
                //     return "$" + parseFloat((amount * this.value).toFixed(2));
                    return "$" + parseFloat((amount * this.value).toFixed(2));  
                });
                indicator.label().format(function(){
                    // if(chart.tradeType === "buy")
                    //     return "$" + parseFloat((amount / this.value).toFixed(2));
                    // else
                    //     return "$" + parseFloat((amount * this.value).toFixed(2));
                    return "$" + parseFloat((amount / this.value).toFixed(2));
                    
                });
            }else{
                yAxis.labels().format(function() {
                    return "$" + this.value;
                });
                crosshair.yLabel().format(function() {
                    return "$ " + this.tickValue.toFixed(4);
                });
                indicator.label().format(function(){
                    return "$" + this.value.toFixed(4);
                });
            }
            // yAxis.labels().format(function() {
            //     return "$ " + Math.round(((this.value + 100) / 100 * chart.jsonHistoryData[0][5]) * amount).toLocaleString();
            // });
            break;
        default:
            break; 
    }
    
}

function setLegend(chart){
    let option = chart.chartType;
    switch(option){
        case 'candle':
            chart.historyPlot.legend().titleFormat(function(){
                    var date = anychart.format.dateTime(this.value, "MMM.dd.yyyy");
                    return "<span style='color:#4B4860;font-weight:600;font-size:16px;'>" +
                           date + "<br>123</span>"
                })

            chart.series.candlestick_series.legendItem().format( function(e) {
                var length = chart.jsonHistoryData.length;
                if (length > 0 && this.index < length && this.index > 0) {
                    return "<span style='color:#4B4860;'><b>OPEN</b></span> " + Number(this.open).toFixed(4) + " <b>HIGH</b> " + Number(this.high).toFixed(4) + " <b>LOW</b> " + Number(this.low).toFixed(4) + " <b>CLOSE</b> " + Number(this.close).toFixed(4) + "<br/>" +
                        "<b>VOLUME</b> " + chart.jsonHistoryData[length - this.index - 1][6].toLocaleString() + " <b>Avg Vol</b> " + chart.jsonHistoryData[length - this.index - 1][7].toLocaleString() +
                        " <b>Delta O-C(%)</b> " + Number(chart.jsonHistoryData[length - this.index - 1][8]).toFixed(2) + "% <b>Range(L-H)</b> " + Number(chart.jsonHistoryData[length - this.index - 1][9]).toFixed(4) + 
                        " <b>Avg Vol(%)</b> " + Number(chart.jsonHistoryData[length - this.index - 1][10]).toFixed(2) + "%";
                } else {
                    return "<b>OPEN</b> ------ <b>HIGH</b> ------ <b>L</b> ------ <b>C</b> ------<br/>" +
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
                    return "<b>Close</b> " + Number(this.value).toFixed(4) + " <b>Delta O-C(%)</b> " + Number(chart.jsonHistoryData[length - this.index - 1][8]).toFixed(2) + "%";

                } else {
                    return "<b>Close</b> ------ <b>Delta O-C(%)</b> ------%";
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
        setYLabel(chart);     
        chart.chart.draw();
        setYLabelColor(chart); 
    }
    
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

function setYLabelColor(chart){
    const safeColor = "#906A96";
    const warningColor = "#FFB735";
    const defaultColor = "#8b8dbb";
    if(chart.jsonHistoryData.length > 0){     
        let yScale = chart.historyPlot.yScale();
        let yAxis = chart.historyPlot.yAxis();
        let tickArray = yScale.ticks().get();
        let currentValue = chart.jsonHistoryData[0][5];
        let count = yAxis.labels().getLabelsCount();
        for (var i = 0; i < count; i++) {
            let label = yAxis.labels().getLabel(i);
            label.fontColor(warningColor);         
            if(chart.tradeType === 'sell'){
                if(tickArray[i] > currentValue)
                    label.fontColor(safeColor);
                else if(tickArray[i] < currentValue)
                    label.fontColor(warningColor);
                else
                    label.fontColor(defaultColor);
                // if(tickArray[i] > currentValue)
                //     label.fontColor(warningColor);
                // else if(tickArray[i] < currentValue)
                //     label.fontColor(safeColor);
                // else
                //     label.fontColor(defaultColor);
            }else if(chart.tradeType === 'buy'){
                if(tickArray[i] > currentValue)
                    label.fontColor(safeColor);
                else if(tickArray[i] < currentValue)
                    label.fontColor(warningColor);
                else
                    label.fontColor(defaultColor);
            }else
                label.fontColor(defaultColor);
            label.draw();
        }
    }
    
}


export { setChartMapping, setXAxis, setYLabel, showData, setYLabelColor };
