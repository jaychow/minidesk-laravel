<template>
    <div class="chart" id="chart"></div> 
</template>

<script>
    import Anychart from 'anychart'
    import { mapGetters, mapActions } from 'vuex'
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
            }
        },
        mounted() {
            console.log("Chart mounted")
            // console.log(chartInit)
            chartInit(this.chart);

            console.log('finish chart init');
        },
        methods: {
            initUpdateInterval() {
                this.updateCandleInterval = this.intervalMapToMinutes[this.chartSettings['refreshInterval']]
                this.updateIntervalCounts['1W'] = 60 / this.updateCandleInterval // 60m/candle, need updateIntervalCounts['1W'] time to update 1 candle until it is set.
                this.updateIntervalCounts['1M'] = 60 * 4 / this.updateCandleInterval // 240m/candle, increase 1 candle every intervals.
                this.updateIntervalCounts['3M'] = 60 * 24 / this.updateCandleInterval // 60m*24/candle, increase 1 candle every intervals.
                this.updateIntervalCounts['1Y'] = 60 * 24 * 7 / this.updateCandleInterval // 1W/candle, increase 1 candle every intervals.
                this.updateIntervalCounts['5Y'] = 60 * 24 * 31 / this.updateCandleInterval // 1M/candle, increase 1 candle every intervals.
            },
            draw() {
            //     if (!this.chart && this.$store.getters.chartOptions) {
            //        try {     
            //             // this.initChar()                     
            //             this.chart.container(this.$el).draw()
            //         } catch (error) {
            //             console.error(error)
            //         }

            //    }
            },

        },
        watch: {
            chartData: function() {
                this.chart.jsonHistoryData = this.chartData.jsonHistoryData;
                if(this.chart.chart){
                    showData(this.chart)
                }
                // if(!this.chart && this.$store.getters.chartOptions) {
                //     this.draw()
                // } else {
                //     this.chart.dispose()
                //     this.chart = null
                //     this.draw()
                // }
            },
            chartType: function(){
                this.chart.chartType = this.chartType;
                setChartMapping(this.chart);
            },
            chartYLabelType: function(){
                this.chart.chartLabelType = this.chartYLabelType;
                setYLabel(this.chart);
            },
            tradeType: function(){
                this.chart.tradeType = this.tradeType;
                setYLabelColor(this.chart);
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
                'tradeType'
            ])
        },

    }
</script>
