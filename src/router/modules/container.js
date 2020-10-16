/**
 * @description: 内容区所有子路由的集合
 * @param {type}
 * @return {type}
 */
import systemSetArr from './systemSet/systemSet'
const home = () => import('@/pages/homePages/home')

let childrenList = [
  {
    path: '/home',
    name: 'home',

    meta: {
      title: '首页'
    },
    component: home
  },
  ...new Set(systemSetArr)
]

export default childrenList
