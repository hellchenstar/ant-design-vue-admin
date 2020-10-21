// 具体api接口方法

import base from '../../baseUrl' // 导入接口域名列表
import axios from '../../http' // 导入http中创建的axios实例

const home = {
  // 获取用户信息
  getUserInfo() {
    return axios.get(`${base.test}/user/Get`)
  },

  getUserRole(params) {
    return axios.post(`${base.test}/Values`, params)
  },
  // 获取当前用户菜单列表
  getMenuList() {
    return axios.get(`${base.test}/menu/Get`)
  }
}

export default home
