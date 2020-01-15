<template>
<div class="multi-trans">
    <div class="transfer-title">VIEW BY
        <button value="OFTOTAL" class="submitButton" id="submitButton" :disabled="this.viewOption === `OFTOTAL`" @click="setView">% OF TOTAL</button>
        <button value="VALUE" class="submitButton" id="submitButton" :disabled="this.viewOption === `VALUE`" @click="setView">$ VALUE</button>
    </div>
    <vue-custom-scrollbar class="scroll-area"  :settings="settings"> 
        <div v-for="i in cnt" :id="i"> 
            
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
            viewOption: "VALUE",
            tradeInputs: this.initTradInput(1),
            settings: {
                tagname: "div",
                suppressScrollX: true,
                suppressScrollY: false,
                maxScrollbarLength: 60
            }
        }
    },
    mounted(){
        this.cnt = 1
        console.log(this.amount.symbol)
        // this.initTradInput()
    },
    watch:{
        transCnt(){
            console.log("add " + this.transCnt)
            this.cnt = this.transCnt
            this.tradeInputs = this.initTradInput(this.cnt)
        }
    },
    methods:{
        setView(e){
            this.viewOption = e.target.value
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
        initTradInput(cnt){
            var tradeInputs = []
            console.log("init cnt " + cnt)

            for(var i=0; i<cnt; i++){
                tradeInputs.push({
                    tradeDate : "",
                    tradeAmount : ""
                })
            }
            return tradeInputs
        },
        getDateValue(i){   
            return this.tradeInputs[i-1].tradeDate && this.tradeInputs[i-1].tradeDate.toISOString().split('T')[0]
        },
        getAmountValue(i){   
            return this.tradeInputs[i-1].tradeAmount
        },
        setDateValue(i, tradeDate){
            this.tradeInputs[i-1].tradeDate = tradeDate
        },
        setAmountValue(i, value){
            this.tradeInputs[i-1].tradeAmount = value
        },
        getSymbol(){
            if(this.viewOption === "OFTOTAL")
                return "%"
            else
                return this.amount.symbol
        }

    },
    computed: {
        ...mapGetters(['transCnt', 'amount']),
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