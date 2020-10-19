<template>
  <a-layout-sider
    v-model="collapsed"
    :theme="theme"
    :trigger="null"
    collapsible
  >
    <div class="logo">
      <a-dropdown :style="dropStyle">
        <a class="ant-dropdown-link" @click="e => e.preventDefault()">
          <span>
            <img :src="logo" alt="" style="width:20px;height:20px" />
            <a v-if="!collapsed">{{ systemName }}</a>
          </span>
          <a-icon v-if="!collapsed" type="down" />
        </a>
        <a-menu slot="overlay">
          <a-menu-item :key="item.code" v-for="item in orgList">
            <a @click="changeSystem(item)">{{ item.name }}</a></a-menu-item
          >
        </a-menu>
      </a-dropdown>
    </div>
    <a-menu
      mode="inline"
      :open-keys="openKeys"
      @openChange="onOpenChange"
      :defaultSelectedKeys="[$route.name]"
      @click="selectMenu"
    >
      <template v-for="item in menuList">
        <a-sub-menu :key="item.Url">
          <span slot="title">
            <a-icon :type="item.Icon" />
            <span> {{ item.Name }}</span>
          </span>
          <a-menu-item
            :key="childItem.Url"
            v-for="childItem in item.children"
            :title="childItem.Name"
          >
            <router-link :to="{ name: childItem.Url }">
              {{ childItem.Name }}
            </router-link>
          </a-menu-item>
        </a-sub-menu>
      </template>
    </a-menu>
  </a-layout-sider>
</template>
<script>
import { mapMutations, mapState } from 'vuex' //注册 action 和 state
import _ from 'lodash'
import logo from '../../assets/logo.png'
const orgList = [
  { name: '运营管理系统', code: 1, logo: '../../assets/logo.png' },
  { name: '自助机管理系统', code: 2, logo: '../../assets/logo.png' },
  { name: '体检管理系统', code: 3, logo: '../../assets/logo.png' }
]
export default {
  name: 'siderBar',
  computed: {
    ...mapState(['collapsed', 'theme', 'isReloadMenu', 'navList'])
  },
  data() {
    return {
      orgList,
      logo,
      dropStyle: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%'
      },
      // 菜单只展开一个
      rootSubmenuKeys: [],
      openKeys: [],
      systemName: '',
      // 菜单列表
      menuList: []
    }
  },
  watch: {
    isReloadMenu: function(val, oldval) {
      this.getMenuList()
    }
  },
  mounted() {
    this.getMenuList()
  },
  methods: {
    ...mapMutations(['changeNavList', 'changeCurrentNav']),
    changeSystem(e) {
      this.systemName = e.name
    },
    // 菜单展开收起
    onOpenChange(openKeys) {
      const latestOpenKey = openKeys.find(
        key => this.openKeys.indexOf(key) === -1
      )
      if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
        this.openKeys = openKeys
      } else {
        this.openKeys = latestOpenKey ? [latestOpenKey] : []
      }
    },
    selectMenu({ item, key }) {
      let obj = {
        key: key,
        title: item.title,
        active: true
      }
      let arr = this.navList
      let index = _.findIndex(arr, el => {
        return el.key === key
      })
      _.each(arr, el => {
        el.active = false
      })
      if (index !== -1) {
        arr.splice(index, 1, obj)
      } else {
        arr.push(obj)
      }

      this.changeCurrentNav(key)
      this.changeNavList(arr)
      this.$router.push(key)
    },
    // 获取菜单
    getMenuList() {
      this.axios.home.getMenuList().then(res => {
        if (res.Code === 200) {
          // let that = this
          let arr = []
          // 如果菜单的parent为null，则为一级菜单，
          _.each(res.Data, el => {
            if (!el.Parent) {
              // 一级菜单
              el.children = []
              arr.push(el)
              this.rootSubmenuKeys.push(el.Url)
            }
          })
          this.openKeys[0] = this.rootSubmenuKeys[0]
          // 将二级菜单插入到1级菜单内
          _.each(res.Data, el => {
            _.each(arr, item => {
              if (el.Parent && el.Parent === item.Id) {
                item.children.push(el)
              }
            })
          })

          this.menuList = arr
        }
      })
    }
  }
}
</script>
<style lang="less" scoped></style>
