import axios from 'axios'
import chartApi from '../../api/chart'

const state = {
    flow: {
        type: "ASSESS",
        subflow: 0
    },
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
            today: new Date(),
            showChart: true
        },
        data: {},
        chartTitle: "",
    },
    homeCurrency: 'USD',
    foreignCurrency: '',
    infoPagesData: {
        mainCurrency: "",
        selectList: [],
        infoPair: [],
        infoPagesPriceData: {}    
    },
    amount : {
        symbol: "$",
        targetSymbol: "$",
        price: "",
        prices: []
    },
    assessFormData: {},
    message: "",
    alert:{
        class: "",
        msgs: ""
    },
    tradeDateArr: []
}

const getters = {
    flow: (state) => state.flow,
    today: () => new Date(),
    tradeDate: (state) => (new Date().toISOString().substr(0,10)),
    tradeDateArr: (state) => state.tradeDateArr,
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
    amount: (state) => (state.amount),
    showMainChart: (state) => (state.chart.settings.showChart),
    chartTitle: (state) => (state.chart.chartTitle),
    infoPagesData: (state) => (state.infoPagesData),
    message: (state) => (state.message),
    alert: (state) => state.alert
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

            // console.log(data.jsonHistoryData)
            commit('UPDATE_CHART_DATA', data)
            // commit('UPDATE_CHART_TITLE', this.getters.pair)
            // commit('UPDATE_CHART_TITLE', this.getters.foreignCurrency)

            commit('UPDATE_LOADING', false)
        } catch (err) {
            console.error(err)
        }
    },
    setInfoPage: ({commit, dispatch}, dataIn) => {
        let data = {}
        data.jsonHistoryData = dataIn
        commit('UPDATE_CHART_DATA', data)
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
    setPair:({commit, dispatch}, pair) => {
        commit('UPDATE_PAIR', pair)
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
    setFlow: ({commit}, flow) =>{
        commit('UPDATE_FLOW', flow)
    },
    setRefreshInterval: ({commit}, interval) => {
        commit('UPDATE_INTERVAL', interval)
    },
    setAmount: ({commit}, amount) => {
        commit('UPDATE_AMOUNT', amount)        
    },
    setShowMainChart: ({commit}, show) =>{
        commit('UPDATE_SHOWMAINCHART', show)
    },
    setChartTitle: ({commit}, title) =>{
        commit('UPDATE_CHART_TITLE', title)
    },
    setinfoPagesData: ({commit}, infoPagesData) =>{
        commit('UPDATE_INFO_PAGES_DATA', infoPagesData)
    },
    setMessage: ({commit}, message) =>{
        commit('UPDATE_MESSAGE', message)
    },
    setAlert: ({commit}, alert) => {
        commit('UPDATE_ALERT', alert)
    },
    setTradeDates: ({commit}, tradeDates) => {
        console.log(tradeDates)
        commit('UPDATE_TRADE_DATES', tradeDates)
    },
}

const mutations = {
    UPDATE_CHART_DATA: (state, data) => (state.chart.data = data),
    UPDATE_HOME_CURRENCY: (state, currency) => (state.homeCurrency = currency),
    UPDATE_FOREIGN_CURRENCY: (state, currency) => (state.foreignCurrency = currency),
    UPDATE_PAIR: (state, pair) => (state.chart.settings.pair = pair),
    UPDATE_CHART_TIMESCALE: (state, timescale) => (state.chart.settings.timescale = timescale),
    UPDATE_CHART_TYPE: (state, type) => (state.chart.settings.type = type),
    UPDATE_CHART_Y_LABEL_TYPE: (state, type) => (state.chart.settings.yLabelType = type),
    UPDATE_TRADE_TYPE: (state, type) => (state.chart.settings.tradeType = type),
    UPDATE_LOADING: (state, loading) => (state.chart.settings.isLoading = loading),
    UPDATE_FLOW: (state, flow) => (state.flow = flow),
    UPDATE_INTERVAL: (state, interval) => (state.chart.settings.refreshInterval = interval),
    UPDATE_AMOUNT: (state, amount) => (state.amount = amount),
    UPDATE_SHOWMAINCHART: (state, show) => (state.chart.settings.showChart = show),
    UPDATE_CHART_TITLE: (state, title) => (state.chart.chartTitle = title),
    UPDATE_INFO_PAGES_DATA: (state, infoPagesData) => (state.infoPagesData = infoPagesData),
    UPDATE_MESSAGE: (state, message) => (state.message = message),
    UPDATE_ALERT: (state, alert) => (state.alert = alert),
    UPDATE_TRADE_DATES: (state, tradeDates) => (state.tradeDateArr = tradeDates),
}

export default {
    state,
    getters,
    actions,
    mutations
}
