<template>
    <div class="chart-header" v-show="showMainChart !== false">
        <div class="currency-title">
            <div>{{ chartTitle }}</div>
        </div>
        <div class="price-description">
            <div v-if="chartType === 'candle'" class="descript-candle">
                <div v-if="tradeType === 'buy'" class="descript-candle">
                    Downward price movements of the {{ foreignCurrency }}<br>
                    are beneficial to you as a buyer and are illustrated<br>
                    in orange.
                </div>
                <div v-else-if="tradeType === 'sell'" class="descript-candle">
                    Downward price movements of the {{ homeCurrency }}<br>
                    are beneficial to you as a buyer and are illustrated<br>
                    in orange.
                </div>
                <div v-else></div>
            </div>
            <div v-else-if="chartType === 'line'" class="descript-line">
                <div v-if="tradeType !== 'sell'">
                    Relative performance of {{ foreignCurrency + " to " + homeCurrency }}
                </div>
                <div v-else>
                    Relative performance of {{ homeCurrency + " to " + foreignCurrency }}
                </div>                
            </div>
            <div v-else>non</div>
        </div>
        <div class="pricePercentage-area" id="pricePercentageButton">
            <button v-for="_option in yLabelTypeOptions"
                    class="chartAreaButton pricePercentageButton"
                    :id="_option.value + 'Button'"
                    :value="_option.value"
                    v-html="_option.label"
                    :disabled="isDisabled(_option)"
                    @click="setYLabelType"
            ></button>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex'

    export default {
        data() {
            return {
                yLabelTypeOptions: [
                    {
                        value: 'price',
                        label: '$'
                    },
                    {
                        value: 'percent',
                        label: '%'
                    },
                    {
                        value: 'user',
                        label: '<i class="fa fa-user"></i>'
                    }
                ],
                centerStyle: 'center' 
            }
        },
        mounted() {
            console.log('ChartHeader Mounted!')
        },
        computed: {
            ...mapGetters(['homeCurrency', 'chartSettings', 'foreignCurrency', 'tradeType', 'chartType', 'showMainChart', 'chartTitle'])
        },
        methods: {
            setYLabelType(event) {
                if(event.target.value)
                    this.$store.dispatch('setYLabelType', event.target.value)
                else
                    this.$store.dispatch('setYLabelType', 'user')       
            },
            isDisabled(option) {
                return option.value === this.chartSettings.yLabelType
            }
        }
    }
</script>
