<template>
    <div class="info-list-container" >
        <PreviousButton/>
        <div class="transfer-type-container">
            <div class="transfer-title">
                SINGLE TRANSFER
            </div>
            <AmountInput/>
            <div class="transfer-title transfer-title-date">
                TRANSFER DATE
            </div>
            <div class="trade-input-container">
                <div class="input-group date-input-container">
                    <div class="input-group-prepend">
                        <span class="input-group-text">Date</span>
                    </div>
                    <input type="date" name="tradeDate" id="tradeDate" class="form-control"
                        placeholder="MM/DD/YYYY" :value="date">
                </div>
                <div class="transfer-button-list">
                    <div class="submit-area">
                        <button class="submitButton submit-time" id="singleTransfer">SUBMIT</button>
                    </div> 
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
    name: "single-set-time",
    components: {
        PreviousButton,
        AmountInput
    },
    data(){
        return{
            date: ""
        }
    },
    methods: {
        
    },
    mounted(){
        if(this.message === "tradeToday")
            {
                this.date = this.today.getFullYear() + '-' + ('0' + (this.today.getMonth() + 1)).slice(-2) + '-' + ('0' + this.today.getDate()).slice(-2);
                console.log(this.date)
            }
    },
    computed: {
        ...mapGetters(['tradeType', 'flow', 'today', "message"]),
    }
}
</script>