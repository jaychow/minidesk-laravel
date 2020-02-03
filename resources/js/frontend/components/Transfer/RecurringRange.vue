<template>
    <div class="info-list-container" >
        <PreviousButton/>
        <div class="transfer-type-container recurring-transfer">
            <div class="transfer-title">
                RECURRING TRANSFERS RANGE
            </div>
            <div class="amount-container"><AmountInput/></div>
            <div class="transfer-title">START DATE</div>
            <div class="input-group date-input-container">
                <div class="input-group-prepend">
                    <span class="input-group-text">Date</span>
                </div>
                <input type="date" name="tradeDate" id="tradeDate" class="form-control"
                    placeholder="MM/DD/YYYY">
            </div>
            <div class="transfer-title">END DATE</div>
            <div class="input-group date-input-container">
                <div class="input-group-prepend">
                    <span class="input-group-text">Date</span>
                </div>
                <input type="date" name="tradeDate" id="tradeDate" class="form-control"
                    placeholder="MM/DD/YYYY">
            </div>
            <div class="transfer-title">
                <button value="UNTILCANCEL" class="submitButton" id="submitButton">UNTIL CANCELLED</button>
                <!-- <div class="descript">
                    automatically descript
                </div> -->
            </div>
            <div class="transfer-title">FREQUENCY</div>
            <div class="frequency-set">
                <div class="rol1">
                    <button value="DAILY" class="submitButton" id="submitButton">DAILY</button>
                    <button value="WEEKLY" class="submitButton" id="submitButton">WEEKLY</button>
                </div>
                <div class="rol2">
                    <button value="MONTHLY" class="submitButton" id="submitButton">MONTHLY</button>
                </div>
            </div>
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
export default {
    name: "recurring-range",
    components: {
        PreviousButton,
        AmountInput
    },
    
}
</script>