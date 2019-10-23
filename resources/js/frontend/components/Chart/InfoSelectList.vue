<template>
    <div class="info-select-list">
        <div class="select-info" v-for="(currency, i) in infoPagesData.selectList">
            
            <div class="info-title"> 
                <div class="currency-title">{{ currency }} </div>
                <div class="currency-descript">
                    <div class="region">{{ infoPagesData.descriptList[currency]["region"]}}</div>
                    <div class="unit">{{ infoPagesData.descriptList[currency]["unit"]}}</div>
                </div>
            </div>
            <div class="mini-chart"> MINICHART </div>
            <div class="now-price-area">
                <div class="now-price-button">
                    <button class="submitButton" id="info-select-button"> {{ formatPrice(infoPagesData.infoPagesPriceData[infoPagesData.infoPair[i]][0][5]) }} </button>
                </div>
                <div class="now-price-change">
                    {{ formatChange(infoPagesData.infoPagesPriceData[infoPagesData.infoPair[i]][0][8], infoPagesData.infoPagesPriceData[infoPagesData.infoPair[i]][0][9], 3) }}
                </div>
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
            formatPrice(price, digit=4){
                price = parseFloat(price)
                return price.toFixed(digit)
            },
            formatChange(priceChange, priceRange, changeDigit=3, rangeDigit=3){
                var change = parseFloat(priceChange).toFixed(changeDigit)
                var range = parseFloat(priceRange).toFixed(rangeDigit)
                var s = ""
                if(change >= 0)
                    s = "+" + change.toString() + "%"
                else
                    s = change.toString() + "%"
                s += " " + range.toString()
                return s
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