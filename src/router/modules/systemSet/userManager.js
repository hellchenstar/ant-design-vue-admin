// 系统设置
const patientManager = () =>
  import('@/pages/systemSet/userManager/patientManager')
const appointmentStatistics = () =>
  import('@/pages/systemSet/userManager/appointmentStatistics')
const userManager = [
  {
    path: '/patientManager',
    name: 'patientManager',
    meta: {
      title: '患者管理'
    },
    component: patientManager
  },
  {
    path: '/appointmentStatistics',
    name: 'appointmentStatistics',
    meta: {
      title: '预约统计'
    },
    component: appointmentStatistics
  }
]

export default userManager
