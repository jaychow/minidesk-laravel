import Vue from 'vue';
import Vuex, {createLogger} from 'vuex';
import options from './modules/options';
import settings from './modules/settings';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
    modules: {
        options,
        settings
    }
})
