/**
 * @description: 内容区所有子路由的集合
 * @param {type}
 * @return {type}
 */
import systemSetArr from './systemSet/systemSet'
import statisticsArr from './statistics/statistics'
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
  ...new Set(systemSetArr),
  ...new Set(statisticsArr)
]

export default childrenList
