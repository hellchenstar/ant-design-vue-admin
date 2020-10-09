<template>
  <div :slot="name" slot-scope="columnInfoAndMethods" style="padding: 8px">
    <a-select
      style="width: 120px"
      labelInValue
      @change="
        e => {
          //e为当前选中值的value值
          filterSexMethod(e, columnInfoAndMethods.column)
        }
      "
    >
      <a-select-option
        v-for="(item, index) in list"
        :key="index"
        :value="item.id"
      >
        {{ item.name }}
      </a-select-option>
    </a-select>
    <a-icon
      :slot="soltIcon"
      slot-scope="filtered"
      type="down"
      :style="{ color: filtered ? '#108ee9' : undefined }"
    />
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
    return {}
  },
  methods: {
    filterSexMethod(e, column) {
      this.$emit('handleFilter', { value: e, column: column })
    }
  }
}
</script>
