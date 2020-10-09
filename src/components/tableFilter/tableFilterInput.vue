<template>
  <!-- @change="
        e =>
          columnInfoAndMethods.setSelectedKeys(
            e.target.value ? [e.target.value] : []
          )
      " -->
  <div :slot="name" slot-scope="columnInfoAndMethods" style="padding: 8px">
    <a-input
      :placeholder="`筛选 ${columnInfoAndMethods.column.title}`"
      :value="columnInfoAndMethods.selectedKeys[0]"
      style="width: 188px; margin-bottom: 8px; display: block;"
      @change="
        changeValue(
          $event,
          columnInfoAndMethods.setSelectedKeys,
          columnInfoAndMethods.column
        )
      "
      @pressEnter="
        () =>
          handleSearch(
            columnInfoAndMethods.selectedKeys,
            columnInfoAndMethods.confirm,
            columnInfoAndMethods.column
          )
      "
    />
    <a-button
      type="primary"
      icon="search"
      size="small"
      style="width: 90px; margin-right: 8px"
      @click="
        () =>
          handleSearch(
            columnInfoAndMethods.selectedKeys,
            columnInfoAndMethods.confirm,
            columnInfoAndMethods.column
          )
      "
    >
      筛选
    </a-button>
    <a-button
      size="small"
      style="width: 90px"
      @click="
        () =>
          handleReset(
            columnInfoAndMethods.selectedKeys,
            columnInfoAndMethods.confirm,
            columnInfoAndMethods.column,
            columnInfoAndMethods.clearFilters
          )
      "
    >
      重置
    </a-button>
  </div>
</template>
<script>
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
    },
    soltIcon: {
      type: String,
      required: true
    }
  },
  mounted() {},
  data() {
    return {
      item: {
        key: '',
        label: ''
      }
    }
  },
  methods: {
    handleSearch(selectedKeys, confirm, column) {
      confirm()
      let obj = {
        value: this.item,
        column: column
      }
      this.$emit('handleFilter', obj)
    },

    handleReset(selectedKeys, confirm, column, clearFilters) {
      clearFilters()
      let str = ''
      if (column.Operation === 'like') {
        str = `%%`
      }
      this.handleSearch([str], confirm, column)
    },
    changeValue(e, method, column) {
      this.item = {
        key: e.target.value ? e.target.value : '',
        label: e.target.value ? e.target.value : ''
      }
      method(e.target.value ? [e.target.value] : [])
    }
  }
}
</script>
