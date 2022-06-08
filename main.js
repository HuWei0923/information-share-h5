
// #ifndef VUE3
import Vue from 'vue'
import App from './App'
//引用并设置环境变量
import '.env.js'
import {router,RouterMount} from './router/router.js'  //路径换成自己的
Vue.use(router)

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
//v1.3.5起 H5端 你应该去除原有的app.$mount();使用路由自带的渲染方式
// #ifdef H5
	RouterMount(app,router,'#app')
// #endif
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