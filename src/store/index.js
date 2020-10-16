import Vue from 'vue'
import Vuex from 'vuex' //引入 vuex
import createPersistedState from 'vuex-persistedstate'

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
  },
  navList: [{ key: 'home', title: '首页', active: true }],
  currentNav: 'home'
}
const mutations = {
  changeCollapsed(state, params) {
    state.collapsed = params
  },
  changeTheme(state, params) {
    state.theme = params
  },

  changeUserInfo(state, params) {
    state.userInfo.userName = params.userName
    state.userInfo.avatar = params.avatar
  },
  reloadMenu(state, params) {
    state.isReloadMenu = params
  },
  changeNavList(state, params) {
    state.navList = params
  },
  changeCurrentNav(state, params) {
    state.currentNav = params
  }
}
export default new Vuex.Store({
  state,
  mutations,
  plugins: [createPersistedState({ storage: window.sessionStorage })]
})
