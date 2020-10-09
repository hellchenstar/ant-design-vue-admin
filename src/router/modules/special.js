import childrenList from './container'

// 特殊 special  主要为登录，首页，注册，已经部分组件测试路由
const login = () => import('@/pages/homePages/login')
const home = () => import('@/pages/homePages/home')
const index = () => import('@/pages/homePages/index')
const special = [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: '登录'
    },
    component: login
  },
  {
    path: '/index',
    name: 'login',
    redirect: '/home',
    meta: {
      title: '主页'
    },
    component: index
  },
  {
    path: '/home',
    name: 'home',

    meta: {
      title: '首页'
    },
    children: childrenList,
    component: home
  }
]

export default special
