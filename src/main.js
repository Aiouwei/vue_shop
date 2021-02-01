import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
//  引入全局样式
import './assets/css/global.css'

import axios from 'axios'
//  配置请求根路径
// axios.defaults.baseURL = 'http://127.0.0.1:888/api/private/v1/'
// axios.defaults.baseURL = 'http://119.23.53.78:8888/api/private/v1/'
axios.defaults.baseURL = 'http://www.ysqorz.top:8888/api/private/v1/'

axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // console.log(config)
  return config
})
// axios.interceptors.response.use(config => {

// })
Vue.prototype.$axios = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
