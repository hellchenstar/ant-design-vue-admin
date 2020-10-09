<template>
  <div>
    <a-page-header subTitle="切换主题" />
    <div class="skinMain">
      <a-switch default-checked @change="changeThemeColor" />
    </div>
    <a-divider />
    <a-page-header subTitle="切换皮肤" />
    <div class="skinMain">
      <div
        class="colorBlock"
        style="background:#3e91f7"
        @click="changeColor('#3e91f7')"
      ></div>
      <div
        class="colorBlock"
        style="background:#e23c39"
        @click="changeColor('#e23c39')"
      ></div>
      <div
        class="colorBlock"
        style="background:#e96033"
        @click="changeColor('#e96033')"
      ></div>
      <div
        class="colorBlock"
        style="background:#f0af41"
        @click="changeColor('#f0af41')"
      ></div>
      <div
        class="colorBlock"
        style="background:#58bfc1"
        @click="changeColor('#58bfc1')"
      ></div>
      <div
        class="colorBlock"
        style="background:#72c140"
        @click="changeColor('#72c140')"
      ></div>
      <div
        class="colorBlock"
        style="background:#3258e3"
        @click="changeColor('#3258e3')"
      ></div>
      <div
        class="colorBlock"
        style="background:#6839c9"
        @click="changeColor('#6839c9')"
      ></div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { Icon } from 'ant-design-vue'
export default {
  computed: {
    ...mapState(['theme'])
  },
  data() {
    return {
      color: ''
    }
  },
  created() {
    // this.requiredTwoStepCaptcha = true
  },
  methods: {
    ...mapMutations(['changeTheme']),
    // 换肤
    changeColor(color) {
      window.less
        .modifyVars({
          '@primary-color': color,
          '@success-color': color
        })
        .then(() => {
          // 全局设置图标主题色
          Icon.setTwoToneColor(color)
          console.log('成功')
        })
        .catch(error => {
          alert('失败')
          console.log(error)
        })
    },
    // 改变主题色
    changeThemeColor() {
      if (this.theme === 'dark') {
        this.changeTheme('light')
      } else {
        this.changeTheme('dark')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.skinMain {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  padding: 0 20px;
}
.colorBlock {
  margin-left: 10px;
  width: 30px;
  height: 30px;
  margin-top: 30px;
}
</style>
