// 系统设置
const MenuManager = () => import('@/pages/systemSet/menuManager/MenuManager')
const RoleManager = () => import('@/pages/systemSet/roleManager/RoleManager')
const UserManager = () => import('@/pages/systemSet/userManager/UserManager')
const systemSet = () => import('@/pages/systemSet/systemSet')
const systemSetArr = [
  {
    path: '/systemSet',
    name: 'systemSet',
    component: systemSet,
    children: [
      {
        path: '/MenuManager',
        name: 'MenuManager',
        meta: {
          title: '菜单管理'
        },
        component: MenuManager
      },
      {
        path: '/RoleManager',
        name: 'RoleManager',
        meta: {
          title: '角色管理'
        },
        component: RoleManager
      },
      {
        path: '/UserManager',
        name: 'UserManager',
        meta: {
          title: '角色管理'
        },
        component: UserManager
      }
    ]
  }
]

export default systemSetArr
