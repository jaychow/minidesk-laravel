<template>
    <div class="info-select-list">
        <div class="select-info" v-for="(currency, i) in infoPagesData.selectList">
            <div class="info-title"> {{ currency }} </div>
            <div class="mini-chart"> MINICHART </div>
            <div class="now-price-button">
                <button class="submitButton" id="info-select-button"> {{ formatPrice(infoPagesData.infoPagesPriceData[infoPagesData.infoPair[i]][0][5]) }} </button>
            </div>
        </div>
        
    </div>
</template>

<script>
import Anychart from 'anychart'
import { mapGetters, mapActions } from 'vuex'

export default {
    name: "info-select-list",
    data(){
        return{
            formatPrice(price){
                price = parseFloat(price)
                return price.toFixed(4)
            },
        }
    },
    method:{
        
    },
    computed: {
        ...mapGetters(['infoPagesData'])
    },
}
</script>