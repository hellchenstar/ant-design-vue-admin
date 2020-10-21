<template>
  <div>
    <div class="userTitle">
      <div class="searchInput">
        <a-input-search
          enter-button="搜索"
          v-model="searchContent"
          placeholder="用户名/身份证/电话号"
          @search="onSearch"
          allowClear
          @change="searchChange"
          @pressEnter="onSearch"
        />
      </div>
      <div class="action">
        <a-button type="primary" @click="addOrEdit()">新增</a-button>
      </div>
    </div>
    <!-- tag展示 -->
    <div class="tags">
      <template v-for="(item, index) in tagList">
        <a-tooltip
          v-if="item.value.label.length > 20"
          :key="index"
          :title="item.value.label"
        >
          <a-tag
            color="blue"
            :key="item.column.dataIndex"
            closable
            @close="closeTag(index)"
          >
            {{ `${item.column.title}:${item.value.label.slice(0, 20)}...` }}
          </a-tag>
        </a-tooltip>
        <a-tag
          v-else
          color="blue"
          :key="item.column.dataIndex"
          closable
          @close="closeTag(index)"
        >
          {{ `${item.column.title}:${item.value.label}` }}
        </a-tag>
      </template>
    </div>

    <!-- <div @click="tdSet" class="tdset">列表设置</div> -->
    <div class="userTable">
      <a-table
        :data-source="dataList"
        :columns="columns"
        bordered
        rowKey="Id"
        @change="tableChange"
        :pagination="pagination"
      >
        <!-- 用户名筛选 -->
        <tableFilterInput
          slot="filterName"
          name="filterName"
          slot-scope="{
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
            column
          }"
          :columnInfoAndMethods="{
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
            column
          }"
          @handleFilter="handleFilter"
        ></tableFilterInput>
        <!-- 显示性别 -->
        <span slot="Sex" slot-scope="Sex">
          <a-tag color="green" v-if="Sex === 1">男</a-tag>
          <a-tag color="red" v-if="Sex === 2">女</a-tag>
        </span>
        <!-- 启用禁用 -->
        <span slot="Isactive" slot-scope="text, record">
          <a-switch
            :checked="record.Isactive ? true : false"
            checked-children="启用"
            un-checked-children="禁用"
            @click="changeIsactive(record)"
          />
        </span>
        <!-- 操作 -->
        <span slot="action" slot-scope="text, record">
          <a-tooltip placement="top">
            <template slot="title">
              <span>编辑</span>
            </template>
            <a-icon type="edit" theme="twoTone" @click="addOrEdit(record)" />
          </a-tooltip>
          <a-divider type="vertical" />
        </span>
      </a-table>
    </div>
    <!-- 新增编辑 -->
    <a-modal
      :title="dialogTitle"
      :visible="dialogVisible"
      :confirm-loading="confirmLoading"
      :footer="null"
      @ok="saveFormInfo('formInfo')"
      @cancel="handleCancel('formInfo')"
    >
      <a-form-model
        :model="formInfo"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        ref="formInfo"
        :rules="rules"
      >
        <a-form-model-item label="用户名称" prop="Name">
          <a-input v-model="formInfo.Name" />
        </a-form-model-item>
        <a-form-model-item label="登录账号" prop="Loginid">
          <a-input v-model="formInfo.Loginid" />
        </a-form-model-item>
        <a-form-model-item label="登录密码" prop="Password">
          <a-input-password
            v-model="formInfo.Password"
            type="password"
            placeholder="●●●●●●"
          />
        </a-form-model-item>
        <a-form-model-item label="电子邮箱" prop="Email">
          <a-input v-model="formInfo.Email" />
        </a-form-model-item>
        <a-form-model-item label="性别" prop="Sex">
          <a-select v-model="formInfo.Sex">
            <a-select-option :value="0">位置</a-select-option>
            <a-select-option :value="1">男</a-select-option>
            <a-select-option :value="2">女</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="电话号码" prop="Phone">
          <a-input v-model="formInfo.Phone" />
        </a-form-model-item>
        <a-form-model-item label="出生日期" prop="Birthday">
          <a-date-picker
            v-model="formInfo.Birthday"
            type="date"
            valueFormat="YYYY-MM-DD"
            style="width: 100%;"
          />
        </a-form-model-item>
        <a-form-model-item label="用户头像" prop="Photo">
          <a-input v-model="formInfo.Photo" />
        </a-form-model-item>
        <a-form-model-item label="启用" prop="Isactive">
          <a-radio-group v-model="formInfo.Isactive">
            <a-radio :value="1"> 启用</a-radio>
            <a-radio :value="0"> 禁用</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
          <a-button type="primary" @click="saveFormInfo('formInfo')">
            确定
          </a-button>
          <a-button
            style="margin-left: 10px;"
            @click="handleCancel('formInfo')"
          >
            取消
          </a-button>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <!-- 自定义列弹框 -->
    <a-drawer
      title="自定义列表"
      placement="right"
      :closable="false"
      :visible="tdSetDia"
      @close="closeDrawer"
    >
      <customTd :thList="thList"></customTd>
    </a-drawer>
  </div>
