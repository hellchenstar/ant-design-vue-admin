<template>
  <div>
    <div>
      <a-checkbox
        @change="onChange($event, item)"
        v-for="item in thList"
        :key="item.dataIndex"
      >
        {{ item.name }}
      </a-checkbox>
    </div>
    <div>
      <a-button>确定</a-button>
      <a-button>取消</a-button>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    thList: {
      type: Array,
      required: true
    }
  },
  data() {
    return {}
  },
  methods: {
    onChange(e, item) {
      console.log(e)
      console.log(item)
    }
  }
}
</script>
