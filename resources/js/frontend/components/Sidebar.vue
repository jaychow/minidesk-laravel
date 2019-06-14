<template>
    <div class="sidebar">
        <div class="buySellButton-area">
            <div class="buySellButton" id="buySellButton">
                <button value="buy" id="buyButton" class="buyButton">I WILL NEED<br/>FOREIGN CURRENCY</button>
                <button value="sell" id="sellButton" class="sellButton">I WILL NEED<br/>HOME CURRENCY</button>
            </div>
        </div>

        <div class="amount-area">
            <div class="currency-selector-container">
                <div class="currency-selector currency-selector__home">
                    <h4> HOME CURRENCY</h4>
                    <select class="pairList homeCurrency" id="homeCurrency" v-on:change="changeHomeCurrency" v-model="homeCurrency">
                        <option disabled selected value="">--select--</option>
                        <option value="GBP" :disabled="foreignCurrency === 'GBP'">GBP</option>
                        <option value="USD" :disabled="foreignCurrency === 'USD'">USD</option>
                        <option value="CAD" :disabled="foreignCurrency === 'CAD'">CAD</option>
                    </select>
                </div>
                <div class="currency-selector currency-selector__foreign">
                    <h4> FOREIGN CURRENCY</h4>
                    <select class="pairList foreignCurrency" id="foreignCurrency" v-on:change="changeForeignCurrency" v-model="foreignCurrency">
                        <option disabled selected value="">--select--</option>
                        <option value="GBP" :disabled="homeCurrency === 'GBP'">GBP</option>
                        <option value="USD" :disabled="homeCurrency === 'USD'">USD</option>
                        <option value="CAD" :disabled="homeCurrency === 'CAD'">CAD</option>
                    </select>
                </div>
            </div>

            <form id="tradingTicketForm">
                <div class="input-group currency-input-container">
                    <div class="input-group-prepend">
                        <span class="input-group-text">$</span>
                    </div>
                    <input type="number" id="transactionAmount" class="form-control" placeholder="Amount">
                </div>
                <div class="input-group">
                    <div class="input-group-prepend">
                        <span class="input-group-text">Date</span>
                    </div>
                    <input type="date" name="tradeDate" id="tradeDate" class="form-control"
                           placeholder="MM/DD/YYYY">
                </div>
            </form>

            <p id="tradeExplaination"></p>
            <button class="submitButton" id="submitButton">submit</button>
        </div>
    </div>
</template>
<script>
    import {mapGetters, mapActions} from 'vuex'

    export default {
        mounted() {
            console.log('Sidebar Mounted!')
            this.initTradeDate()
        },
        data() {
            return {

            }
        },
        methods:{
            ...mapActions['setHomeCurrency', 'setForeignCurrency'],
            initTradeDate() {
                $("#tradeDate").attr({
                    min :this.getTradeDate
                })
            },
            changeHomeCurrency(e) {
                console.log("changing home currency to: " + e.target.value)
                this.homeCurrency = e.target.value
            },
            changeForeignCurrency(e) {
                if(!this.foreignChangeAllowed()) {
                    alert("Please select home currency first")
                    this.$store.dispatch('setForeignCurrency', '')
                    return
                }
                console.log("changing foreign currency to: " + e.target.value)
                this.foreignCurrency = e.target.value
                console.log(this.pair)
                // this.$store.dispatch('fetchChartData',{
                //     pair: this.pair(),
                //
                // })
            },
            foreignChangeAllowed() {
                return this.$store.state.settings.homeCurrency !== ''
            }
        },
        computed: {
            ...mapGetters(['today', 'getTradeDate']),
            homeCurrency: {
                get () {
                    return this.$store.state.settings.homeCurrency
                },
                set (currency) {
                    this.$store.dispatch('setHomeCurrency', currency)
                }
            },
            foreignCurrency: {
                get () {
                    return this.$store.state.settings.foreignCurrency
                },
                set (currency) {
                    this.$store.dispatch('setForeignCurrency', currency)
                }
            },
            pair() {
                return this.homeCurrency+"_"+this.foreignCurrency
            }
        }
    }
</script>
