<template>
    <div class="chart-header">
        <div class="currency-title">
            <p id="currencyTitle">{{ homeCurrency }}</p>
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
                        value: 'user',
                        label: '<i class="fa fa-user"></i>'
                    },
                    {
                        value: 'price',
                        label: '$'
                    },
                    {
                        value: 'percent',
                        label: '%'
                    }
                ]
            }
        },
        mounted() {
            console.log('ChartHeader Mounted!')
        },
        computed: {
            ...mapGetters(['homeCurrency', 'chartSettings'])
        },
        methods: {
            setYLabelType(event) {
                console.log(event.target.value)
                this.$store.dispatch('setYLabelType', event.target.value)
            },
            isDisabled(option) {
                return option.value === this.chartSettings.yLabelType
            }
        }
    }
</script>
