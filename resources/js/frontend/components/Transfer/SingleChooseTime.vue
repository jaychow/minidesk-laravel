<template>
    <div class="info-list-container" >
        <PreviousButton/>
        <div class="transfer-type-container">
            <div class="transfer-title">
                SINGLE TRANSFER
            </div>
            <div class="transfer-button-list">
                <div class="submit-area">
                    <button class="submitButton submit-time" id="futureTrade" @click="tradeFuture()">FUTURE</button>
                </div> 
                <div class="submit-area">
                    <button class="submitButton submit-time" id="todayTrade" @click="tradeToday()">TODAY</button>
                </div> 
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import PreviousButton from "../PreviousButton"
export default {
    name: "single-choose-time",
    components: {
        PreviousButton
    },
    data(){
        return{
            timeOption: "tradeToday"
        }
    },
    methods: {
        tradeFuture(){
            this.$store.dispatch('setMessage', "tradeFuture")
            this.nextFlow()
        },
        tradeToday(){
            this.$store.dispatch('setMessage', "tradeToday")
            this.nextFlow()
        },
        nextFlow(){
            var f = this.flow
            f.subflow = 4
            this.$store.dispatch('setFlow', f)
        },
    },
    computed: {
        ...mapGetters(['tradeType', 'flow', 'tradeDate']),
    }
}
</script>