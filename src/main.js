import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import ElementUI from 'element-ui';
import { http } from './http.js'
import CONFIG from '../config'
import { Swipe, SwipeItem } from 'vant'
import VideoPlayer from 'vue-video-player'
import { Lazyload } from 'vant';
import VueCanvasPoster from 'vue-canvas-poster'

import 'element-ui/lib/theme-chalk/index.css'

const wx = require("weixin-js-sdk");
require('./mock/index.js');
require('video.js/dist/video-js.css')

Vue.config.productionTip = false

Vue.use(ElementUI);
Vue.use(VideoPlayer);
Vue.use(Swipe);
Vue.use(SwipeItem);
Vue.use(Lazyload);
Vue.use(VueCanvasPoster)

Vue.prototype.$wx = wx;
Vue.prototype.$http = http;
Vue.prototype.$config = CONFIG;
Vue.prototype.$global = {
  get agent_id () {
    return sessionStorage.getItem('global_variables_agent_id');
  },
  set agent_id (val) {
    sessionStorage.setItem('global_variables_agent_id', val);
  },
  get company_id () {
    return sessionStorage.getItem('global_variables_company_id');
  },
  set company_id (val) {
    sessionStorage.setItem('global_variables_company_id', val);
  },
  get tmp_uid () {
    return sessionStorage.getItem('global_variables_tmp_uid');
  },
  set tmp_uid (val) {
    sessionStorage.setItem('global_variables_tmp_uid', val);
  },
  get browser () {
    return sessionStorage.getItem('global_variables_browser');
  },
  set browser (val) {
    sessionStorage.setItem('global_variables_browser', val);
  },
  get parm () {
    return sessionStorage.getItem('global_variables_parm');
  },
  set parm (val) {
    sessionStorage.setItem('global_variables_parm', val);
  },

  // 账号id
  client_id: 'msd0c28f00413d6c95',
  // 账号密码
  secret: 'a89c4996d0c28f00413d6c95ff6e4a2a',
};

new Vue({
  router,
  data() {
  	return {
  	}
  },
  render: h => h(App)
}).$mount('#app')
