<template>
    <div class="info-list-container" >
        <PreviousButton/>
        
        <div class="transfer-type-container multi-transfer">
            
            <div class="transfer-title">MULTIPLE TRANSFERS</div>
            <div class="amount-container"><AmountInput/></div>
            <div class="transfer-title">HOW MANY TRANSFERS?</div>
            <div class="trade-input-container">
                <select v-model="transfersCnt" class="input-group-select">
                    <option v-for="i in transferLimits" v-bind:value="i"> {{ i }} </option>
                </select>
            </div>     
            <MultiTransInput/>
            <transition name="fade">
                <CustomAlert/>
            </transition>
            <div class="submit-area" >
                <button class="submitButton" id="submitButton" >submit</button>
            </div>  
        </div> 
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import PreviousButton from "../PreviousButton"
import AmountInput from "../AmountInput"
import MultiTransInput from '../MultiTransInput'
import CustomAlert from "../CustomAlert"
export default {
    name: "multi-set-time",
    components: {
        PreviousButton,
        AmountInput,
        MultiTransInput,
        CustomAlert,
    },
    mounted(){
        // const container = document.querySelector('.trade-list-container')
        // const ps = new PerfectScrollbar(container);
        this.transfersCnt = 1;
        this.$store.dispatch('setTransCnt', 1);
        this.setAverage(this.amount.price, this.transfersCnt)
    },
    data(){
        return {
            transfersCnt: 1,
            transferLimits: 10,  //???
        }
    },
    methods:{
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
        setAmounts(total){
            console.log("set multi amount")
        },
        setAverage(total, transCnt, amountInput){
            var average = parseFloat((parseFloat(total) / this.transfersCnt).toFixed(3))
            var tradeInputs = this.tradeInputs
            if(this.transfersCnt >= 2){
                var lastPrice = parseFloat((total - average * (this.transfersCnt - 1)).toFixed(3))
                for(var i=0; i<this.transfersCnt; i++){
                    tradeInputs[i].tradeAmount = average.toString()
                }
                // tradeInputs[this.transfersCnt-1].tradeAmount = lastPrice.toString()
            }else{
                tradeInputs[0].tradeAmount = total
            }
            console.log(tradeInputs)
        }
    },
    computed: {
        ...mapGetters(['amount', 'transCnt', 'tradeInputs', 'multiTransView']),
    },
    watch: {
        transfersCnt(){
            this.$store.dispatch('setTransCnt', this.transfersCnt);
            this.setAverage(this.amount.price, this.transfersCnt)
        },
        amount: {
            handler() {
                var total = this.amount.price
                this.setAverage(this.amount.price, this.transfersCnt)
                this.setAmounts(total)
            },
            deep: true
        },
        multiTransView() {
            
        }
    }
}
</script>