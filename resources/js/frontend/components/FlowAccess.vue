<template>
    <div class="minidesk-bottom">
        <MainChart></MainChart>
        <div id="user-panel">
            <transition name="slide-fade">
                <component :is="subflow"></component>
            </transition> 
        </div>
        
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import MainChart from "./Chart/MainChart"
    import InfoSelectList from "./Chart/InfoSelectList"
    import Sidebar from "./Sidebar"
    import TransferType from "./Transfer/TransferType"
    import SingleChooseTime from "./Transfer/SingleChooseTime"
    import SingleSetTime from "./Transfer/SingleSetTime"
    import MultiSetTime from "./Transfer/MultiSetTime"
    import RecurringChoose from "./Transfer/RecurringChoose"
    import RecurringRange from "./Transfer/RecurringRange"
    import RecurringSet from "./Transfer/RecurringSet"

    export default {
        components: {
            MainChart,
            InfoSelectList,
            Sidebar,
            TransferType,
            SingleChooseTime,
            SingleSetTime,
            MultiSetTime,
            RecurringChoose,
            RecurringRange,
            RecurringSet
        },
        mounted() {
            
        },
        data(){
            return {
                subflow: "InfoSelectList",
                subflow_ls: ["InfoSelectList", "Sidebar", "TransferType", "SingleChooseTime", 
                            "SingleSetTime", "MultiSetTime", "RecurringChoose", "RecurringRange", "RecurringSet"]
            }
        },
        methods:{
            
        },
        computed: {
            ...mapGetters(['flow'])
        },
        watch: {
            flow: {  
                handler(val){
                    try {
                        this.subflow = this.subflow_ls[val.subflow]
                    } catch (error) {
                        this.subflow = this.subflow_ls[0]
                    }
                },
                deep: true,
            }
        }
    }
</script>>