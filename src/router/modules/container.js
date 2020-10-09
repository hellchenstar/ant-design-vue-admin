// 内容区所有子路由的集合

import systemSetArr from './systemSet/systemSet'
import userManager from './systemSet/userManager'

let childrenList = [...new Set(systemSetArr), ...new Set(userManager)]

export default childrenList
