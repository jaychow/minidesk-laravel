<template>
    <div id="Minidesk">
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
    </div>
</template>
<script>
    import ChartHeader from "./Chart/Header"
    import Chart from "./Chart"
    import Sidebar from "./Sidebar"
    import ChartFooter from "./Chart/Footer"

    export default {
        components: {
            ChartHeader,
            Chart,
            Sidebar,
            ChartFooter
        }
    }

</script>