</template>
<script>
import _ from 'lodash'
import tableFilterInput from '@/components/tableFilter/tableFilterInput'
import customTd from '@/components/custom/customTd'

const columns = [
  {
    title: '用户名',
    dataIndex: 'Name',
    key: 'Name',
    Operation: 'like',
    SortNum: 3,
    sorter: true,
    sortDirections: ['ascend', 'descend', false],
    scopedSlots: {
      filterDropdown: 'filterName',
      filterIcon: 'filterIcon',
      customRender: 'Name'
    }
  },
  {
    title: '性别',
    dataIndex: 'Sex',
    key: 'Sex',
    Operation: '=',
    scopedSlots: {
      customRender: 'Sex'
    }
  },
  {
    title: '电话',
    dataIndex: 'Phone',
    key: 'Phone',
    Operation: 'like'
  },
  {
    title: '电子邮箱',
    dataIndex: 'Email',
    key: 'Email',
    Operation: 'like'
  },
  {
    title: '登录账号',
    dataIndex: 'Loginid',
    key: 'Loginid',
    Operation: 'like'
  },
  {
    title: '更新时间',
    dataIndex: 'Udate',
    key: 'Udate',
    Operation: 'between'
  },
  {
    title: '启用状态',
    dataIndex: 'Isactive',
    key: 'Isactive',
    Operation: '=',
    scopedSlots: {
      customRender: 'Isactive'
    }
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]
const thList = [
  { name: '用户名', dataIndex: 'Name' },
  { name: '性别', dataIndex: 'Sex' }
]
export default {
  name: 'UserManager',
  components: {
    tableFilterInput,

    customTd
  },
  mounted() {
    this.getDataList()
  },
  watch: {
    tagList: {
      handler: function(val) {
        this.listParams.ParamItemList = []
        if (val.length) {
          _.each(val, el => {
            let obj = {
              Name: el.column.dataIndex,
              ValueName: el.column.dataIndex,
              Operation: el.column.Operation,
              Value: el.value.key
            }
            // Operation判断是精确查找还是模糊查找 1)、like 模糊 2)、= 精确 3) in 多选 4) 时间筛选
            if (obj.Operation === 'like') {
              obj.Value = `%${el.value.key}%`
            } else if (obj.Operation === '=') {
              obj.Value = el.value.key
            } else if (obj.Operation === 'in') {
              obj.Value = el.value.key.join(',')
            } else if (obj.Operation === 'between') {
              obj.Value = el.value.key.join(' and ')
            }
            // 遍历已有列表参数，如果有筛选条件，改值，如果没有，添加
            this.listParams.ParamItemList.push(obj)
          })
        }
        this.getDataList()
      },
      deep: true
    }
  },

  data() {
    return {
      columns,
      thList,
      // 列表
      dataList: [],
      tagList: [],
      listParams: {
        PageSize: 10,
        PageIndex: 1,
        ParamItemList: [],
        ParamOrderList: []
      },
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
      },
      searchContent: '',
      //自定义列抽屉
      tdSetDia: false,
      // 新增编辑
      dialogVisible: false,
      dialogTitle: '',
      confirmLoading: false,
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      // 表单
      formInfo: {
        Id: '',
        Name: '',
        Loginid: '',
        Password: '',
        Sex: '',
        Email: '',
        Phone: '',
        Birthday: '',
        Photo: '',
        Isactive: 1
      },
      rules: {
        Name: [{ trigger: 'blur', message: '请输入用户名称', required: true }],
        Loginid: [
          { trigger: 'blur', message: '请输入登录账号', required: true }
        ],
        Password: [{ trigger: 'blur', message: '请输入密码', required: true }],
        Sex: [{ trigger: 'change', message: '请选择性别', required: true }],
        Email: [{ trigger: 'blur', message: '请输入电子邮箱', required: true }],
        Phone: [{ trigger: 'blur', message: '请输入电话号码', required: true }],
        Birthday: [
          { trigger: 'change', message: '请选择出生日期', required: true }
        ],
        Photo: [{ trigger: 'change', message: '请上传头像', required: true }],
        Isactive: [
          { trigger: 'change', message: '请选择是否启用', required: true }
        ]
      }
    }
  },
  methods: {
    tdSet() {
      this.tdSetDia = true
    },
    closeDrawer() {
      this.tdSetDia = false
    },
    // 请求list
    getDataList() {
      this.axios.userManager.list(this.listParams).then(res => {
        if (res.Code === 200) {
          this.dataList = res.Data.List
        }
      })
    },
    searchChange() {
      if (!this.searchContent) {
        this.onSearch()
      }
    },
    // 点击搜索
    onSearch() {
      let arr1 = _.filter(this.listParams.ParamItemList, el => {
        return el.Group !== 'group'
      })
      let arr = []
      if (this.searchContent) {
        arr = [
          {
            Name: 'Name',
            ValueName: 'Name',
            Operation: 'like',
            Value: `%${this.searchContent}%`,
            Group: 'group'
          },
          {
            Name: 'Name',
            ValueName: 'Name',
            Operation: 'like',
            Value: `%${this.searchContent}%`,
            Group: 'group'
          },
          {
            Name: 'Name',
            ValueName: 'Name',
            Operation: 'like',
            Value: `%${this.searchContent}%`,
            Group: 'group'
          }
        ]
      } else {
        arr = []
      }

      this.listParams.ParamItemList = arr1.concat(arr)
      this.getDataList()
    },
    // 渲染tagList
    renderTags(item) {
      if (this.tagList.length) {
        _.each(this.tagList, (el, index) => {
          let result = this.tagList.some(cItem => {
            if (cItem.column.dataIndex === item.column.dataIndex) {
              return true
            }
          })
          if (result) {
            if (item.column.dataIndex === el.column.dataIndex) {
              // 处理选择值为空的情况
              if (!item.value.key && item.value.key !== 0) {
                this.tagList.splice(index, 1)
              } else {
                el.value.key = item.value.key
                el.value.label = item.value.label
              }
            }
          } else {
            if (!item.value.key && item.value.key !== 0) {
              return
            } else {
              this.tagList.push(item)
            }
          }
        })
      } else {
        if (!item.value.key && item.value.key !== 0) {
          return
        } else {
          this.tagList.push(item)
        }
      }
    },
    // 关闭tag的回调
    closeTag(index) {
      this.tagList.splice(index, 1)
    },
    handleFilter(obj) {
      this.renderTags(obj)
    },
    // 排序
    tableChange(pagination, filters, sorter) {
      this.listParams.ParamOrderList = []
      if (sorter.column) {
        let obj = {
          Name: sorter.column.dataIndex,
          SortType: sorter.order === 'ascend' ? 0 : 1,
          SortNum: sorter.column.SortNum
        }
        this.listParams.ParamOrderList.push(obj)
      } else {
        this.listParams.ParamOrderList = []
      }
      this.getDataList()
    },
    changeIsactive(row) {
      this.formInfo = row
      this.formInfo.Isactive = row.Isactive ? 0 : 1
      this.upDateData()
    },
    addOrEdit(row) {
      this.dialogVisible = true
      console.log(row)
      if (row) {
        this.dialogTitle = '编辑信息'
        this.getDetail(row.Id)
        this.rules['Password'][0].required = false
      } else {
        this.dialogTitle = '新增用户'
        this.formInfo = {
          Id: '',
          Name: '',
          Loginid: '',
          Password: '',
          Sex: '',
          Email: '',
          Phone: '',
          Birthday: '',
          Photo: '',
          Isactive: ''
        }
        this.rules['Password'].required = true
      }
    },
    // 详情
    getDetail(id) {
      this.axios.userManager.detail(id).then(res => {
        if (res.Code === 200) {
          this.formInfo = res.Data
        }
      })
    },
    // 更新
    upDateData() {
      this.axios.userManager.upDate(this.formInfo).then(res => {
        if (res.Code === 200) {
          this.$message.success('保存成功')
          this.getDataList()
        }
      })
    },
    // 保存
    saveFormInfo(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.confirmLoading = true
          this.upDateData()
          this.dialogVisible = false
        }
      })
    },
    // 取消/关闭
    handleCancel(name) {
      this.$refs[name].resetFields()
      this.dialogVisible = false
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
.tags {
  width: 100%;
  margin-bottom: 20px;
}
.tdset {
  width: 60px;
  height: 30px;
  cursor: pointer;
}
.userTable {
  width: 100%;
}
</style>
