// 具体api接口方法

import base from '../../baseUrl' // 导入接口域名列表
import axios from '../../http' // 导入http中创建的axios实例
import qs from 'qs' // 根据需求是否导入qs模块

const verifyCode = {
  // 获取验证码
  getVadiCode() {
    return axios.post(`${base.test}/GetVadiCode`)
  },
  // 验证验证码
  checkVcode(params) {
    return axios.post(`${base.test}/CheckVadiCode`, qs.stringify(params))
  }

  // 其他接口…………
}

export default verifyCode
