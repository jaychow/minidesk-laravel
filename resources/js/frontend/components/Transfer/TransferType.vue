<template>
    <div class="info-list-container" >
        <PreviousButton/>
        <div class="transfer-type-container">
            <div class="transfer-title">
                I NEED {{ this.needType() }} CURRENCY
            </div>
            <div class="transfer-button-list">
                <div class="submit-area">
                    <button class="submitButton" id="singleTransfer" @click="singleSubmit()">SINGLE TRANSFER</button>
                </div> 
                <div class="submit-area">
                    <button class="submitButton" id="multipleTransfer" @click="multiSubmit()">MULTIPLE TRANSFERS</button>
                </div> 
                <div class="submit-area">
                    <button class="submitButton" id="recurringTransfer" @click="recurringSubmit()">RECURRING TRANSFERS</button>
                </div> 
            </div>
        </div>
        
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import PreviousButton from "../PreviousButton"

export default {
    name: "transfer-type",
    components: {
        PreviousButton
    },
    data(){
        return{
            needType(){
                if(this.tradeType === "buy")
                    return "FOREIGN"
                else
                    return "HOME"
            }
        }
    },
    methods: {
        singleSubmit(){
            var f = this.flow
            f.subflow = 3
            this.$store.dispatch('setFlow', f)
        },
        multiSubmit(){
            var f = this.flow
            f.subflow = 5
            this.$store.dispatch('setFlow', f)
        },
        recurringSubmit(){
            var f = this.flow
            f.subflow = 6
            this.$store.dispatch('setFlow', f)
        }
    },
    computed: {
        ...mapGetters(['tradeType', 'flow']),
    }
}
</script>