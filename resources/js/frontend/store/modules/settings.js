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
    UPDATE_HOME_CURRENCY(state, currency) {
        state.homeCurrency = currency
    },
    UPDATE_FOREIGN_CURRENCY(state, currency) {
        state.foreignCurrency = currency
    }
}

const actions = {
    setHomeCurrency: ({commit}, currency) => {
        commit('UPDATE_HOME_CURRENCY', currency)
    },
    setForeignCurrency: ({commit}, currency) => {
        commit('UPDATE_FOREIGN_CURRENCY', currency)
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
