const state = {
    settings: {
        pair: '',
        timescale: "1Y",
        yLabelType: "price",
        type: "candle",
        refreshInterval: "M10",
        utc: - (new Date().getTimezoneOffset() / 60),
        today: new Date()
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
    today: (state) => state.today,
    getChartSettings: (state) => state.settings,
    getHomeCurrency: (state) => state.homeCurrency,
    getForeignCurrency: (state) => state.foreignCurrency,
    getTradeDate: (state) => {
        return state.settings.today.toISOString().substr(0,10)
    }
}

export default {
    state,
    mutations,
    actions,
    getters,
}
