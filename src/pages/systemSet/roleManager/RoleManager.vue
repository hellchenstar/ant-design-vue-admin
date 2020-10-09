<template>
  <div>
    角色管理
    <a-button @click="goCurrent" type="primary">点击一下</a-button>
  </div>
</template>
<script>
export default {
  name: 'RoleManager',
  data() {
    return {}
  },
  methods: {
    goCurrent() {
      this.$router.push('RoleManager')
    }
  }
}
</script>
