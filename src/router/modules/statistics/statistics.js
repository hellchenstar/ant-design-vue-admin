// 系统设置
const statistics = () => import('@/pages/statistics/index')
const appointmentStatistics = () =>
  import('@/pages/statistics/appointmentStatistics/appointmentStatistics')

const statisticsArr = [
  {
    path: '/statistics',
    name: 'statistics',
    component: statistics,
    children: [
      {
        path: '/appointmentStatistics',
        name: 'appointmentStatistics',
        meta: {
          title: '预约统计管理'
        },
        component: appointmentStatistics
      }
    ]
  }
]

export default statisticsArr
