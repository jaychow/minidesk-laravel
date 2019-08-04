<template>
    <div class="chart" id="chart"></div>
</template>

<script>
    import Anychart from 'anychart'
    import { mapGetters, mapActions } from 'vuex'

    export default {
        name: 'chart',
        data() {
            return {
                chart: null,
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
               if (!this.chart && this.$store.getters.chartOptions) {
                   try {
                       let _Anychart = this.Anychart || Anychart
                       this.chart = new _Anychart.stock()
                       this.chart.container(this.$el).draw()
                   } catch (error) {
                       console.error(error)
                   }

               }
            },
            formatLegend() {
                const length = this.jsonHistoryData.length
                if (length > 0 && this.index < length && this.index > 0) {
                    return "<span style='color:#455a64font-weight:600'>" + this.index +
                        "</span>: <b>O</b> " + Number(this.open).toFixed(4) + " <b>H</b> " + Number(this.high).toFixed(4) + " <b>L</b> " + Number(this.low).toFixed(4) + " <b>C</b> " + Number(this.close).toFixed(4) + "<br/>" +
                        "<b>Vol</b> " + this.jsonHistoryData[length - this.index - 1][6].toLocaleString() + " <b>Avg Vol</b> " + this.jsonHistoryData[length - this.index - 1][7].toLocaleString() +
                        " <b>Delta O-C(%)</b> " + Number(this.jsonHistoryData[length - this.index - 1][8]).toFixed(2) + "% <b>Range(L-H)</b> " + Number(this.jsonHistoryData[length - this.index - 1][9]).toFixed(4) + " <b>Avg Vol(%)</b> " + Number(this.jsonHistoryData[length - this.index - 1][10]).toFixed(2) + "%"
                } else {
                    return "<span style='color:#455a64font-weight:600'>" + this.index +
                        "</span>: <b>O</b> ------ <b>H</b> ------ <b>L</b> ------ <b>C</b> ------<br/>" +
                        "<b>Vol</b> ------ <b>Avg Vol</b> ------ <b>Delta O-C(%)</b> ------% <b>Range(L-H)</b> ------ <b>Avg Vol(%)</b> ------% "
                }
            },
            formatYAxis() {
                if (this.jsonHistoryData.length > 0) {
                    const currency = (this.value + 100) / 100 * this.jsonHistoryData()[0][5]
                    return "$ " + (Math.round(currency * 10000) / 10000).toFixed(4)
                }
            },
            formatYLabel() {
                if (this.jsonHistoryData.length > 0) {
                    const currency = (this.value + 100) / 100 * this.jsonHistoryData()[0][5]
                    return (Math.round(currency * 10000) / 10000).toFixed(4)
                }
            }
        },
        watch: {
            chartData: function() {
                if(!this.chart && this.$store.getters.chartOptions) {
                    this.draw()
                } else {
                    this.chart.dispose()
                    this.chart = null
                    this.draw()
                }
            },
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
                'chartOptions',
                'chartData'
            ]),
        },

    }
</script>
