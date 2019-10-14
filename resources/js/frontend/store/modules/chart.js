import axios from 'axios'
import chartApi from '../../api/chart'

const state = {
    flow: "ASSESS",
    chart: {
        settings: {
            pair: '',
            timescale: "1Y",
            yLabelType: "price",
            type: "candle",
            refreshInterval: "M10",
            utc: - (new Date().getTimezoneOffset() / 60),
            tradeType: "",
            isLoading: false,
            today: new Date()
        },
        data: {}
    },
    homeCurrency: '',
    foreignCurrency: '',
    amountInput : 0
}

const getters = {
    flow: (state) => state.flow,
    today: (state) => state.chart.settings.today,
    tradeDate: (state) => (state.chart.settings.today.toISOString().substr(0,10)),
    chartData:  (state) => state.chart.data,
    chartSettings: (state) => state.chart.settings,
    homeCurrency: (state) => state.homeCurrency,
    foreignCurrency: (state) => state.foreignCurrency,
    pair: (state) => {
        if(state.chart.settings.tradeType !== "sell")
            return (state.foreignCurrency + '_' + state.homeCurrency)
        else
            return (state.homeCurrency + '_' + state.foreignCurrency)
    },
    chartType: (state) => (state.chart.settings.type),
    chartYLabelType: (state) => (state.chart.settings.yLabelType),
    tradeType: (state) => (state.chart.settings.tradeType),
    loading: (state) => (state.chart.settings.isLoading),
    refreshInterval: (state) => (state.chart.settings.refreshInterval),
    amountInput : (state) => (state.amountInput),
}

const actions  = {
    async fetchChartData({commit}) {
        try {
            if(!this.getters.homeCurrency || this.getters.homeCurrency === "") {
                return
            }
            if(!this.getters.foreignCurrency || this.getters.foreignCurrency === "") {
                return
            }
            if(!this.getters.chartSettings.timescale) {
                return
            }
            if(!this.getters.chartSettings.refreshInterval) {
                return
            }

            console.log({
                pair:this.getters.pair,
                timescale: this.getters.chartSettings.timescale,
                status: false,
                interval: this.getters.chartSettings.refreshInterval
            })
            
            let data = {}
            commit('UPDATE_LOADING', true)
            let response = await chartApi.getTable(
                this.getters.pair,
                this.getters.chartSettings.timescale,
                false,
                this.getters.chartSettings.refreshInterval
            )
            data.jsonHistoryData = response.data.slice()
            
            // response = await chartApi.getZone(
            //     this.getters.pair,
            //     "true",
            //     data.jsonHistoryData[0][5]
            // ) 
            // console.log(response)
            // data.jsonZonesData = response.data

            console.log(data.jsonHistoryData)

            commit('UPDATE_CHART_DATA', data)
            commit('UPDATE_LOADING', false)
        } catch (err) {
            console.error(err)
        }
    },
    setHomeCurrency: ({commit, dispatch}, currency) => {
        commit('UPDATE_HOME_CURRENCY', currency)
        if(state.foreignCurrency !== '' && state.homeCurrency !== '' && state.homeCurrency!== state.foreignCurrency)
            dispatch('fetchChartData')
    },
    setForeignCurrency: ({commit, dispatch}, currency) => {
        commit('UPDATE_FOREIGN_CURRENCY', currency)
        if(state.homeCurrency !== '' && state.foreignCurrency !== '' && state.homeCurrency!== state.foreignCurrency)
            dispatch('fetchChartData')
    },
    setChartTimescale: ({commit, dispatch}, timescale) => {
        console.log('setChartTimescale')
        commit('UPDATE_CHART_TIMESCALE', timescale)
        dispatch('fetchChartData')
    },
    setChartType: ({commit, dispatch}, type) => {
        console.log('setChartType')
        commit('UPDATE_CHART_TYPE', type)
        // dispatch('fetchChartData')
    },
    setYLabelType: ({commit, dispatch}, type) => {
        commit('UPDATE_CHART_Y_LABEL_TYPE', type)
        // dispatch('fetchChartData')
    },
    setTradeType: ({commit, dispatch}, type) => {
        commit('UPDATE_TRADE_TYPE', type)
        dispatch('fetchChartData')
    },
    setLoading: ({commit, dispatch}, loading) => {
        commit('UPDATE_LOADING', loading)
        // dispatch('fetchChartData')
    },
    setFlow: ({commit, dispatch}, flow) =>{
        commit('UPDATE_FLOW', flow)
    },
    setRefreshInterval: ({commit, dispatch}, interval) => {
        commit('UPDATE_INTERVAL', interval)
    },
    setAmount: ({commit, dispatch}, amount) => {
        commit('UPDATE_AMOUNT', amount)        
    }
}

const mutations = {
    UPDATE_CHART_DATA: (state, data) => (state.chart.data = data),
    UPDATE_HOME_CURRENCY: (state, currency) => (state.homeCurrency = currency),
    UPDATE_FOREIGN_CURRENCY: (state, currency) => (state.foreignCurrency = currency),
    UPDATE_CHART_TIMESCALE: (state, timescale) => (state.chart.settings.timescale = timescale),
    UPDATE_CHART_TYPE: (state, type) => (state.chart.settings.type = type),
    UPDATE_CHART_Y_LABEL_TYPE: (state, type) => (state.chart.settings.yLabelType = type),
    UPDATE_TRADE_TYPE: (state, type) => (state.chart.settings.tradeType = type),
    UPDATE_LOADING: (state, loading) => (state.chart.settings.isLoading = loading),
    UPDATE_FLOW: (state, flow) => (state.flow = flow),
    UPDATE_INTERVAL: (state, interval) => (state.chart.settings.refreshInterval = interval),
    UPDATE_AMOUNT: (state, amount) => (state.amountInput = amount),
}

export default {
    state,
    getters,
    actions,
    mutations
}
