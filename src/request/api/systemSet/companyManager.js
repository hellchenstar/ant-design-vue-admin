// 具体api接口方法

import base from '../../baseUrl' // 导入接口域名列表
import axios from '../../http' // 导入http中创建的axios实例
// import qs from 'qs' // 根据需求是否导入qs模块

const company = {
  // 列表
  list(params) {
    return axios.post(`${base.dev}/company/Page`, params)
  },
  detail(id) {
    return axios.get(`${base.dev}/company/Get/${id}`)
  },
  // 新增/更新
  upDate(params) {
    return axios.post(`${base.dev}/company/Post`, params)
  },
  // 获取当前机构下的人员list
  getCurrentOrgUserList(id) {
    // type:1.根据公司id查人员 2.根据人员id查公司
    return axios.get(`${base.dev}/companyuser/Get/${id}?type=1`)
  },
  // 新增公司人员
  addCompanyUser(params) {
    return axios.post(`${base.dev}/companyuser/Post`, params)
  },
  // 新增公司人员
  deleteCompanyUser(params) {
    return axios.post(`${base.dev}/companyuser/Detele`, params)
  }
}

export default company
