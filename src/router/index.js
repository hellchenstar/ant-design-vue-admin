import Vue from 'vue'
import Router from 'vue-router'
// 特殊 special
import special from './modules/special'

// 处理路由冗余报错问题
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router)

const routeDefault = [
  {
    path: '/',
    redirect: '/login'
  }
]
const routes = [...new Set(routeDefault), ...new Set(special)]
let router = new Router({
  mode: 'hash',
  routes
})
router.beforeEach((to, from, next) => {
  if (to.name === 'login') {
    sessionStorage.removeItem('accessToken')
    sessionStorage.removeItem('refreshToken')
  } else {
    let token = sessionStorage.getItem('accessToken')
    if (token) {
      next()
    } else {
      next('/')
    }
  }
  next()
})
export default router
