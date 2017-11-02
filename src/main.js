// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Router from 'vue-router'
import App from './App'
import axios from 'axios'
import routes from './router'
import ElementUI from 'element-ui'
import Moment from 'moment'
import Md5 from '@/assets/js/md5'
import Utils from '@/assets/js/utils'
import Mock from './mock'
import 'element-ui/lib/theme-default/index.css'
import '@/assets/css/base.scss'

Mock.bootstrap()

Vue.use(Router)
Vue.use(ElementUI)

Vue.prototype.$moment = Moment
Vue.prototype.$Md5 = Md5

Vue.directive('title', {
  inserted (el, binding) {
    document.title = el.dataset.title
  }
}) 
Vue.config.productionTip = false
Vue.prototype.$catchError = (err) => {
  if(!err.data) {
    ElementUI.Message('服务器响应错误')
    return;
  }
  if(err.data.code) {
    if(err.data.code === '0000') return;
    ElementUI.Message(err.data.message)
  } else {
    ElementUI.Message('服务器响应超时')
  }
}
const router = new Router({
	routes
})
router.beforeEach((to, from, next) => {
  Vue.prototype.$fromPath = from.path;
  // let user = Utils.getCookie('userId');
  // let logRequired = to.path.indexOf('account') !== -1;
  // if(logRequired && !user) {
  //   ElementUI.Message('当前会话已过期，请重新登录')
  //   return router.push('/login')
  // }
  // NProgress.start()
  next()
})
router.afterEach((to, from, next) => {
  // NProgress.done()
})

axios.interceptors.request.use(config => {
  // console.log(Utils.getToken('CSRF_TOKEN'))
  config.headers['X-Csrf-Token'] = Utils.getToken('CSRF_TOKEN')
  return config;
}, error => {
  return Promise.reject(error)
})
axios.interceptors.response.use(res =>{
  if (res.data.code === '0000') {
    router.push('/login')
    return Promise.reject(res);
  }
  if(res.data.result && res.data.result.redirectUrl) {
    window.location.href = res.data.result.redirectUrl;
  }
  return res;
}, err => {
  return Promise.reject(err)
})
/* eslint-disable no-new */
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
