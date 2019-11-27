<template>
    <div class="info-list-container" >
        <PreviousButton/>
        <div class="transfer-type-container">
            <div class="transfer-title">
                RECURRING TRANSFER
            </div>
            <div class="transfer-button-list">
                <div class="submit-area">
                    <button class="submitButton submit-recurring" id="futureTrade" @click="tradeRange()">DATE RANGE</button>
                </div> 
                <div class="submit-area">
                    <button class="submitButton submit-recurring" id="todayTrade" @click="tradeSet()">SET NUMBER OF OCCURENCES</button>
                </div> 
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import PreviousButton from "../PreviousButton"
export default {
    name: "recurring-choose",
    components: {
        PreviousButton
    },
    data(){
        return{
            recurringOption: "RANGE",
        }
    },
    methods: {
        tradeRange(){
            this.nextFlow(7)
        },
        tradeSet(){
            this.nextFlow(8)
        },
        nextFlow(index){
            var f = this.flow
            f.subflow = index
            this.$store.dispatch('setFlow', f)
            // console.log("next")
        },
    },
    computed: {
        ...mapGetters(['tradeType', 'flow', 'tradeDate']),
    }
}
</script>