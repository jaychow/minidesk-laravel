import axios from 'axios'
import chart from '../../api/chart'

import options from './chart/options'
const state = {
    chart: {
        options: options,
        data: {}
    }
}

const getters = {
    chartOptions: (state) => state.chart.options,
    chartData:  (state) => state.chart.data
}

const actions  = {
    async fetchChartData({commit}, {pair, timeRange, status, interval}) {
        try {
            const response = await chart.getTable(pair, timeRange, status, interval)
            commit('SET_CHART_DATA', response.data)
        } catch (err) {
            console.error(err)
        }
    }
}

const mutations = {
    SET_CHART_DATA: (state, data) => (state.chart.data = data)
}

export default {
    state,
    getters,
    actions,
    mutations
}
