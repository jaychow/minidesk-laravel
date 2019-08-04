import api from './api'

export default {
    async getTable(pair, timerange, status, interval) {
        return api().get('/chart/getTable', {
            params: {
                pair: pair,
                timeRange: timerange,
                utc: 0,
                status: status,
                interval: interval
            }
        })
    }
}
