<template>
  <div>
    <div class="userTitle">
      <div class="searchInput">
        <a-input-search
          enter-button="搜索"
          v-model="searchContent"
          placeholder="菜单名称"
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
        :pagination="pagination"
      >
        <span slot="Isactive" slot-scope="text, record">
          <a-switch
            :checked="record.Isactive ? true : false"
            checked-children="启用"
            un-checked-children="禁用"
            @click="changeActive(record)"
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
          <a-divider type="vertical" />
          <a-tooltip placement="top">
            <template slot="title">
              <span>菜单授权</span>
            </template>
            <a-icon
              type="safety-certificate"
              theme="twoTone"
              @click="empower(row)"
            />
          </a-tooltip>
          <a-divider type="vertical" />
          <a-tooltip placement="top">
            <template slot="title">
              <span>角色人员管理</span>
            </template>
            <a-icon
              type="contacts"
              theme="twoTone"
              @click="roleAndUserHandle(row)"
            />
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
        <a-form-model-item label="角色名称" prop="Name">
          <a-input v-model="formInfo.Name" />
        </a-form-model-item>
        <a-form-model-item label="角色描述" prop="Description">
          <a-input v-model="formInfo.Description" />
        </a-form-model-item>
        <a-form-model-item label="启用" prop="Isactive">
          <a-radio-group v-model="formInfo.Isactive">
            <a-radio :value="1"> 启用</a-radio>
            <a-radio :value="0"> 禁用</a-radio>
          </a-radio-group>
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
    <!-- 角色菜单授权弹框 -->
    <a-modal
      :title="empowerTitle"
      :visible="empowerVisible"
      @cancel="closeEmpower"
      :footer="null"
    >
      <a-tree
        v-model="checkedKeys"
        checkable
        :expanded-keys="checkedKeys"
        :default-checked-keys="checkedKeys"
        :replace-fields="replaceFields"
        :tree-data="allMenuList"
        @check="selectMenu"
      />
      <div class="empowerBtn">
        <a-button type="primary" @click="updateEmpower">
          确定
        </a-button>
        <a-button style="margin-left: 10px;" @click="closeEmpower">
          取消
        </a-button>
      </div>
    </a-modal>
    <!-- 角色人员管理弹框 -->
    <a-modal
      :visible="roleAndUserVisible"
      title="新增人员"
      width="50%"
      :bodyStyle="{
        display: 'flex',
        justifyContent: 'center'
      }"
      @cancel="closeAddUserDia"
      :footer="null"
    >
      <a-transfer
        :data-source="userList"
        show-search
        :list-style="{
          width: '250px',
          height: '300px'
        }"
        :filter-option="filterOption"
        :operations="['添加', '删除']"
        :target-keys="targetKeys"
        :render="item => `${item.title}-${item.description}`"
        @change="handleUserChange"
      >
        <span slot="notFoundContent">
          没数据
        </span>
      </a-transfer>
    </a-modal>
  </div>
</template>
<script>
import _ from 'lodash'

