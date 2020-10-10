<template>
  <div :slot="name" slot-scope="columnInfoAndMethods" style="padding: 8px">
    <div>
      <div :style="{ borderBottom: '1px solid #E9E9E9' }">
        <a-checkbox
          :indeterminate="indeterminate"
          :checked="checkAll"
          @change="onCheckAllChange"
        >
          全部
        </a-checkbox>
      </div>
      <br />
      <a-checkbox-group
        v-model="checkedList"
        :options="list"
        @change="onChange"
      />
      <br />
      <a-button
        type="primary"
        size="small"
        style="margin-top:10px"
        @click="
          confirmDate(columnInfoAndMethods.confirm, columnInfoAndMethods.column)
        "
      >
        确定
      </a-button>
    </div>
  </div>
</template>
<script>
import _ from 'lodash'

export default {
  props: {
    name: {
      type: String,
      required: true
    },
    list: {
      type: Array,
      required: true
    },
    columnInfoAndMethods: {
      type: Object,
      required: true
    }
  },
  mounted() {},
  data() {
    return {
      checkedList: [],
      indeterminate: true,
      checkAll: false
    }
  },
  methods: {
    onCheckAllChange(e) {
      let arr = []
      _.each(this.list, el => {
        arr.push(el.value)
      })
      Object.assign(this, {
        checkedList: e.target.checked ? arr : [],
        indeterminate: false,
        checkAll: e.target.checked
      })
    },
    onChange(checkedList) {
      this.indeterminate =
        !!checkedList.length && checkedList.length < this.list.length
      this.checkAll = checkedList.length === this.list.length
    },
    confirmDate(confirm, column) {
      confirm()
      let arr = []
      let obj = {
        key: '',
        label: ''
      }
      if (this.checkedList.length < this.list.length) {
        _.each(this.checkedList, el => {
          _.each(this.list, item => {
            if (el === item.value) {
              arr.push(item.label)
            }
          })
        })
        obj = {
          key: this.checkedList,
          label: arr.join(',')
        }
      }

      let params = {
        value: obj,
        column: column
      }

      this.$emit('handleFilter', params)
    }
  }
}
</script>
