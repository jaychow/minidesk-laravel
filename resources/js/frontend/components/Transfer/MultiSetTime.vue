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
    },
    data(){
        return {
            transfersCnt: 1,
            transferLimits: 10,  //???
            viewOption: "",
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
        }
    },
    computed: {
        ...mapGetters(['amount']),
    },
    watch: {
        transfersCnt(){
            this.$store.dispatch('setTransCnt', this.transfersCnt);
        }
    }
}
</script>