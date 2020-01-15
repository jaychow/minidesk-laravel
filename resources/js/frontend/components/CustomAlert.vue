<template>
  <div class="alert-container">
        <div :class="alertClass" v-html="tradeExplaination">
        </div>
    </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
    name: "custom-alert",
    components: {
        
    },
    data(){
        return{
            tradeExplaination: "",
            alertClass: {
                'alert': true,
                'alert-custom-pass': true,
                'alert-danger': false
            },
        }
    },
    mounted(){
        this.alertClass = {
            'alert': true,
            'alert-custom-pass': true,
            'alert-danger': false
        }
    },
    methods:{
        setAlert(){
            if(this.alert.class === "danger"){
                this.alertClass['alert-custom-pass'] = true
                this.alertClass['alert-danger'] = false  
                this.tradeExplaination = this.alert.msg
            }else{
                this.alertClass['alert-custom-pass'] = false
                this.alertClass['alert-danger'] = true
                this.tradeExplaination = this.alert.msg
            }
        }
    },
    computed:{
        ...mapGetters(["alert"])
    },
    watch: {
        alert: {
            deep: true,
            handler(){
                this.setAlert()
            }
        }
    }
}
</script>

<style>

</style>