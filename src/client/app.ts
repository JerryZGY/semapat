// Node Modules
import Vue from 'vue';
import VueRouter from 'vue-router';
import BootstrapVue from 'bootstrap-vue';
// Style Modules
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
// Components
import index from './components/index.vue';
import home from './components/home.vue';

const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', component: home },
  ]
});

Vue.use(VueRouter);
Vue.use(BootstrapVue);
Vue.config.silent = true;
Vue.config.devtools = true;
Vue.config.productionTip = false;

const app = new Vue({ el: '#app', router, ...index });
// app.$router = router;