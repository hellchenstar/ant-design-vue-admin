<template>
  <div>
    <div class="navList">
      <a-tabs v-model="activeKey" type="editable-card" hideAdd @edit="onEdit">
        <a-tab-pane
          v-for="item in navList"
          :key="item.key"
          :tab="item.title"
          defaultActiveKey="home"
          @click="navClick"
        >
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>
<script>
import { mapMutations, mapState } from 'vuex'
import _ from 'lodash'
export default {
  computed: {
    ...mapState(['navList', 'currentNav'])
  },
  mounted() {
    this.activeKey = this.currentNav
    _.each(this.navList, el => {
      if (el.active) {
        this.activeKey = el.key
      }
    })
  },
  watch: {
    currentNav(val) {
      this.activeKey = val
    }
  },
  data() {
    return {
      activeKey: ''
    }
  },
  methods: {
    ...mapMutations(['changeNavList', 'changeCurrentNav']),
    onEdit(targetKey) {
      let arr = this.navList
      let index = ''
      let obj = {}
      _.each(arr, (el, i) => {
        if (el.key === targetKey) {
          obj = el
          index = i
        }
      })
      if (obj.active) {
        if (index === arr.length - 1) {
          this.activeKey = arr[arr.length - 2].key
        } else {
          this.activeKey = arr[index + 1].key
        }
        arr.splice(index, 1)
        _.each(arr, el => {
          if (el.key === this.activeKey) {
            el.active = true
          } else {
            el.active = false
          }
        })
      } else {
        arr.splice(index, 1)
      }

      this.$router.push(this.activeKey)
      this.changeCurrentNav(this.activeKey)
      this.changeNavList(arr)
    },
    navClick() {
      _.each(this.navList, el => {
        if (el.key === this.activeKey) {
          el.active = true
        } else {
          el.active = false
        }
      })
      this.changeNavList(this.navList)
      this.changeCurrentNav(this.activeKey)
      this.$router.push(this.activeKey)
    }
  }
}
</script>
<style lang="less" scoped>
.navList {
  padding-top: 2px;
  box-sizing: border-box;
  height: 40px;
  background: #fff;
  margin: 10px;
  margin-bottom: 0px;
}
</style>
