<template>
  <div>
    <div class="userTable">
      <a-table
        :data-source="dataList"
        :columns="columns"
        bordered
        rowKey="Id"
        :pagination="pagination"
        @change="handleTableChange"
      >
        <span slot="action" slot-scope="row">
          <a-button type="primary" @click="addAndEdit(row)">编辑</a-button>
        </span>
      </a-table>
    </div>
  </div>
</template>
<script>
const columns = [
  {
    title: '公司名称',
    dataIndex: 'Name',
    key: 'Name',
    Operation: 'like',
    sorter: true,
    sortDirections: ['ascend', 'descend', false]
  },
  {
    title: '电话',
    dataIndex: 'Phone',
    key: 'Phone',
    Operation: 'like',
    sorter: true,
    sortDirections: ['ascend', 'descend', false]
  },
  {
    title: '是否启用',
    dataIndex: 'Isactive',
    key: 'Isactive',
    Operation: '=',
    sorter: true,
    sortDirections: ['ascend', 'descend', false]
  },
  {
    title: '地址',
    dataIndex: 'Address',
    key: 'Address',
    Operation: 'like',
    sorter: true,
    sortDirections: ['ascend', 'descend', false]
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  mounted() {
    this.getList()
  },
  data() {
    return {
      columns,
      dataList: [],
      listParams: {
        PageSize: 10,
        PageIndex: 0,
        ParamItemList: [],
        ParamOrderList: []
      },
      pagination: {
        pageSizeOptions: ['10', '20', '50'],
        showSizeChanger: true, // 显示可改变每页数量
        showTotal: total => `共 ${total} 条`, // 显示总数
        pageSize: 10,
        current: 1,
        total: 0
      }
    }
  },
  methods: {
    getList() {
      this.listParams.PageSize = this.pagination.pageSize
      this.listParams.PageIndex = this.pagination.current
      this.axios.company.list(this.listParams).then(res => {
        if (res.Code === 200) {
          this.dataList = res.Data.List
          this.pagination.total = res.Data.Count
        }
      })
    },
    handleTableChange(pagination, filters, sorters) {
      console.log(pagination)
    },
    addAndEdit(record) {
      console.log(record)
    }
  }
}
</script>
