import Vue from 'vue'
import Vuex from 'vuex' //引入 vuex

Vue.use(Vuex) //使用 vuex

const state = {
  // token失效，重新请求刷新token
  isRefresh: false,
  // 刷新菜单
  isReloadMenu: false,
  // 初始化状态
  collapsed: false,
  // 主题色
  theme: 'dark',
  // 用户昵称和头像
  userInfo: {
    userName: '',
    avatar: ''
  }
}
const mutations = {
  changeCollapsed(state, params) {
    state.collapsed = params
  },
  changeTheme(state, params) {
    state.theme = params
  },
  changeIsRefresh(state, params) {
    state.isRefresh = params
  },
  changeUserInfo(state, params) {
    state.userInfo.userName = params.userName
    state.userInfo.avatar = params.avatar
  },
  reloadMenu(state, params) {
    state.isRefresh = params
  }
}
export default new Vuex.Store({
  state,
  mutations
})
