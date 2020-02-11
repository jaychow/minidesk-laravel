import Vue from 'vue';
import VueRouter from 'vue-router';
import Assess from './components/Flow/Assess.vue'
import Analyze from './components/Flow/Analyze.vue'
import Hedge from './components/Flow/Hedge.vue'
import Save from './components/Flow/Save.vue'
import Manage from './components/Flow/Manage.vue'
Vue.use(VueRouter);



var router = new VueRouter({
    base: '/',
    // mode: 'history',
    routes: [
        { path: '/', redirect: '/Assess' },
        { path: '/Assess', component: Assess },
        { path: '/Analyze', component: Analyze },
        { path: '/Hedge', component: Hedge },
        { path: '/Save', component: Save },
        { path: '/Manage', component: Manage }
    ]}
);

export default router