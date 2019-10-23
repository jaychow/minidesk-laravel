<template>
    <div class="info-select-list">
        <div class="select-info" v-for="(currency, i) in infoPagesData.selectList">
            
            <div class="info-title"> 
                <div class="currency-title">{{ currency }} </div>
                <div class="currency-descript">
                    <div class="region">{{ infoPagesData.descriptList[currency]["region"]}}</div>
                    <div class="unit">{{ infoPagesData.descriptList[currency]["unit"]}}</div>
                </div>
            </div>
            <div v-bind:id="minichartClass(i)" class="minichart" ref="minichart"></div>
            <div class="now-price-area">
                <div class="now-price-button">
                    <button class="submitButton" id="info-select-button"> {{ formatPrice(infoPagesData.infoPagesPriceData[infoPagesData.infoPair[i]][0][5]) }} </button>
                </div>
                <div class="now-price-change">
                    {{ formatChange(infoPagesData.infoPagesPriceData[infoPagesData.infoPair[i]][0][8], infoPagesData.infoPagesPriceData[infoPagesData.infoPair[i]][0][9], 3) }}
                </div>
            </div>
            
        </div>
        
    </div>
</template>

<script>
import Anychart from 'anychart'
import { mapGetters, mapActions } from 'vuex'

export default {
    name: "info-select-list",
    data(){
        return{
            
        }
    },
    methods:{
        formatPrice(price, digit=4){
            price = parseFloat(price)
            return price.toFixed(digit)
        },
        formatChange(priceChange, priceRange, changeDigit=3, rangeDigit=3){
            var change = parseFloat(priceChange).toFixed(changeDigit)
            var range = parseFloat(priceRange).toFixed(rangeDigit)
            var s = ""
            if(change >= 0)
                s = "+" + change.toString() + "%"
            else
                s = change.toString() + "%"
            s += " " + range.toString()
            return s
        },
        minichartClass(index){
            var c = "minichart_" + index
            return c
        },
        draw(){
            this.$nextTick(function(){
                for(var i=0;i<this.infoPagesData.selectList.length; i++){
                    console.log(this.$refs.minichart[i])
                    console.log("draw " + i)
                    var historyDataTable = Anychart.data.table();  
                    var chart = Anychart.stock();
                    chart.tooltip(false);
                    chart.scroller().enabled(false);
                    chart.bounds( "-50%", "-10%", '150%', '100%');
                    chart.crosshair(false);
                    var historyPlot = chart.plot(0);
                    historyPlot.xAxis(false);
                    historyPlot.yAxis(false);
                    historyPlot.height('100%')
                        .width('100%');

                    historyPlot.legend(false);
                    
                    var line_mapping = historyDataTable.mapAs({
                        'value': 5
                    });
                    const line_series = historyPlot.line(line_mapping);
                    line_series.id("line");
                    line_series.stroke("1 #8b8dbb");
                    historyDataTable.addData(this.infoPagesData.infoPagesPriceData[this.infoPagesData.infoPair[i]])
                    chart.container("minichart_"+i)

                    chart.draw()
                }
            })
        },
    },
    computed: {
        ...mapGetters(['infoPagesData'])
    },
    watch:{
        infoPagesData: function(){
            this.draw()
        }
    },
}
</script>