// 具体api接口方法

import base from '../baseUrl' // 导入接口域名列表
import axios from '../../api' // 导入http中创建的axios实例
// import qs from "qs" // 根据需求是否导入qs模块

const personManage = {
  // 列表
  list() {
    return axios.get(`${base.dev}/token`)
  }

  // 其他接口…………
}

export default personManage
