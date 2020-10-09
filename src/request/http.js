// import Vue from 'vue'
import axios from 'axios'
import router from '@/router/index'
import base from './baseUrl'
import store from '@/store/index'

/**
 * 提示函数
 * 禁止点击蒙层、显示一秒后关闭
 */

/*
*请求超时函数
/**
 * 跳转登录页
 * 携带当前页面路由，以期在登录页面完成登录后返回当前页面
 */
const toLogin = () => {
  let refreshToken = sessionStorage.getItem('refreshToken')
  let url = `${base.dev}/refreshtoken/Get?refresh_token=${refreshToken}`

  store.commit('changeIsRefresh', false)
  axios
    .get(url)
    .then(res => {
      if (res.data.Code === 200) {
        sessionStorage.removeItem('accessToken')
        sessionStorage.setItem('accessToken', res.Data.access_token)
        sessionStorage.setItem('refreshToken', res.Data.refresh_token)
        store.commit('changeIsRefresh', true)
      }
    })
    .catch(err => {
      console.log('err==>', err)
      router.replace('login')
    })
}

/**
 * 请求失败后的错误统一处理
 * @param {Number} status 请求失败的状态码
 */
const errorHandle = (status, message) => {
  // 状态码判断
  switch (status) {
    // 401: 授权失败，需要重新请求token，或者跳转登录页
    case 401:
      toLogin()
      break
    case 403:
      // 无权限,提示无权限信息
      // 403 token失效，请求刷新token，刷新token也失效，再跳转登录页
      break
    // 404请求不存在
    case 404:
      break
    case 500:
      break
    default:
      console.log(message)
  }
}

// 创建axios实例
let instance = axios.create({
  timeout: 1000 * 10
})

/**
 * 请求拦截器
 * 每次请求前，如果存在token则在请求头中携带token
 */
instance.interceptors.request.use(
  // 登录流程控制中，根据本地是否存在token判断用户的登录情况
  // 但是即使token存在，也有可能token是过期的，所以在每次的请求头中携带token
  // 后台根据携带的token判断用户的登录情况，并返回给我们对应的状态码
  // 而后我们可以在响应拦截器中，根据状态码进行一些统一的操作。
  config => {
    const aToken = sessionStorage.getItem('accessToken')
    aToken && (config.headers['token'] = aToken)
    config.headers['Content-Type'] = 'application/json'
    return config
  },
  error => Promise.error(error)
)
// 响应拦截器
instance.interceptors.response.use(
  // 请求成功
  res => {
    return res.status === 200 ? Promise.resolve(res.data) : Promise.reject(res)
  },
  // 请求失败
  error => {
    const { response } = error
    if (response) {
      // 请求已发出，但是不在2xx的范围
      errorHandle(response.status, response.data.message)
      return Promise.reject(response)
    } else {
      // 处理断网的情况
      // eg:请求超时或断网时，更新state的network状态
      // network状态在app.vue中控制着一个全局的断网提示组件的显示隐藏(暂未使用)
      // 关于断网组件中的刷新重新获取数据，会在断网组件中说明
      if (!window.navigator.onLine) {
        // store.commit("changeNetwork", false)
      } else {
        return Promise.reject(error)
      }
    }
  }
)

export default instance