const columns = [
  {
    title: '角色名称',
    dataIndex: 'Name',
    key: 'Name',
    Operation: 'like'
  },
  {
    title: '描述',
    dataIndex: 'Description',
    key: 'Description',
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
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  mounted() {
    this.getDataList()
  },
  data() {
    return {
      columns,
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
        Description: '',
        Isactive: 0
      },
      rules: {
        Name: [{ trigger: 'blur', message: '请输入角色名称', required: true }],
        Description: [
          { trigger: 'blur', message: '请输入描述', required: false }
        ]
      },
      // 角色授权菜单
      empowerTitle: '菜单授权',
      empowerVisible: false,
      allMenuList: [],
      currentMenuList: [],
      replaceFields: {
        title: 'Name',
        key: 'Id'
      },
      currentRoleId: '',
      checkedKeys: [],
      // 角色人员添加
      roleAndUserVisible: false,
      userList: [],
      targetKeys: []
    }
  },
  methods: {
    getDataList() {
      this.listParams.PageSize = this.pagination.pageSize
      this.listParams.PageIndex = this.pagination.current
      this.axios.roleManager.list(this.listParams).then(res => {
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
          }
        ]
      } else {
        arr = []
      }

      this.listParams.ParamItemList = arr1.concat(arr)
      this.getDataList()
    },

    getDetail(id) {
      this.axios.roleManager.detail(id).then(res => {
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
          Description: '',
          Isactive: 0
        }
      }
    },
    // 更新
    upDateData() {
      this.axios.roleManager.upDate(this.formInfo).then(res => {
        if (res.Code === 200) {
          this.$message.success('保存成功')
          this.getDataList()
        }
      })
    },
    saveMenuInfo(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.confirmLoading = true
          this.upDateData()
          this.dialogVisible = false
        }
      })
    },
    handleCancel(name) {
      this.dialogVisible = false
      this.$refs[name].resetFields()
    },

    // 启用禁用更新菜单
    changeActive(row) {
      this.formInfo = row
      this.formInfo.Isactive = row.Isactive ? 0 : 1
      this.upDateData()
    },
    // 菜单授权
    async empower(row) {
      this.empowerVisible = true
      this.currentRoleId = row.Id
      await this.getAllMenu()
      await this.getRoleAndMenuList(row.Id)
      await this.getMenuIntersection()
    },
    // 获取菜单交集
    getMenuIntersection() {
      if (this.allMenuList.length) {
        _.each(this.currentMenuList, item => {
          this.checkedKeys.push(item.FwMenuId)
        })
      }
      this.allMenuList = this.changeMenuStructure(this.allMenuList)
    },
    // 改变菜单结构
    changeMenuStructure(list) {
      let arr = []
      _.each(list, el => {
        if (!el.Parent) {
          // 一级菜单
          el.children = []
          arr.push(el)
        }
      })
      // 将二级菜单插入到1级菜单内
      _.each(list, el => {
        _.each(arr, item => {
          if (el.Parent && el.Parent === item.Id) {
            item.children.push(el)
          }
        })
      })
      return arr
    },
    // 获取当前用户菜单
    getRoleAndMenuList(id) {
      return new Promise(resolve => {
        this.axios.roleManager.roleAndMenuList(id).then(res => {
          if (res.Code === 200) {
            this.currentMenuList = res.Data
          } else {
            this.currentMenuList = []
          }
          resolve()
        })
      })
    },

    // 获取所有菜单列表
    getAllMenu() {
      return new Promise(resolve => {
        this.axios.menuManager.list().then(res => {
          if (res.Code === 200) {
            this.allMenuList = res.Data.List
          } else {
            this.allMenuList = []
          }
          resolve()
        })
      })
    },
    // 选择菜单
    selectMenu(checkedKeys) {
      console.log(checkedKeys)
      // this.checkedKeys = checkedKeys
    },
    updateEmpower() {
      let arr = []
      _.each(this.checkedKeys, el => {
        let obj = {
          FwRoleId: this.currentRoleId,
          FwMenuId: el
        }
        arr.push(obj)
      })

      this.axios.roleManager.updateRoleAndMenu(arr).then(res => {
        if (res.Code === 200) {
          this.empowerVisible = false
          this.$message.success('更新成功')
        }
      })
    },

    closeEmpower() {
      this.empowerVisible = false
      this.currentRoleId = ''
      this.checkedKeys = []
    },

    // change当前角色下人员
    async roleAndUserHandle(row) {
      this.roleAndUserVisible = true
      this.currentRoleId = row.Id
      await this.getAllUser()
      await this.getCurrentRoleUser()
    },
    // 获取所有用户
    getAllUser() {
      return new Promise(resolve => {
        this.axios.userManager.getAllUser().then(res => {
          if (res.Code === 200) {
            _.each(res.Data, el => {
              let obj = {
                key: el.Id,
                title: el.Name,
                description: 'left'
              }
              this.userList.push(obj)
            })
          } else {
            this.userList = []
          }
        })
        resolve()
      })
    },

    // 获取当前角色下的用户列表
    getCurrentRoleUser() {
      return new Promise(resolve => {
        this.axios.roleManager
          .getCurrentRoleUserList(this.currentRoleId)
          .then(res => {
            if (res.Code === 200) {
              _.each(res.Data, el => {
                this.targetKeys.push(el.FwUserId)
              })
            } else {
              this.targetKeys = []
            }
          })
        resolve()
      })
    },
    // 过滤
    // 过滤
    filterOption(inputValue, option) {
      return option.title.indexOf(inputValue) > -1
    },
    // 处理人员变化
    handleUserChange(targetKeys, direction, moveKeys) {
      // direction:right 添加，left 删除
      let obj = {
        FwRoleId: this.currentRoleId,
        FwUserId: targetKeys
      }
      if (direction === 'right') {
        this.axios.roleManager.addUser(obj).then(res => {
          if (res.Code !== 200) {
            this.$message.error('操作失败')
            return
          }
        })
      } else {
        this.axios.roleManager.deleteUser(obj).then(res => {
          if (res.Code !== 200) {
            this.$message.error('操作失败')
            return
          }
        })
      }
      this.targetKeys = targetKeys
    },
    closeAddUserDia() {
      this.roleAndUserVisible = false
      this.userList = []
      this.targetKeys = []
      this.currentRoleId = ''
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
.empowerBtn {
  margin-top: 10px;
}
</style>
