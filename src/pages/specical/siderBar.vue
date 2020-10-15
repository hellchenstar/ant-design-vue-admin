<template>
  <a-layout-sider
    v-model="collapsed"
    :theme="theme"
    :trigger="null"
    collapsible
  >
    <div class="logo" />
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
          <a-menu-item :key="childItem.Url" v-for="childItem in item.children">
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
import { mapState } from 'vuex' //注册 action 和 state
import _ from 'lodash'
export default {
  name: 'siderBar',
  computed: {
    ...mapState(['collapsed', 'theme', 'isReloadMenu'])
  },
  data() {
    return {
      // 菜单只展开一个
      rootSubmenuKeys: [],
      openKeys: [],
      // 菜单列表
      menuList: []
    }
  },
  watch: {
    isReloadMenu: function(val, oldval) {
      console.log(val)
      this.getMenuList()
    }
  },
  mounted() {
    this.getMenuList()
  },
  methods: {
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
    selectMenu({ item, key, selectedKeys }) {
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
