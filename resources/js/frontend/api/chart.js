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
    },
    async getInfoList(){
        return api().get('/chart/getInfoList')
    },
    async getInfoPages(infoPairList){
        return api().get('/chart/getInfoPages', {
            params: {
                infoPairList: infoPairList,
                utc: 0,
            }
        })
    }
}
