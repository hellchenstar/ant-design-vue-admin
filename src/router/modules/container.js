/**
 * @description: 内容区所有子路由的集合
 * @param {type}
 * @return {type}
 */
import systemSetArr from './systemSet/systemSet'

let childrenList = [...new Set(systemSetArr)]

export default childrenList
