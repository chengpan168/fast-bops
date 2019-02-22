import Vue from 'vue';
// plugins
import './plugins/iview.js';
import './plugins/components.js';
import './plugins/titan.js';
import Config from '@plugins/config';
import http from '@plugins/http';
import LocalStore from '@plugins/localStore';
import Util from '@plugins/utils';
import store from './store';
import router from './router';
import App from './App.vue';


Vue.use(Config);
Vue.use(http);
Vue.use(LocalStore);
Vue.use(Util);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
