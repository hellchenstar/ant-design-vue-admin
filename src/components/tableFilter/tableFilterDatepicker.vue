<template>
  <!-- @change="
        e =>
          columnInfoAndMethods.setSelectedKeys(
            e.target.value ? [e.target.value] : []
          )
      " -->
  <div :slot="name" slot-scope="columnInfoAndMethods" style="padding: 8px">
    <a-range-picker
      :locale="locale"
      show-time
      @ok="
        confirmDate(
          $event,
          columnInfoAndMethods.confirm,
          columnInfoAndMethods.column
        )
      "
      :valueFormat="valueFormat"
    >
      <template slot="renderExtraFooter">
        选择时间
      </template>
    </a-range-picker>
  </div>
</template>
<script>
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN'
import moment from 'moment'
import 'moment/locale/zh-cn'
export default {
  props: {
    name: {
      type: String,
      required: true
    },
    valueFormat: {
      type: String,
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
      locale,
      moment
    }
  },
  methods: {
    confirmDate(dates, confirm, column) {
      confirm()
      let obj = {
        key: dates,
        label: dates.join('至')
      }
      let params = {
        value: obj,
        column: column
      }
      this.$emit('handleFilterTime', params)
    }
  }
}
</script>
