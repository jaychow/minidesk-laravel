
/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

import '../bootstrap';
import '../plugins';
import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
window.Vue = Vue;
window.$ = require('jquery');
window.JQuery = require('jquery');
/**
 * The following block of code may be used to automatically register your
 * Vue components. It will recursively scan this directory for the Vue
 * components and automatically register them with their "basename".
 *
 * Eg. ./components/ExampleComponent.vue -> <example-component></example-component>
 */

// Chart Components
Vue.component('chart-header', require('./components/Chart/Header.vue'));
Vue.component('chart', require('./components/Chart.vue'));
Vue.component('chart-footer', require('./components/Chart/Footer.vue'));
// Sidebar Components
Vue.component('sidebar', require('./components/Sidebar.vue'));

// const files = require.context('./', true, /\.vue$/i)

// files.keys().map(key => {
//     return Vue.component(_.last(key.split('/')).split('.')[0], files(key))
// })

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

const app = new Vue({
    el: '#app',
    data() {
        return {
            ticketInputs: {},
            chartSettings: {},
            today: new Date(),
            homeCurrency: '',
            foreignCurrency: ''
        }
    },
    created() {
        console.log("App created");
        this.initTicketInputs();
        this.initChartSettings();
    },
    methods: {
        initTicketInputs() {
            this.ticketInputs['homeCurrency'] = "";
            this.ticketInputs['foreignCurrency'] = "";
            this.ticketInputs['tradeType'] = "";
            this.ticketInputs['tradeDate'] = "";
            this.ticketInputs['transactionAmount'] = 0;
            this.ticketInputs['timescale'] = "1Y";
        },
        initChartSettings() {
            this.chartSettings['pair'] = "";
            this.chartSettings['timescale'] = "1Y";
            this.chartSettings['ylabelType'] = "price";
            this.chartSettings['type'] = "candle";
            this.chartSettings['refreshInterval'] = "M10";
            // adding timezone info
            this.chartSettings['utc'] = -(this.today.getTimezoneOffset() / 60);
        },
        changeHomeCurrency(currency) {
            this.homeCurrency = currency;
            this.chartSettings['pair'] = "";
            this.ticketInputs['homeCurrency'] = currency;
            this.ticketInputs['foreignCurrency'] = "";
        },
        changeForeignCurrency(currency) {
            this.foreignCurrency = currency;
        }
    }

});
