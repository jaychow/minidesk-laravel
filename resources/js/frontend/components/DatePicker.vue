<template>
  <div class="input-group date-input-container">
        <div class="input-group-prepend">
            <span class="input-group-text">Date</span>
        </div>
        <input type="date" name="tradeDate" id="tradeDate" class="form-control"
            placeholder="MM/DD/YYYY" :value="myDate && myDate.toISOString().split('T')[0]"
            @input="myDate = $event.target.valueAsDate">
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
    name: "date-picker",
    data(){
        return{
            myDate: "",
            cnt: 0
        }
    },
    watch: {
        myDate(){
            var dates = this.tradeDates
            var index = parseInt(this.$el.parentElement.parentElement.id)
            console.log(this.$el.parentElement.parentElement.id)
            if(this.message === "tradeToday")
            {
                // this.myDate = this.today.getFullYear() + '-' + ('0' + (this.today.getMonth() + 1)).slice(-2) + '-' + ('0' + this.today.getDate()).slice(-2);
                this.myDate = this.today
                dates[0] = this.myDate
            }else{
                dates[index] = this.myDate;
            }
        }
    },
    mounted(){
        var dates = this.tradeDates
        var index = parseInt(this.$el.parentElement.parentElement.id)
        console.log(this.$el.parentElement.parentElement.id)
        if(this.message === "tradeToday")
        {
            // this.myDate = this.today.getFullYear() + '-' + ('0' + (this.today.getMonth() + 1)).slice(-2) + '-' + ('0' + this.today.getDate()).slice(-2);
            this.myDate = this.today
            dates[0] = this.myDate
        }else{
            dates[index] = this.myDate;
        }
    },
    computed: {
        ...mapGetters(['today', "message", "tradeDates"]),
    }
}
</script>

<style>

</style>