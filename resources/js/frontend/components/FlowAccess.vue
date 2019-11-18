<template>
    <div class="minidesk-bottom">
        <MainChart></MainChart>
        <div id="user-panel">
            <transition name="slide-fade">
                <component :is="flow"></component>
            </transition> 
        </div>
        
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import MainChart from "./Chart/MainChart"
    import InfoSelectList from "./Chart/InfoSelectList"
    import Sidebar from "./Sidebar"
    export default {
        components: {
            MainChart,
            InfoSelectList,
            Sidebar,
        },
        mounted() {
            
        },
        data(){
            return {
                flow: "InfoSelectList"
            }
        },
        methods:{
            
        },
        computed: {
            
        },
        watch: {

        }
    }
</script>>