<template>
    <div id="Minidesk">
        <div class="minidesk-flow">
            <Flow></Flow>
        </div>
        <!-- <div class="minidesk-bottom" aria-labelledby="logins-part-trigger">
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
                <Sidebar></Sidebar>
            </div>
        </div> -->

    </div>
</template>
<script>
    import ChartHeader from "./Chart/Header"
    import Chart from "./Chart"
    import Sidebar from "./Sidebar"
    import ChartFooter from "./Chart/Footer"
    import Flow from "./Flow"
    
    export default {
        components: {
            ChartHeader,
            Chart,
            Sidebar,
            ChartFooter,
            Flow
        }
    }

</script>
