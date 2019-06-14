import Vue from 'vue'
import Vuex, {createLogger} from 'vuex'
import chart from './modules/chart'
import settings from './modules/settings'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
    modules: {
        chart,
        settings
    }
})
