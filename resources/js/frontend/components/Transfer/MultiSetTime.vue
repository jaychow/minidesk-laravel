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
            <div class="transfer-title">VIEW BY</div>
            <div class="view-by-button-list">
                <div class="submit-area">
                    <button value="OFTOTAL" class="submitButton" id="submitButton" :disabled="this.viewOption === `OFTOTAL`" @click="setView">% OF TOTAL</button>
                    <button value="VALUE" class="submitButton" id="submitButton" :disabled="this.viewOption === `VALUE`" @click="setView">$ VALUE</button>
                </div> 
            </div>
            
            <div class="trade-list-container">
                <vue-custom-scrollbar class="scroll-area"  :settings="settings">
                    <div v-for="i in transfersCnt"> {{ i }} <br><br></div>
                </vue-custom-scrollbar>
                
            </div>
            
        </div>

        
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import PreviousButton from "../PreviousButton"
import AmountInput from "../AmountInput"
import vueCustomScrollbar from 'vue-custom-scrollbar'
// import { PerfectScrollbar } from 'vue2-perfect-scrollbar'
export default {
    name: "multi-set-time",
    components: {
        PreviousButton,
        AmountInput,
        vueCustomScrollbar
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
            settings: {
                tagname: "div",
                suppressScrollX: true,
                suppressScrollY: false,
                maxScrollbarLength: 60
            }
        }
    },
    methods:{
        setView(e){
            this.viewOption = e.target.value
        },
    },
    computed: {
        ...mapGetters(['amount']),
    },
    watch: {
        transfersCnt(){
            console.log(this.transfersCnt)
        }
    }
}
</script>
<style >
.scroll-area {
  position: relative;
  margin: auto;
  width: 600px;
  height: 400px;
  overflow:scroll;
}
</style>