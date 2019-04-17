import api from './api';

export default {
    getTable(chartSettings) {
        return api().get('/getTable', {
            params: {
                pair: chartSettings['pair'],
                timeRange: argument['timescale'],
                utc: 0,
                status: requestSingleCurrentCurrency,
                interval: argument['refreshInterval']
            }
        });
    }
}
