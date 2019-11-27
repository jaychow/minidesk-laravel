<template>
    <div class="chart-footer" v-show="showMainChart !== false">
        <div class="timescale-area" v-show="flow.type === 'ASSESS' && flow.subflow !== 0">
            <button v-for="_timescale in timescaleOptions"
                    class="timescaleButton"
                    :value="_timescale"
                    :disabled="_timescale === chartSettings.timescale"
                    @click="setTimescale">{{_timescale}}</button>
        </div>
        <div class="candleLine-area" id="candleLineButton">
            <button v-for="(_typeTitle, _type) in typeOptions"
                    class="candleLineButton"
                    :id="_type + 'Button'"
                    :value="_type"
                    :disabled="_type === chartSettings.type"
                    @click="setType">{{_typeTitle}}</button>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'

    export default {
        data() {
            return {
                timescaleOptions: [
                    '1W',
                    '1M',
                    '3M',
                    '6M',
                    '1Y',
                    '5Y'
                ],
                typeOptions: {
                    candle: 'Candle',
                    line: 'Line'
                }
            }
        },
        mounted() {
            console.log('ChartFooter Mounted!')
            var loaded = [];
            var components = this.$options.components;
            for (var key in components) {
                loaded.push(key);
            }
        },
        computed: {
            ...mapGetters(['chartSettings', 'homeCurrency', 'foreignCurrency', 'showMainChart', 'flow'])
        },
        methods: {
            setTimescale(event) {
                this.$store.dispatch('setChartTimescale', event.target.value)
            },
            setType(event) {
                this.$store.dispatch('setChartType', event.target.value)
            }
        }
    }
</script>
