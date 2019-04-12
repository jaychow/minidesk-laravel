import chart from '../../api/chart'

// initial state
const state = {
    all: []
}

// getters
const getters = {}

// actions
const actions = {
    async getTable ({ commit }, chartSettings) {
        commit('setTable', await chart.getTable(chartSettings));
    }
}

// mutations
const mutations = {
    setTable (state, products) {
        state.all = products
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
