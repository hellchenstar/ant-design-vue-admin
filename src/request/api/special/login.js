// 具体api接口方法

import base from '../../baseUrl' // 导入接口域名列表
import axios from '../../http' // 导入http中创建的axios实例
import qs from 'qs' // 根据需求是否导入qs模块

const login = {
  // 登录,获取token
  loginSub(params) {
    return axios.get(`${base.test}/token/Get`, { params: params })
  },
  // 获取登录用户信息
  getUserInfo() {
    return axios.get(`${base.dev}/user/Get`)
  },
  // post提交
  submit(params) {
    return axios.post(`${base.test}/accesstoken`, qs.stringify(params))
  }
  // 其他接口…………
}

export default login
