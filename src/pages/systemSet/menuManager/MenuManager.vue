<template>
  <div>
    <div class="userTitle">
      <div class="searchInput">
        <!-- <a-input-search
          enter-button="搜索"
          v-model="searchContent"
          placeholder="用户名/身份证/电话号"
          @search="onSearch"
          allowClear
          @pressEnter="onSearch"
        /> -->
      </div>
      <div class="action">
        <a-button type="primary" @click="addOrEditMenu()">新增目录</a-button>
      </div>
    </div>
    <div class="userTable">
      <a-table
        :columns="columns"
        :data-source="dataList"
        rowKey="Id"
        bordered
        :pagination="pagination"
        :row-selection="rowSelection"
        :loading="tableLoading"
      >
        <span slot="Parent" slot-scope="Parent">
          <a-tag v-if="Parent" color="red">否</a-tag>
          <a-tag v-else color="green">是</a-tag>
        </span>
        <span slot="Isactive" slot-scope="text, record">
          <a-switch
            :defaultChecked="record.Isactive ? true : false"
            checked-children="启用"
            un-checked-children="禁用"
            @change="changeActive(record)"
          />
        </span>
        <span slot="action" slot-scope="row">
          <a-tooltip placement="top">
            <template slot="title">
              <span>向上排序</span>
            </template>
            <a-icon
              type="up-circle"
              theme="twoTone"
              @click="menuSort(row, 1)"
            />
          </a-tooltip>
          <a-divider type="vertical" />
          <a-tooltip placement="top">
            <template slot="title">
              <span>向下排序</span>
            </template>
            <a-icon
              type="down-circle"
              theme="twoTone"
              @click="menuSort(row, 2)"
            />
          </a-tooltip>
          <a-divider type="vertical" />
          <a-tooltip placement="top" v-if="!row.Parent">
            <template slot="title">
              <span>新增下级菜单</span>
            </template>
            <a-icon
              type="plus-square"
              theme="twoTone"
              @click="addOrEditMenu(row, 1)"
            >
            </a-icon>
          </a-tooltip>
          <a-divider type="vertical" v-if="!row.Parent" />
          <a-tooltip placement="top">
            <template slot="title">
              <span>编辑</span>
            </template>
            <a-icon
              type="edit"
              theme="twoTone"
              @click="addOrEditMenu(row, 2)"
            />
          </a-tooltip>
          <a-divider type="vertical" />
          <a-tooltip placement="top">
            <template slot="title">
              <span>删除</span>
            </template>
            <a-icon type="delete" theme="twoTone" @click="delMenu(row)" />
          </a-tooltip>
        </span>
      </a-table>
    </div>
    <a-modal
      :title="dialogTitle"
      :visible="dialogVisible"
      :confirm-loading="confirmLoading"
      :footer="null"
      @ok="saveMenuInfo('menuForm')"
      @cancel="handleCancel('menuForm')"
    >
      <a-form-model
        :model="menuForm"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        ref="menuForm"
        :rules="rules"
      >
        <a-form-model-item label="父级菜单" v-if="showPName">
          <a-input v-model="menuForm.ParentName" disabled />
        </a-form-model-item>
        <a-form-model-item label="菜单名称" prop="Name">
          <a-input v-model="menuForm.Name" />
        </a-form-model-item>
        <a-form-model-item label="菜单编码" prop="Url">
          <a-input v-model="menuForm.Url" />
        </a-form-model-item>
        <a-form-model-item label="菜单图标" prop="Icon">
          <a-input v-model="menuForm.Icon" :disabled="iconDisabled" />
        </a-form-model-item>
        <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
          <a-button type="primary" @click="saveMenuInfo('menuForm')">
            确定
          </a-button>
          <a-button
            style="margin-left: 10px;"
            @click="handleCancel('menuForm')"
          >
            取消
          </a-button>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>
