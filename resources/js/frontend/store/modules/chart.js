import axios from 'axios';

const state = {
    data: [],
};

const getters = {
    getData: (state) => state.data,
    getOptions:  (state) => state.options
};

const actions  = {
    async fetchData({commit}, params) {
        const response = await axios.get(window.APP_URL + '/chart/getTable',{
            params: {
                pair: params['pair'],
                timeRage: params['timeRange'],
                status: params['status'],
                interval: params['interval'],
            }
        });

        commit('setData', response.data);
    }
};

const mutations = {
    setData: (state, data) => (state.data = data)

};

export default {
    state,
    getters,
    actions,
    mutations
}
