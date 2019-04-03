<template>
    <div class="sidebar">
        <div class="buySellButton-area">
            <div class="buySellButton" id="buySellButton">
                <button value="buy" id="buyButton" class="buyButton">I WILL NEED</br>FOREIGN CURRENCY</button>
                <button value="sell" id="sellButton" class="sellButton">I WILL NEED</br>HOME CURRENCY</button>
            </div>
        </div>

        <div class="amount-area">
            <div class="currency-selector-container">
                <div class="currency-selector currency-selector__home">
                    <h4> HOME CURRENCY</h4>
                    <select class="pairList homeCurrency" id="homeCurrency" v-on:change="changeHomeCurrency">
                        <option disabled selected value="">--select--</option>
                        <option value="GBP">GBP</option>
                        <option value="USD">USD</option>
                        <option value="CAD">CAD</option>
                    </select>
                </div>
                <div class="currency-selector currency-selector__foreign">
                    <h4> FOREIGN CURRENCY</h4>
                    <select class="pairList foreignCurrency" id="foreignCurrency">
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
    export default {
        props:[
            'today',
            'homeCurrency',
            'foreignCurrency'
        ],
        mounted() {
            console.log('Sidebar Mounted!');
            this.initTradeDate();
        },
        methods:{
            initTradeDate() {
                $("#tradeDate").attr({
                    min :this.today.toISOString().substr(0,10)
                });
            },
            changeHomeCurrency(e) {
                console.log("changing home currency to: " + e.target.value);
                this.$emit('change-home-currency', e.target.value);
            },
            changeForeignCurrency(e) {
                console.log("changing foreign currency to: " + e.target.value);
                this.$emit('change-foreign-currency', e.target.value);
            },
        },
        computed: {
            isCurrencyDisabled(e, el) {
                debugger;
            }
        }
    }
</script>
