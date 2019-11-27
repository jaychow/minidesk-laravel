<template>
    <div class="trade-input-container">
        <div class="input-group currency-input-container">
            <div class="input-group-prepend">
                <span class="input-group-text">{{ this.amount.symbol }}</span>
            </div>
            <input type="number" id="transactionAmount" 
                class="amount-input form-control" placeholder="AMOUNT"
                v-model="priceInput" @input="amountChange">

        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
    name: "amount-input",
    mounted(){
        if(this.amount.price != 0){
            this.priceInput = this.amount.price
        }
    },
    data(){
        return {
            priceInput: ""
        }
    },
    methods:{
        amountChange:_.debounce(function () {
            this.watchAmount()
        }, 1000),
        watchAmount(){
            // if(this.tradeType !== "" && this.homeCurrency !== "" && this.foreignCurrency !== ""){
                if(this.priceInput !== "" && this.priceInput != 0 && this.priceInput >= 0){
                    var temp = this.amount
                    temp.price = this.priceInput
                    this.$store.dispatch('setAmount', temp);
                }
                
            // }          
        }
    },
    computed:{
        ...mapGetters(['tradeType', 'amount', 'homeCurrency', 'foreignCurrency']),
    },
}
</script>