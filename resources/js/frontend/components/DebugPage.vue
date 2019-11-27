<template>
    <div class="info-page" id="info-page">
        <div class="chart-container" id="chart-container">
            <!-- <div class="top-area">
                <ChartHeader></ChartHeader>
            </div>
            <div class="chart-body">
                <Chart></Chart>
            </div>
            <div class="bottom-area">
                <ChartFooter></ChartFooter>
            </div> -->
        </div>
        <div id="user-panel">
            <transition name="slide-fade">
                <!-- <SingleChooseTime/> -->
                <!-- <SingleSetTime/> -->
                <MultiSetTime/>
                <!-- <RecurringChoose/> -->
                <!-- <RecurringRange/>                 -->
                <!-- <Sidebar/> -->

            </transition>
        </div>
    </div>
</template>

<script>
import Anychart from 'anychart'
import { mapGetters, mapActions } from 'vuex'
import chartApi from '../api/chart'


import TransferType from "./Transfer/TransferType"
import SingleChooseTime from "./Transfer/SingleChooseTime"
import SingleSetTime from "./Transfer/SingleSetTime"
import MultiSetTime from "./Transfer/MultiSetTime"
import RecurringChoose from "./Transfer/RecurringChoose"
import RecurringRange from "./Transfer/RecurringRange"
import RecurringSet from "./Transfer/RecurringSet"
import Sidebar from "./Sidebar"
import location from "../store/modules/getLocation.js"

import AmountInput from "./AmountInput"

export default {
    name: "infopage",
    components: {
        TransferType,
        SingleChooseTime,
        SingleSetTime,
        MultiSetTime,
        RecurringChoose,
        RecurringRange,
        RecurringSet,
        Sidebar,
        AmountInput
    },
    data() {
        return {        
        }
    },
    async mounted(){

        
    },
    methods: {

    },
    computed: {

    }
}
</script>