<template>
    <div class="sidebar">
        <div class="buySellButton-area">
            <div class="buySellButton" id="buySellButton">
                <button value="buy" id="buyButton" class="buyButton" @click="setTrade" :disabled="tradeType === `buy`">I WILL NEED<br>FOREIGN CURRENCY</button>
                <button value="sell" id="sellButton" class="sellButton" @click="setTrade" :disabled="tradeType === `sell`">I WILL NEED<br>HOME CURRENCY</button>
            </div>
        </div>

        <div class="amount-area">
            <div class="currency-selector-container">
                <div class="currency-text">
                    <h5>HOME CURRENCY</h5>
                </div>
                <div class="pair-list">       
                    <select class="currency" id="homeCurrency" v-on:change="changeHomeCurrency" v-model="homeCurrency">
                        <option disabled selected value="">--select--</option>
                        <option v-for="currencyItem in currencyItems" class="currency-option">{{currencyItem.currency}}</option>
                    </select>
                </div>
                <div class="currency-text">
                    <h5>FOREIGN CURRENCY</h5>
                </div>
                <div class="pair-list">
                    <select class="currency" id="foreignCurrency" v-on:change="changeForeignCurrency" v-model="foreignCurrency">
                        <option selected value="">--select--</option>
                        <option v-for="currencyItem in currencyItems" :disabled="homeCurrency === currencyItem.currency" class="currency-option">{{currencyItem.currency}}</option>
                    </select>
                </div>  
            </div>
            <div class="trade-input-container">
                <form id="tradingTicketForm">
                    <div class="input-group currency-input-container">
                        <div class="input-group-prepend">
                            <span class="input-group-text">{{ this.amountSymbol }}</span>
                        </div>
                        <input type="number" id="transactionAmount" 
                            class="amount-input form-control" placeholder="AMOUNT"
                            v-model="amountInput"
                            @input="amountChange"
                            >
                    </div>
                    <!-- <div class="input-group date-input-container">
                        <div class="input-group-prepend">
                            <span class="input-group-text">Date</span>
                        </div>
                        <input type="date" name="tradeDate" id="tradeDate" class="form-control"
                            placeholder="MM/DD/YYYY">
                    </div> -->
                </form>
            </div>
            
            <div class="alert-container">
                <div :class="alertClass" v-html="tradeExplaination">
                </div>
            </div>
            <div class="submit-area">
                <button class="submitButton" id="submitButton">submit</button>
            </div>           
        </div>
    </div>
</template>
<script>
    import {mapGetters} from 'vuex'
    import _ from 'lodash'
    export default {
        mounted() {
            console.log('Sidebar Mounted!')
            this.initTradeDate()
        },
        data() {
            return {
                currencyItems: [
                    {currency: 'GBP'},
                    {currency: 'USD'},
                    {currency: 'CAD'}
                ],
                alertClass: {
                    'alert': true,
                    'alert-custom-pass': true,
                    'alert-danger': false
                },
                amountSymbol: '',
                tradeExplaination : "",
                amountInput: ""
            }
        },
        methods:{
            initTradeDate() {
                $("#tradeDate").attr({
                    min :this.tradeDate
                })
            },
            changeHomeCurrency: function(e) {
                console.log("changing home currency to: " + e.target.value)
                
                if(this.homeCurrency === this.foreignCurrency) {
                    this.$store.dispatch('setForeignCurrency', '')
                }
            },
            changeForeignCurrency: function(e) {
                if(!this.foreignChangeAllowed()) {
                    alert("Please select home currency first")
                    this.$store.dispatch('setForeignCurrency', '')
                    return
                }
                console.log("changing foreign currency to: " + e.target.value)
            },
            foreignChangeAllowed() {
                return this.$store.getters.homeCurrency !== ''
            },
            setTrade(e){
                this.$store.dispatch('setTradeType', e.target.value)          
                if(this.amountInput !== ""){
                    this.watchAmount()
                }
                // if(this.homeCurrency !== "" || this.foreignCurrency !== "")
                this.setAmountSymbol()
            },
            watchAmount(){
                let alertList = []
                if(this.tradeType === "")
                    alertList.push("<b>TradeType</b>")
                if(this.homeCurrency === "")
                    alertList.push("<b>HomeCurrency</b>")
                if(this.foreignCurrency === "")
                    alertList.push("<b>ForeignCurrency</b>")

                //todo: add tradeDate
                let result = 0.0
                let s = ""
                if(alertList.length !== 0){
                    this.alertClass['alert-custom-pass'] = false
                    this.alertClass['alert-danger'] = true
                    this.tradeExplaination = "Please set " + alertList.join(", ") + " first!"
                }else{
                    this.alertClass['alert-custom-pass'] = true
                    this.alertClass['alert-danger'] = false                   
                    try {
                        if(this.tradeType === "buy"){
                            result = parseFloat((this.amountInput / this.chartData.jsonHistoryData[0][5]).toFixed(2))
                            s = "If you transfer today,<br>" + this.amountInput + " " + this.foreignCurrency + 
                                " will cost you " + result + " " + this.homeCurrency + "."
                        }else{
                            result = parseFloat((this.amountInput * this.chartData.jsonHistoryData[0][5]).toFixed(2))
                            s = "If you transfer today,<br>" + this.amountInput + " " + this.homeCurrency + 
                                " will cost you " + result + " " + this.foreignCurrency + "."
                        }
                        this.tradeExplaination = s
                        this.$store.dispatch('setYLabelType', "user")
                        this.$store.dispatch('setAmount', this.amountInput);
                    } catch (error) {
                        console.log(error)
                    }
                }
            },
            amountChange:_.debounce(function () {
                this.watchAmount()
            }, 1000),
            setAmountSymbol(){
                let targetCurrency = null
                console.log(this.tradeType)
                switch(this.tradeType){
                    case "buy":
                        targetCurrency = this.foreignCurrency
                        break;
                    case "sell":
                        targetCurrency = this.homeCurrency
                        break;
                    default:
                        targetCurrency = null
                        break;
                }
                

                if(targetCurrency){
                    console.log("change symbol to", targetCurrency)
                    switch(targetCurrency){
                        case 'GBP':
                            this.amountSymbol = "£"
                            break;
                        case 'USD':
                            this.amountSymbol = "$"
                            break;
                        case 'CAD':
                            this.amountSymbol = "$"
                            break;
                        case 'EUR':
                            this.amountSymbol = "€"
                            break;    
                        default:
                            this.amountSymbol = ""
                            break;
                    }
                }else{
                    this.amountSymbol = ""
                }
            }

        },
        computed: {
            ...mapGetters(['today', 'tradeDate', 'pair', 'tradeType', 'chartData']),
            homeCurrency: {
                get () {
                    return this.$store.getters.homeCurrency
                },
                set (currency) {
                    this.$store.dispatch('setHomeCurrency', currency)
                    // if(this.tradeType === "sell")
                    this.setAmountSymbol()
                }
            },
            foreignCurrency: {
                get () {
                    return this.$store.getters.foreignCurrency
                },
                set (currency) {
                    this.$store.dispatch('setForeignCurrency', currency)
                    if(this.tradeType === "buy")
                        this.setAmountSymbol()
                }
            },
        },
        watch: {
            chartData(){
                if(this.amountInput !== "")
                    this.watchAmount()
            }
        }
    }
</script>