<script>
import _ from 'lodash'
import { mapMutations, mapState } from 'vuex'
const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(
      `selectedRowKeys: ${selectedRowKeys}`,
      'selectedRows: ',
      selectedRows
    )
  },
  onSelect: (record, selected, selectedRows) => {
    console.log(record, selected, selectedRows)
  },
  onSelectAll: (selected, selectedRows, changeRows) => {
    console.log(selected, selectedRows, changeRows)
  }
}
const columns = [
  {
    title: '菜单名称',
    dataIndex: 'Name'
  },
  {
    title: '菜单编码',
    dataIndex: 'Url'
  },
  {
    title: '是否一级菜单',
    dataIndex: 'Parent',
    scopedSlots: { customRender: 'Parent' }
  },
  {
    title: '是否启用',
    dataIndex: 'Isactive',
    scopedSlots: { customRender: 'Isactive' }
  },
  {
    title: '菜单图标',
    dataIndex: 'Icon'
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'MenuManager',
  data() {
    return {
      rowSelection,
      columns,
      listParams: {
        PageSize: 10,
        PageIndex: 1,
        ParamItemList: [],
        ParamOrderList: []
      },
      dataList: [],
      tableLoading: false,
      dialogTitle: '新增菜单',
      dialogVisible: false,
      confirmLoading: false,
      pagination: {
        // 分页配置器
        pageSize: 10, // 一页的数据限制
        current: 1, // 当前页
        total: 0, // 总数
        showTotal: total => `共 ${total} 条`, // 显示总数
        hideOnSinglePage: false, // 只有一页时是否隐藏分页器
        showSizeChanger: true, // 是否可以改变 pageSize
        pageSizeOptions: ['5', '10', '30'] // 指定每页可以显示多少条
        // onShowSizeChange: (current, pagesize) => { // 改变 pageSize时的回调
        //   this.pagination.current = current
        //   this.pagination.pageSize = pagesize
        //   ....
        // },
        // onChange: (current) => { // 切换分页时的回调，
        // 当在页面定义change事件时，切记要把此处的事件清除，因为这两个事件重叠了，可能到时候会导致一些莫名的bug
        //   this.pagination.current = current
        // },
      },
      // 新增编辑form
      showPName: false,
      iconDisabled: false,
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      menuForm: {
        ParentName: '',
        Parent: '',
        Id: '',
        Name: '',
        Url: '',
        Icon: '',
        Isactive: 1 //0删除，1新增编辑
      },
      IsActive: false,
      rules: {
        Name: [{ trigger: 'blur', message: '请输入菜单名称', required: true }],
        Url: [{ trigger: 'blur', message: '请输入菜单编码', required: true }],
        Icon: [
          { trigger: 'blur', message: '请输入菜单图标名称', required: true }
        ]
      }
    }
  },
  computed: {
    ...mapState(['isReloadMenu'])
  },
  mounted() {
    // 请求菜单列表
    this.getMenuList()
  },
  methods: {
    ...mapMutations(['reloadMenu']),
    // 请求菜单列表
    getMenuList() {
      this.tableLoading = true
      this.axios.menuManager.list(this.dataParams).then(res => {
        if (res.Code === 200) {
          this.tableLoading = false
          let arr = [] //临时父级菜单集合
          _.each(res.Data.List, el => {
            if (!el.Parent) {
              el.children = []
              arr.push(el)
            }
          })
          // let list = []
          _.each(res.Data.List, el => {
            _.each(arr, item => {
              if (el.Parent && el.Parent === item.Id) {
                item.children.push(el)
              }
            })
          })
          this.dataList = arr
          this.pagination.total = res.Data.Count
        }
      })
    },
    // 删除
    delMenu(row) {
      let params = {
        Id: row.Id,
        Parent: row.Parent,
        Name: row.Name,
        Url: row.Url,
        Icon: row.Icon,
        Isactive: 0
      }
      this.axios.menuManager.upDate(params).then(res => {
        if (res.Code === 200) {
          this.$message.success('删除成功')
          this.getMenuList()
        } else {
          this.$message.error(res.Message)
        }
      })
    },
    // 打开新增编辑菜单弹框
    addOrEditMenu(row, type) {
      this.dialogVisible = true
      // 判断是新增还是查看编辑
      if (row) {
        // 菜单选择框复制
        this.menuForm = {
          Parent: row.Parent,
          Id: row.Id,
          Name: row.Name,
          Url: row.Url,
          Icon: row.Icon,
          Isactive: row.Isactive
        }

        // type:1 新增二级菜单, 2  编辑
        if (type === 1) {
          this.dialogTitle = '新增下级菜单'
          this.showPName = true
          this.iconDisabled = true
          this.menuForm = {
            ParentName: row.Name,
            Parent: row.Id,
            Id: '',
            Name: '',
            Url: '',
            Icon: '',
            Isactive: 1
          }
          this.rules['Icon'][0].required = false
          this.rules['Url'][0].required = true
        } else {
          // 编辑
          this.showPName = false
          this.dialogTitle = '编辑菜单'
          this.menuForm = {
            Parent: row.Parent,
            Id: row.Id,
            Name: row.Name,
            Url: row.Url,
            Icon: row.Icon,
            Isactive: row.Isactive
          }
          if (row.Parent) {
            this.showPName = true
            // 编辑二级菜单
            this.iconDisabled = true
            this.rules['Icon'][0].required = false
            this.rules['Url'][0].required = true
          } else {
            this.iconDisabled = false
            this.rules['Icon'][0].required = true
            this.rules['Url'][0].required = false
          }
        }
      } else {
        this.dialogTitle = '新增目录'

        // 打开时重置表单
        this.rules['Url'][0].required = false

        this.menuForm = {
          Id: '',
          Parent: '',
          Name: '',
          Url: '',
          Icon: '',
          Isactive: 1
        }
        this.iconDisabled = false
      }
    },
    // 保存
    saveMenuInfo(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.confirmLoading = true
          this.axios.menuManager.upDate(this.menuForm).then(res => {
            if (res.Code === 200) {
              this.$message.success('保存成功')
              this.getMenuList()
              this.dialogVisible = false
            }
          })
        }
      })
    },
    // 取消/关闭
    handleCancel(name) {
      this.$refs[name].resetFields()
      this.dialogVisible = false
      this.rules['Url'][0].required = true
    },
    // 菜单排序
    menuSort(row, type) {
      // _.each(this.ParamOrderList,el => {
      //   if(el.Id === row.Id) {}
      // })
      // this.listParams.ParamOrderList.push()
      this.menuForm = {
        Id: row.Id,
        Name: row.Name,
        Url: row.Url,
        Icon: row.Icon,
        Parent: row.Parent,
        Description: row.Description,
        Isactive: row.Isactive,
        Sortnum: type
      }
      this.axios.menuManager.upDate(this.menuForm).then(res => {
        if (res.Code === 200) {
          this.getMenuList()
        }
      })
    },
    // 启用/禁用
    changeActive(row) {
      let Isactive = 0
      if (row.Isactive) {
        Isactive = 0
      } else {
        Isactive = 1
      }
      let params = {
        Id: row.Id,
        Parent: row.Parent,
        Name: row.Name,
        Url: row.Url,
        Icon: row.Icon,
        Isactive: Isactive
      }
      this.axios.menuManager.upDate(params).then(res => {
        if (res.Code === 200) {
          this.reloadMenu(Isactive ? true : false)
          this.$message.success('修改成功')
          this.getMenuList()
        } else {
          this.$message.error(res.Message)
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.userTitle {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
</style>
