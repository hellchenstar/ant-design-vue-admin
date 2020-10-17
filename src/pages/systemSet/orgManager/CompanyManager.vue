<template>
  <div>
    <div class="userTitle">
      <div class="searchInput">
        <a-input-search
          enter-button="搜索"
          v-model="searchContent"
          placeholder="公司名称/电话号"
          @search="onSearch"
          allowClear
          @pressEnter="onSearch"
        />
      </div>
      <div class="action">
        <a-button type="primary" @click="addAndEdit()">新增</a-button>
      </div>
    </div>
    <div class="userTable">
      <a-table
        :columns="columns"
        :data-source="dataList"
        rowKey="Id"
        bordered
        :row-selection="rowSelection"
        :pagination="pagination"
      >
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
          <a-tooltip placement="top">
            <template slot="title">
              <span>编辑</span>
            </template>
            <a-icon type="edit" theme="twoTone" @click="addAndEdit(row, 2)" />
          </a-tooltip>
        </span>
      </a-table>
    </div>
    <!-- 新增菜单弹框 -->
    <a-modal
      :title="dialogTitle"
      :visible="dialogVisible"
      :confirm-loading="confirmLoading"
      :footer="null"
      @ok="saveMenuInfo('formInfo')"
      @cancel="handleCancel('formInfo')"
    >
      <a-form-model
        :model="formInfo"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        ref="formInfo"
        :rules="rules"
      >
        <a-form-model-item label="机构名称" prop="Name">
          <a-input v-model="formInfo.Name" />
        </a-form-model-item>
        <a-form-model-item label="联系电话" prop="Phone">
          <a-input v-model="formInfo.Phone" />
        </a-form-model-item>
        <a-form-model-item label="机构地址" prop="Address">
          <a-input v-model="formInfo.Address" />
        </a-form-model-item>
        <a-form-model-item label="机构Logo" prop="Logo">
          <a-upload
            name="avatar"
            list-type="picture-card"
            class="avatar-uploader"
            :show-upload-list="false"
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            :before-upload="beforeUpload"
            @change="handleChange"
          >
            <img v-if="formInfo.Logo" :src="formInfo.Logo" alt="avatar" />
            <div v-else>
              <a-icon :type="loading ? 'loading' : 'plus'" />
              <div class="ant-upload-text">
                上传Logo
              </div>
            </div>
          </a-upload>
        </a-form-model-item>

        <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
          <a-button type="primary" @click="saveMenuInfo('formInfo')">
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
  </div>
</template>
<script>
import _ from 'lodash'
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
    title: '公司名称',
    dataIndex: 'Name',
    key: 'Name',
    Operation: 'like'
  },
  {
    title: '电话',
    dataIndex: 'Phone',
    key: 'Phone',
    Operation: 'like'
  },
  {
    title: '是否启用',
    dataIndex: 'Isactive',
    key: 'Isactive',
    Operation: '=',
    scopedSlots: { customRender: 'Isactive' }
  },
  {
    title: '地址',
    dataIndex: 'Address',
    key: 'Address',
    Operation: 'like'
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
      rowSelection,
      dataList: [],

      searchContent: '',
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
      },
      // 弹框
      dialogTitle: '',
      dialogVisible: false,
      confirmLoading: false,
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      // 机构信息
      formInfo: {
        Id: '',
        Name: '',
        Phone: '',
        Logo: 'xxx',
        Address: '',
        Isactive: 0
      },
      // logo上传
      loading: false,
      rules: {
        Name: [{ trigger: 'blur', message: '请输入机构名称', required: true }],
        Phone: [{ trigger: 'blur', message: '请输入机构电话', required: true }],
        Logo: [
          { trigger: 'change', message: '请上传机构Logo', required: true }
        ],
        Address: [
          { trigger: 'blur', message: '请输入机构地址', required: true }
        ]
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
            Name: 'Phone',
            ValueName: 'Phone',
            Operation: 'like',
            Value: `%${this.searchContent}%`,
            Group: 'group'
          }
        ]
      } else {
        arr = []
      }

      this.listParams.ParamItemList = arr1.concat(arr)
      this.getList()
    },

    getDetail(id) {
      this.axios.company.detail(id).then(res => {
        if (res.Code === 200) {
          this.formInfo = res.Data
        }
      })
    },
    addAndEdit(row) {
      this.dialogVisible = true
      if (row) {
        this.dialogTitle = '编辑机构信息'
        this.getDetail(row.Id)
      } else {
        this.dialogTitle = '新增机构'
        this.formInfo = {
          Id: '',
          Name: '',
          Phone: '',
          Logo: 'xxx',
          Address: '',
          Isactive: 0
        }
      }
    },
    beforeUpload(file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isJpgOrPng) {
        this.$message.error('You can only upload JPG file!')
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('Image must smaller than 2MB!')
      }
      return isJpgOrPng && isLt2M
    },
    // 图片转译为base64
    getBase64(img, callback) {
      const reader = new FileReader()
      reader.addEventListener('load', () => callback(reader.result))
      reader.readAsDataURL(img)
    },
    handleChange(info) {
      if (info.file.status === 'uploading') {
        this.loading = true
        return
      }
      if (info.file.status === 'done') {
        // Get this url from response in real world.
        this.getBase64(info.file.originFileObj, imageUrl => {
          this.formInfo.Logo = imageUrl
          this.loading = false
        })
      }
    },
    saveMenuInfo(name) {
      console.log(this.formInfo)
      this.$refs[name].validate(valid => {
        if (valid) {
          this.confirmLoading = true
          this.axios.company.upDate(this.formInfo).then(res => {
            if (res.Code === 200) {
              this.$message.success('保存成功')
              this.getList()
              this.dialogVisible = false
            }
          })
        }
      })
    },
    handleCancel(name) {
      this.dialogVisible = false
      this.$refs[name].resetFields()
    },
    changeActive(row) {
      let Isactive = 0
      if (row.Isactive) {
        Isactive = 0
      } else {
        Isactive = 1
      }
      let params = {
        Id: row.Id,
        Name: row.Name,
        Phone: row.Phone,
        Address: row.Address,
        Logo: row.Logo,
        Isactive: Isactive
      }
      this.axios.company.upDate(params).then(res => {
        if (res.Code === 200) {
          this.$message.success('保存成功')
          this.getList()
          this.dialogVisible = false
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
