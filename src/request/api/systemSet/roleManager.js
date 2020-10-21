// 具体api接口方法

import base from '../../baseUrl' // 导入接口域名列表
import axios from '../../http' // 导入http中创建的axios实例
// import qs from 'qs' // 根据需求是否导入qs模块

const roleManager = {
  // 列表
  list(params) {
    return axios.post(`${base.dev}/role/Page`, params)
  },
  // 详情
  detail(id) {
    return axios.get(`${base.dev}/role/Get/${id}`)
  },
  // 新增更新菜单
  upDate(params) {
    return axios.post(`${base.dev}/role/Post`, params)
  },
  // 获取角色和菜单关系列表
  roleAndMenuList(id) {
    // type:1、根据角色查菜单，2、根据菜单查角色
    return axios.get(`${base.dev}/rolemenu/Get/${id}?type=1`)
  },
  // 更新角色授权菜单
  updateRoleAndMenu(params) {
    return axios.post(`${base.dev}/rolemenu/BatchUpdate`, params)
  }
}

export default roleManager
