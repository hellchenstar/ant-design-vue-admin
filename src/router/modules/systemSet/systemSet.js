// 系统设置
const MenuManager = () => import('@/pages/systemSet/menuManager/MenuManager')
const CompanyManager = () =>
  import('@/pages/systemSet/orgManager/CompanyManager')
const UserManager = () => import('@/pages/systemSet/userManager/UserManager')
const RoleManager = () => import('@/pages/systemSet/roleManager/RoleManager')
const systemSet = () => import('@/pages/systemSet/index')
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
        path: '/CompanyManager',
        name: 'CompanyManager',
        meta: {
          title: '机构管理'
        },
        component: CompanyManager
      },

      {
        path: '/UserManager',
        name: 'UserManager',
        meta: {
          title: '用户管理'
        },
        component: UserManager
      }
    ]
  }
]

export default systemSetArr
