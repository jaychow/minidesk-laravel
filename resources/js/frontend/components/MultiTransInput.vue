<template>
<div class="multi-trans">
    <div class="transfer-title">VIEW BY
        <button value="OFTOTAL" class="submitButton" id="submitButton" :disabled="this.multiTransView === `OFTOTAL`" @click="setView">% OF TOTAL</button>
        <button value="VALUE" class="submitButton" id="submitButton" :disabled="this.multiTransView === `VALUE`" @click="setView">$ VALUE</button>
    </div>
    <vue-custom-scrollbar class="scroll-area"  :settings="settings"> 
        <div v-for="i in transCnt" :id="i"> 
            
            {{ getIndexString(i) + " TRANSFER" }}
            <div class="input-group date-input-container">
                <div class="input-group-prepend">
                    <span class="input-group-text">Date</span>
                </div>
                <input type="date" name="tradeDate" id="tradeDate" class="form-control"
                    placeholder="MM/DD/YYYY" :value="getDateValue(i)"
                    @input="setDateValue(i, $event.target.valueAsDate)">
            </div>
            <div class="trade-input-container">
                <div class="input-group currency-input-container">
                    <input type="number" id="transactionAmount" 
                        class="amount-input form-control" placeholder="AMOUNT"
                        :value="getAmountValue(i)"
                        @input="setAmountValue(i, $event.target.value)">
                    <div class="input-group-prepend">
                        <span class="input-group-text">{{ getSymbol() }}</span>
                    </div>
                </div>
            </div>
        </div>
    </vue-custom-scrollbar>
</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import vueCustomScrollbar from 'vue-custom-scrollbar'

export default {
    name: "multi-trans-input",
    components: {
        vueCustomScrollbar,
    },
    data(){
        return {
            cnt: 1, 
            viewAmount: [],
            settings: {
                tagname: "div",
                suppressScrollX: true,
                suppressScrollY: false,
                maxScrollbarLength: 60
            }
        }
    },
    mounted(){
        
    },
    watch:{
        amount:{
            handler() {
                this.setAmountView()
            },
            deep: true
        },
        tradeInputs: {
            handler() {
                this.setAmountView()
            },
            deep: true
        },
        multiTransView(){
            this.setAmountView()
        }
    },
    methods:{
        setView(e){
            // this.viewOption = e.target.value
            this.$store.dispatch('setMultiTransView', e.target.value);
        },
        getIndexString(i){
            var s = ""
            switch (i) {
                case 1:
                    s = "1ST"
                    break;
                case 2:
                    s = "2ND"
                    break;  
                case 3:
                    s = "3RD"  
                    break;  
                default:
                    s = i + "TH"
                    break;
            }
            return s
        },
        getDateValue(i){   
            return this.tradeInputs[i-1].tradeDate && this.tradeInputs[i-1].tradeDate.toISOString().split('T')[0]
        },
        getAmountValue(i){   
            // if(this.multiTransView == "VALUE")
                return this.viewAmount[i-1]
            // else
            //     return parseFloat(((this.tradeInputs[i-1].tradeAmount / this.amount.price) * 100).toFixed(4)).toString();
        },
        setDateValue(i, tradeDate){
            this.tradeInputs[i-1].tradeDate = tradeDate
            this.$store.dispatch('setTradeInputs', this.tradeInputs)
        },
        setAmountValue(i, value){
            this.tradeInputs[i-1].tradeAmount = value
            this.$store.dispatch('setTradeInputs', this.tradeInputs)
        },
        getSymbol(){
            if(this.multiTransView === "OFTOTAL")
                return "%"
            else
                return this.amount.symbol
        },
        setAmountView(){
            this.viewAmount = []
            if(this.multiTransView === "VALUE"){
                if(this.transCnt === 1)
                    this.viewAmount.push(this.tradeInputs[0].tradeAmount)
                else{
                    for(var i=0;i<this.transCnt;i++){
                        this.viewAmount.push(this.tradeInputs[i].tradeAmount)
                    }
                }
            }else{
                if(this.transCnt === 1)
                    this.viewAmount.push("100")
                else{
                    for(var i=0;i<this.transCnt;i++){
                        var percent = (((this.tradeInputs[i].tradeAmount / this.amount.price)*100).toFixed(3)).toString()
                        this.viewAmount.push(percent)
                    }
                }
            }
            console.log(this.viewAmount)
        }
    },
    computed: {
        ...mapGetters(['transCnt', 'amount', 'tradeInputs', 'multiTransView']),
    },
}
</script>
<style >
.scroll-area {
  position: relative;
  margin: auto;
  width: 600px;
  height: 400px;
  overflow:scroll;
  margin-top:-4%; 
}
</style>