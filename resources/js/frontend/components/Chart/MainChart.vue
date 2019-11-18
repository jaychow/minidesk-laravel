<template>
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
</template>

<script>
    import ChartHeader from "./Header"
    import Chart from "./Chart"
    import ChartFooter from "./Footer"
    export default {
        components: {
            ChartHeader,
            Chart,
            ChartFooter
        },
    }
</script>