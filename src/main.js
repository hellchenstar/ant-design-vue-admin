/** @format */

import Vue from 'vue'
import App from './App.vue'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.less'
import router from './router'
import store from './store/index'
import api from './request/api/index'

import './global.less'
Vue.use(Antd)
Vue.config.productionTip = false
Vue.prototype.axios = api
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
