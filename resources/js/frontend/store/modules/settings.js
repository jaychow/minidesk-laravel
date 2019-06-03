const state = {
    settings: {
        pair: '',
        timescale: "1Y",
        yLabelType: "price",
        type: "candle",
        refreshInterval: "M10",
        utc: - (new Date().getTimezoneOffset() / 60)
    },
    homeCurrency: '',
    foreignCurrency: ''
}

const mutations = {
    updateHomeCurrency(state, currency) {
        state.homeCurrency = currency;
    },
    updateForeignCurrency(state, currency) {
        state.foreignCurrency = currency;
    }
}

const actions = {
    setHomeCurrency: ({commit}, currency) => {
        commit('updateHomeCurrency', currency);
    },
    setForeignCurrency: ({commit}, currency) => {
        commit('updateForeignCurrency', currency);
    }
}

const getters = {
    getChartSettings: (state) => state.settings,
    getHomeCurrency: (state) => state.homeCurrency,
    getForeignCurrency: (state) => state.foreignCurrency,
}

export default {
    state,
    mutations,
    actions,
    getters,
}
