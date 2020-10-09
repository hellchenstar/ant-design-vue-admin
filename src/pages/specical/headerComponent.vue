<template>
  <a-layout-header style="background: #fff; padding: 0">
    <div class="headerContent">
      <a-icon
        class="trigger"
        :type="collapsed ? 'plus-square' : 'minus-square'"
        @click="changeMenuState"
        theme="twoTone"
      />
      <div class="userCenter">
        <a-dropdown :trigger="['click']" class="userInfo">
          <a class="ant-dropdown-link" @click="e => e.preventDefault()">
            <a-avatar :size="32" icon="user" style="margin-right:10px" />
            <span>{{ userInfo.userName }}</span>
            <a-icon type="down" />
          </a>
          <a-menu slot="overlay">
            <a-menu-item key="0">
              <a>个人中心</a>
            </a-menu-item>
            <a-menu-item key="1">
              <a>账户设置</a>
            </a-menu-item>
            <a-menu-item key="2">
              <a @click="loginout">退出</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
        <a-icon type="setting" @click="showDrawer" theme="twoTone" />
      </div>
    </div>
    <a-drawer
      title="个性设置"
      placement="right"
      :closable="false"
      :visible="visible"
      @close="closeDrawer"
    >
      <Skin :show="showDialog"></Skin>
    </a-drawer>
  </a-layout-header>
</template>
<script>
import Skin from './skin'
import { mapState, mapMutations } from 'vuex' //注册 action 和 state
export default {
  name: 'headerComponent',
  components: {
    Skin
  },
  computed: {
    ...mapState(['collapsed', 'theme', 'userInfo'])
  },
  data() {
    return {
      showDialog: false,
      visible: false
    }
  },
  mounted() {
    this.getUserInfo()
  },
  methods: {
    ...mapMutations(['changeCollapsed', 'changeTheme', 'changeUserInfo']),
    getUserInfo() {
      this.axios.home.getUserInfo().then(res => {
        if (res.Code === 200) {
          let userInfo = {
            userName: res.Data.Name,
            avatar: res.Data.Phone
          }
          this.changeUserInfo(userInfo)
          sessionStorage.setItem('id', JSON.stringify(res.Data.Id))
        }
      })
    },
    // 菜单展开收起
    changeMenuState() {
      this.changeCollapsed(!this.collapsed)
    },
    // 打开抽屉做个性化设置
    showDrawer() {
      this.visible = true
    },

    closeDrawer() {
      this.visible = false
    },
    loginout() {
      this.$router.push('login')
      sessionStorage.clear()
    }
  }
}
</script>
<style lang="less" scoped>
.headerContent {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.userCenter {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
}
.userInfo {
  margin-right: 20px;
}
</style>
