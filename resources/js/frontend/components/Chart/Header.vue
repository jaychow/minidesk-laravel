<template>
    <div class="chart-header">
        <div class="currency-title">
            <p id="currencyTitle"></p>
        </div>
        <div class="pricePercentage-area" id="pricePercentageButton">
            <button class="chartAreaButton pricePercentageButton" id="userButton" value="user">
                <i class="fa fa-user"></i>
            </button>
            <button class="chartAreaButton pricePercentageButton" id="priceButton" value="price" disabled>$</button>
            <button class="chartAreaButton pricePercentageButton" id="percentButton" value="percent">%</button>
        </div>
    </div>
</template>

<script>
    export default {
        mounted() {
            console.log('ChartHeader Mounted!')
        }
    }
</script>
