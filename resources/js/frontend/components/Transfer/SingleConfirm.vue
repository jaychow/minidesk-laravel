<template>
    <div class="info-list-container" >
        <PreviousButton/>
        <div class="transfer-type-container">
            <div class="transfer-title">
                SINGLE TRANSFER
            </div>
            <AmountInput/>
            <div class="transfer-title">
                XXX TOTAL FEE
            </div>
            <div class="transfer-title">
                XXX GUARANTEE RATE
            </div>
            <div class="transfer-button-list">
                <div class="submit-area">
                    <button class="submitButton submit-time" id="singleTransfer">SUBMIT</button>
                </div> 
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import PreviousButton from "../PreviousButton"
import AmountInput from "../AmountInput"
export default {
    name: "single-confirm",
    components: {
        PreviousButton,
        AmountInput
    },
    methods: {
        
    }
}
</script>
