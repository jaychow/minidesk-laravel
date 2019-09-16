<template>
    <div class="chart" id="chart" v-show="showChart === true"></div> 
</template>

<script>
    import Anychart from 'anychart'
    import { mapGetters, mapActions } from 'vuex'
    import chartApi from '../api/chart'
    import { chartInit } from '../store/modules/chart/init.js'
    import { setChartMapping, setXAxis, setYLabel, showData, setYLabelColor } from '../store/modules/chart/chart_setting.js'
    export default {
        name: 'chart',
        data() {
            return {
                chart: {
                    chart: null,
                    chartType: 'candle',
                    chartLabelType: 'price',
                    tradeType: '',
                    historyDataTable: null,
                    historyPlot: null,
                    jsonHistoryData: [],
                    jsonZonesData: [],
                    singleCandle: []
                },              
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
                updateIntervalCounts: {},
                showChart: true
            }
        },
        mounted() {
            console.log("Chart mounted")
            chartApi.getRefreshInterval((data, err) =>{
                if(!err){
                    if(data !== "")
                        this.$store.dispatch('setRefreshInterval', data)
                    else
                        this.$store.dispatch('setRefreshInterval', "M10")
                }
                this.initUpdateInterval()
            })
            console.log('set updateIntervalCounts')
            chartInit(this.chart, this.$el);
            this.showChart = false;
            
            console.log('finish chart init');
        },
        methods: {
            initUpdateInterval() {
                this.updateCandleInterval = this.intervalMapToMinutes[this.refreshInterval]
                this.updateIntervalCounts['1W'] = 60 / this.updateCandleInterval // 60m/candle, need updateIntervalCounts['1W'] time to update 1 candle until it is set.
                this.updateIntervalCounts['1M'] = 60 * 4 / this.updateCandleInterval // 240m/candle, increase 1 candle every intervals.
                this.updateIntervalCounts['3M'] = 60 * 24 / this.updateCandleInterval // 60m*24/candle, increase 1 candle every intervals.
                this.updateIntervalCounts['1Y'] = 60 * 24 * 7 / this.updateCandleInterval // 1W/candle, increase 1 candle every intervals.
                this.updateIntervalCounts['5Y'] = 60 * 24 * 31 / this.updateCandleInterval // 1M/candle, increase 1 candle every intervals.
            },
        },
        watch: {
            chartData: function() {
                this.showChart = true;
                this.chart.jsonHistoryData = this.chartData.jsonHistoryData;
                if(this.chart.chart){
                    showData(this.chart)
                }
            },
            chartType: function(){
                this.chart.chartType = this.chartType;
                setChartMapping(this.chart);
            },
            chartYLabelType: function(){
                this.chart.chartLabelType = this.chartYLabelType;
                setYLabel(this.chart);
                setYLabelColor(this.chart);
            },
            tradeType: function(){
                this.chart.tradeType = this.tradeType;
                setYLabelColor(this.chart);
            },
            loading: function(){
                this.showChart = true;                
                if(this.chart.preloader){
                    if(this.loading){
                        this.chart.preloader.visible(true);
                    }else{
                        this.chart.preloader.visible(false);
                    }
                }
            }
        },
        beforeDestroy() {
            if (this.chart) {
                this.chart.dispose()
                this.chart = null
            }
        },
        computed: {
            ...mapGetters([
                'chartSettings',
                'chartData',
                'chartType',
                'chartYLabelType',
                'tradeType',
                'loading',
                'homeCurrency', 
                'foreignCurrency',
                'refreshInterval'
            ])
        },

    }
</script>
