
// #ifndef VUE3
import Vue from 'vue'
import App from './App'
//引用并设置环境变量
import '.env.js'
Vue.config.productionTip = false
import Dialog from './wxcomponents/vant/dialog/dialog'
Vue.prototype.$Dialog=Dialog

import Notigy from './wxcomponents/vant/notify/notify'
Vue.prototype.$notify=Notigy

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif