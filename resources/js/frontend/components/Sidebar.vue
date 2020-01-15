<template>
    <div class="sidebar">
        <div class="buySellButton-area">
            <div class="buySellButton" id="buySellButton">
                <button value="buy" id="buyButton" class="buyButton" @click="setTrade" :disabled="tradeType === `buy`">I WILL NEED<br>FOREIGN CURRENCY</button>
                <button value="sell" id="sellButton" class="sellButton" @click="setTrade" :disabled="tradeType === `sell`">I WILL NEED<br>HOME CURRENCY</button>
            </div>
        </div>

        <div class="amount-area">
            <div class="previous-side-bar">
                <PreviousButton/>
            </div>       
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
            <form id="tradingTicketForm">
                <AmountInput/>
            </form>
            <transition name="fade">
                <CustomAlert/>
            </transition>
            <transition name="fade">     
                <div class="submit-area" v-show="showSubmit=== true" >
                    <button class="submitButton" id="submitButton" @click="amountSubmit">submit</button>
                </div>   
            </transition>        
        </div>
    </div>
</template>
<script>
    import {mapGetters} from 'vuex'
    import _ from 'lodash'
    import PreviousButton from "./PreviousButton"
    import AmountInput from "./AmountInput"
    import CustomAlert from "./CustomAlert"
    export default {
        created(){
            if(!this.tradeType || this.tradeType === ""){
                this.$store.dispatch('setTradeType', "buy") 
                this.setAmountSymbol()
            }       
        },
        mounted() {
            this.initTradeDate()
            if(this.amount.price != 0){
                this.watchAmount()
            }
        },
        components: {
            PreviousButton,
            AmountInput,
            CustomAlert
        },
        data() {
            return {
                currencyItems: [
                    {currency: 'GBP'},
                    {currency: 'USD'},
                    {currency: 'CAD'}
                ],
                amountSymbol: '',
                showSubmit: false,
            }
        },
        methods:{
            initTradeDate() {
                $("#tradeDate").attr({
                    min :this.tradeDate
                })
            },
            changeHomeCurrency: function(e) {            
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
            },
            foreignChangeAllowed() {
                return this.$store.getters.homeCurrency !== ''
            },
            setTrade(e){
                this.$store.dispatch('setTradeType', e.target.value) 
       
                if(this.amount.price != 0){
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
                var alert = {
                    class: "common",
                    msg: ""
                }
                if(alertList.length !== 0){
                    alert.msg = "Please set " + alertList.join(", ") + " first!"
                    this.$store.dispatch('setAlert', alert)
                    return false
                }else{
                    alert.class = "danger"                 
                    try {
                        result = parseFloat((this.amount.price / this.chartData.jsonHistoryData[0][5]).toFixed(2))

                        if(this.tradeType === "buy"){
                            // result = parseFloat((this.amountInput / this.chartData.jsonHistoryData[0][5]).toFixed(2))
                            s = "If you transfer today,<br>" + this.amount.price + " " + this.homeCurrency + 
                                " will get you " + result + " " + this.foreignCurrency + "."
                        }else{
                            // result = parseFloat((this.amountInput * this.chartData.jsonHistoryData[0][5]).toFixed(2))
                            s = "If you transfer today,<br>" + this.amount.price + " " + this.foreignCurrency + 
                                " will get you " + result + " " + this.homeCurrency + "."
                        }
                        if(this.amount.price !== ""  && this.amount.price >= 0)
                            alert.msg = s
                        else
                            alert.msg = ""
                        this.$store.dispatch('setAlert', alert)
                        
                        this.$store.dispatch('setYLabelType', "user")

                        this.showSubmit = true
                        return true
                    } catch (error) {
                        console.log(error)
                    }
                    this.showSubmit = false
                    return false
                }
            },
            amountChange:_.debounce(function () {
                this.watchAmount()
            }, 1000),
            setAmountSymbol(){
                let targetCurrency = null
                switch(this.tradeType){
                    case "buy":
                        targetCurrency = this.homeCurrency
                        break;
                    case "sell":
                        targetCurrency = this.foreignCurrency
                        break;
                    default:
                        targetCurrency = null
                        break;
                }
                if(targetCurrency){
                    this.amountSymbol = this.getSymbol(targetCurrency)
                }else{
                    this.amountSymbol = ""
                }
            },
            amountSubmit(event){
                if(this.watchAmount()){
                    var f = this.flow
                    f.subflow = 2

                    var tradeCurrency = null
                    switch(this.tradeType){
                        case "buy":
                            tradeCurrency = this.foreignCurrency
                            break;
                        case "sell":
                            tradeCurrency = this.homeCurrency
                            break;
                        default:
                            tradeCurrency = null
                            break;
                    }
                    
                    var tradeSymbol = this.getSymbol(tradeCurrency)
                    console.log(tradeSymbol)
                    var a = {
                        symbol: this.amountSymbol,
                        targetSymbol: tradeSymbol,
                        price: this.amount.price
                    }
                    console.log(a)
                    this.$store.dispatch('setAmount', a);
                    this.$store.dispatch('setFlow', f)
                }
            },
            getSymbol(targetCurrency){
                switch(targetCurrency){
                    case 'GBP':
                        return "£"
                    case 'USD':
                        return "$"
                    case 'CAD':
                        return "$"
                    case 'EUR':
                        return "€"   
                    default:
                        return ""
                }
            }
        },
        computed: {
            ...mapGetters(['today', 'tradeDate', 'pair', 'tradeType', 'chartData', 'flow', 'amount']),
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
                if(this.amount.price != 0)
                    this.watchAmount()
            },
            amount: {
                deep: true,
                handler(){
                    this.watchAmount()
                }
            }
        }
    }
</script>
