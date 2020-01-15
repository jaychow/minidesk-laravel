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
                        placeholder="MM/DD/YYYY" :value="myDate && myDate.toISOString().split('T')[0]"
                        @input="myDate = $event.target.valueAsDate">
                </div>
                
                <transition name="fade">
                    <CustomAlert/>
                </transition>
                <div class="transfer-button-list">
                    <div class="submit-area">
                        <button class="submitButton submit-time" id="singleTransfer" @click="nextFlow()">SUBMIT</button>
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
import CustomAlert from "../CustomAlert"
import DatePicker from "../DatePicker"
export default {
    name: "single-set-time",
    components: {
        PreviousButton,
        AmountInput,
        CustomAlert,
        DatePicker
    },
    data(){
        return{
            myDate: "",
            tradeExplaination: "123"
        }
    },
    methods: {
        nextFlow(){
            console.log(this.myDate)
            console.log(this.amount)
            if(this.isAllowed()){
                var f = this.flow
                f.subflow = 9
                this.$store.dispatch('setFlow', f)
            }    
        },
        isAllowed(){
            if(this.myDate !== "" && this.amount.price != 0 && this.amount.price !== "")
                return true
            else
                return false
        }
    },
    mounted(){
        if(this.message === "tradeToday")
            {
                // this.myDate = this.today.getFullYear() + '-' + ('0' + (this.today.getMonth() + 1)).slice(-2) + '-' + ('0' + this.today.getDate()).slice(-2);
                this.myDate = this.today
            }
    },
    computed: {
        ...mapGetters(['tradeType', 'flow', 'today', "message", "amount"]),
    }
}
</script>