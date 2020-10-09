<template>
  <div>
    <div class="title">
      <a-button type="primary" @click="addOrEditMenu()">
        <a-icon type="plus"></a-icon>新增
      </a-button>
    </div>
    <a-table
      :columns="columns"
      :data-source="dataList"
      rowKey="Id"
      :pagination="pagination"
      :loading="loading"
    >
      <span slot="Parent" slot-scope="Parent">
        <a-tag v-if="Parent" color="red">否</a-tag>
        <a-tag v-else color="green">是</a-tag>
      </span>
      <span slot="action" slot-scope="row">
        <a-button type="primary" @click="addOrEditMenu(row, 1)">查看</a-button>
        <a-divider type="vertical" />
        <a-button type="primary" @click="addOrEditMenu(row, 2)">编辑</a-button>
        <a-divider type="vertical" />
        <a-button type="danger" @click="delMenu(row)">删除</a-button>
      </span>
    </a-table>

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
        <a-form-model-item label="父级菜单">
          <a-select
            default-value=""
            style="width: 120px"
            @change="handleParentChange"
            :disabled="disabled"
            v-model="menuForm.Parent"
          >
            <a-select-option key="" value="">根菜单</a-select-option>
            <a-select-option v-for="parent in parentMenuList" :key="parent.Id">
              {{ parent.Name }}
            </a-select-option>
          </a-select>
          <a-select
            v-model="menuForm.Id"
            style="width: 120px;margin-left:5px"
            v-if="childList.length"
            :disabled="disabled"
          >
            <a-select-option v-for="child in childList" :key="child.Id">
              {{ child.Name }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="菜单名称" prop="Name">
          <a-input v-model="menuForm.Name" :disabled="disabled" />
        </a-form-model-item>
        <a-form-model-item label="菜单编码" prop="Url">
          <a-input v-model="menuForm.Url" :disabled="urlDisabled" />
        </a-form-model-item>
        <a-form-model-item label="菜单图标" prop="Icon">
          <a-input v-model="menuForm.Icon" :disabled="iconDisabled" />
        </a-form-model-item>
        <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
          <a-button
            type="primary"
            @click="saveMenuInfo('menuForm')"
            v-if="hideBtn"
          >
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
const columns = [
  {
    title: '菜单名称',
    dataIndex: 'Name'
  },
  {
    title: '菜单编号',
    dataIndex: 'Url'
  },
  {
    title: '是否一级菜单',
    dataIndex: 'Parent',
    scopedSlots: { customRender: 'Parent' }
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
      dataParams: {
        PageSize: 10,
        PageIndex: 1
      },
      dataList: [],
      columns,
      loading: false,
      dialogTitle: '新增菜单',
      dialogVisible: false,
      confirmLoading: false,
      pagination: {
        // 分页配置器
        pageSize: 10, // 一页的数据限制
        current: 1, // 当前页
        total: 10, // 总数
        hideOnSinglePage: false, // 只有一页时是否隐藏分页器
        showQuickJumper: true, // 是否可以快速跳转至某页
        showSizeChanger: true, // 是否可以改变 pageSize
        pageSizeOptions: ['5', '10', '30'], // 指定每页可以显示多少条
        // onShowSizeChange: (current, pagesize) => { // 改变 pageSize时的回调
        //   this.pagination.current = current
        //   this.pagination.pageSize = pagesize
        //   ....
        // },
        // onChange: (current) => { // 切换分页时的回调，
        // 当在页面定义change事件时，切记要把此处的事件清除，因为这两个事件重叠了，可能到时候会导致一些莫名的bug
        //   this.pagination.current = current
        // },
        showTotal: total => `总数：${total}人` // 可以展示总数
      },
      // 新增编辑form
      disabled: false,
      urlDisabled: false,
      iconDisabled: false,
      parentMenuList: [],
      childMenuData: {},
      childList: [],
      parentMenuVal: '',
      childMenuVal: '',
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      menuForm: {
        Parent: '',
        Id: '',
        Name: '',
        Url: '',
        Icon: '',
        Isactive: 1 //0删除，1新增编辑
      },
      rules: {
        Name: [{ trigger: 'blur', message: '请输入菜单名称', required: true }],
        Url: [{ trigger: 'blur', message: '请输入菜单编码', required: true }],
        Icon: [
          { trigger: 'blur', message: '请输入菜单图标名称', required: true }
        ]
      },
      hideBtn: true
    }
  },
  mounted() {
    // 请求菜单列表
    this.getMenuList()
  },
  methods: {
    // 请求菜单列表
    getMenuList() {
      this.loading = true
      this.axios.menuManager.list(this.dataParams).then(res => {
        if (res.Code === 200) {
          this.loading = false
          this.dataList = res.Data
          this.pagination.total = res.Data.length
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
    handleCascader() {
      // 处理级联菜单
      _.each(this.dataList, item => {
        if (!item.Parent) {
          item.children = []
          this.parentMenuList.push(item)
        }
      })
      // debugger
      _.each(this.parentMenuList, el => {
        _.each(this.dataList, item => {
          if (item.Parent && item.Parent === el.Id) {
            debugger
            if (this.childMenuData[el.Id]) {
              this.childMenuData[el.Id].push(item)
            } else {
              //   // 使用vue.$set给childMenuData添加一个el.Id为名称的属性，属性的值为一个数组，内容是符合条件的item
              this.$set(this.childMenuData, el.Id, [item])
            }
          } else {
            this.childMenuData = {}
          }
        })
      })
    },
    // 打开新增编辑菜单弹框
    addOrEditMenu(item, type) {
      this.dialogVisible = true
      this.handleCascader()
      console.log(this.childMenuData)
      // 判断是新增还是查看编辑
      if (item) {
        this.dialogTitle = '菜单详情'
        // 禁用url输入框
        this.urlDisabled = true
        // 菜单选择框复制
        this.menuForm = {
          Parent: item.Parent,
          Id: item.Id,
          Name: item.Name,
          Url: item.Url,
          Icon: item.Icon,
          Isactive: item.Isactive
        }
        // 查看隐藏确定按钮,禁用所有输入框
        if (type === 1) {
          this.disabled = true
          this.iconDisabled = true
          this.hideBtn = false
        } else {
          // 编辑是否为一级菜单
          if (item.Parent) {
            this.childList = this.childMenuData[item.Parent]
            this.iconDisabled = true
            this.rules['Icon'][0].required = false
            this.rules['Url'][0].required = true
          } else {
            this.childList = []
            this.iconDisabled = false
            this.rules['Url'][0].required = false
          }
          this.hideBtn = true
          this.disabled = false
        }
      } else {
        this.dialogTitle = '新增菜单'
        // 打开时重置表单
        this.childList = []
        this.rules['Url'][0].required = false

        this.menuForm = {
          Id: '',
          Parent: '',
          Name: '',
          Url: '',
          Icon: '',
          Isactive: 1
        }
        this.disabled = false
        this.urlDisabled = false
        this.iconDisabled = false
      }
    },
    // 处理父级菜单选择切换
    handleParentChange(val) {
      if (val) {
        this.parentMenuVal = val
        this.childList = this.childMenuData[val]
        this.childMenuVal = this.childMenuData[val][0].Id
        this.rules['Url'][0].required = true
      } else {
        this.rules['Url'][0].required = false
        this.parentMenuVal = ''
        this.childList = []
        this.childMenuVal = ''
      }
      // 如果为一级菜单，则禁用菜单编码项，并且设置不必填
      // 如果添加2级菜单，则禁用添加Icon选项,并且不是必填项
      if (this.childMenuVal) {
        this.rules['Icon'][0].required = false

        this.iconDisabled = true
      } else {
        this.rules['Icon'][0].required = true

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
    }
  }
}
</script>
<style lang="less" scoped>
.title {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>
