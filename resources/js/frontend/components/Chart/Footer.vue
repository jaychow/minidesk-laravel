<template>
    <div class="chart-footer">
        <div class="timescale-area" id="timescaleButton">
            <button class="timescaleButton" id="1WButton" value="1W">1W</button>
            <button class="timescaleButton" id="1MButton" value="1M">1M</button>
            <button class="timescaleButton" id="3MButton" value="3M">3M</button>
            <button class="timescaleButton" id="6MButton" value="6M">6M</button>
            <button class="timescaleButton" id="1YButton" value="1Y" disabled>1Y</button>
            <button class="timescaleButton" id="5YButton" value="5Y">5Y</button>
        </div>
        <div class="candleLine-area" id="candleLineButton">
            <button class="chartAreaButton candleLineButton" id="candleButton" value="candle" disabled>Candle</button>
            <button class="chartAreaButton candleLineButton" id="lineButton" value="line">Line</button>
        </div>
    </div>
</template>

<script>
    export default {
        mounted() {
            console.log('ChartFooter Mounted!')
        }
    }
</script>
