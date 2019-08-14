import axios from 'axios'
import chart from '../../api/chart'
import options from './chart/options'

const state = {
    chart: {
        settings: {
            pair: '',
            timescale: "1Y",
            yLabelType: "price",
            type: "candle",
            refreshInterval: "M10",
            utc: - (new Date().getTimezoneOffset() / 60),
            today: new Date()
        },
        options: options,
        data: {}
    },
    homeCurrency: '',
    foreignCurrency: ''
}

const getters = {
    today: (state) => state.chart.settings.today,
    tradeDate: (state) => (state.chart.settings.today.toISOString().substr(0,10)),
    chartOptions: (state) => state.chart.options,
    chartData:  (state) => state.chart.data,
    chartSettings: (state) => state.chart.settings,
    homeCurrency: (state) => state.homeCurrency,
    foreignCurrency: (state) => state.foreignCurrency,
    pair: (state) => (state.homeCurrency + '_' + state.foreignCurrency),
    chartType: (state) => (state.chart.settings.type),
    chartYLabelType: (state) => (state.chart.settings.yLabelType)
}

const actions  = {
    async fetchChartData({commit}) {
        try {
            if(!this.getters.homeCurrency) {
                return
            }
            if(!this.getters.foreignCurrency) {
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

            let response = await chart.getTable(
                this.getters.pair,
                this.getters.chartSettings.timescale,
                false,
                this.getters.chartSettings.refreshInterval
            )
            data.jsonHistoryData = response.data.slice()
            
            // response = await chart.getZone(
            //     this.getters.pair,
            //     "true",
            //     data.jsonHistoryData[0][5]
            // ) 
            
            // data.jsonZonesData = response.data

            console.log(data.jsonHistoryData)
            commit('UPDATE_CHART_DATA', data)
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
    }
}

const mutations = {
    UPDATE_CHART_DATA: (state, data) => (state.chart.data = data),
    UPDATE_HOME_CURRENCY: (state, currency) => (state.homeCurrency = currency),
    UPDATE_FOREIGN_CURRENCY: (state, currency) => (state.foreignCurrency = currency),
    UPDATE_CHART_TIMESCALE: (state, timescale) => (state.chart.settings.timescale = timescale),
    UPDATE_CHART_TYPE: (state, type) => (state.chart.settings.type = type),
    UPDATE_CHART_Y_LABEL_TYPE: (state, type) => (state.chart.settings.yLabelType = type),
}

export default {
    state,
    getters,
    actions,
    mutations
}
