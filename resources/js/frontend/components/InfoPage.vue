<template>
    <div class="info-page" id="info-page">
        <div class="chart-container" id="chart-container">
            <div class="top-area">
                <ChartHeader></ChartHeader>
            </div>
            <div class="chart-body">
                <Chart></Chart>
            </div>
            <div class="bottom-area">
                <ChartFooter></ChartFooter>
            </div>
        </div>
        <div id="user-panel">
            <InfoSelectList></InfoSelectList>
        </div>
    </div>
</template>

<script>
import Anychart from 'anychart'
import { mapGetters, mapActions } from 'vuex'
import chartApi from '../api/chart'

import ChartHeader from "./Chart/Header"
import Chart from "./Chart/Chart"
import ChartFooter from "./Chart/Footer"
import InfoSelectList from "./Chart/InfoSelectList"

import location from "../store/modules/getLocation.js"

export default {
    name: "infopage",
    components: {
        ChartHeader,
        Chart,
        ChartFooter,
        InfoSelectList
    },
    data() {
        return {        
        }
    },
    async mounted(){
        console.log("Info-pages mounted!")
        console.log(location.ipLookUp())
        var result = await this.getInfoList()
        var mainCurrency = result["main-currency"]
        var currencyList = result["info-list"]
        var descriptList = result["descript-list"]   //price description => region&unit  e.g. USD: {region: "UNITED STATES OF AMERICA", unit: "DOLLAR"}
        var selectList = []
        var infoPair = []
        currencyList.forEach(currency => {
            if(currency !== mainCurrency){
                infoPair.push(mainCurrency + "_" + currency)
                selectList.push(currency)
            }
            
        });
        var infoPagesPriceData = await this.getInfoPages(infoPair)

        var infoPagesData = {
            mainCurrency: mainCurrency,
            selectList: selectList,
            descriptList: descriptList,
            infoPair: infoPair,
            infoPagesPriceData: infoPagesPriceData         
        }
        this.$store.dispatch('setinfoPagesData', infoPagesData)
        this.$store.dispatch('setInfoPage', infoPagesPriceData['USD_GBP'].slice())
        this.$store.dispatch('setChartTitle', selectList[0])
        this.$store.dispatch('setChartTimescale', "1M")

    },
    methods: {
        async getInfoList(){
            var resp = await chartApi.getInfoList()
            var ret = resp.data
            return ret
        },
        async getInfoPages(infoPair) {
            var resp = await chartApi.getInfoPages(infoPair)
            var ret = resp.data
            console.log("ret")
            return ret
        }
    },
    computed: {
        ...mapGetters(['infoPagesData'])
    }
}
</script>