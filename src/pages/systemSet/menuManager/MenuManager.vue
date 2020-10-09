<template>
  <div class="menuContent">
    <!-- 一级菜单 -->
    <div class="menuLevel">
      <h2 class="menuTitle">
        <span>一级菜单</span>
        <span class="btn" @click="addOrEditMenu(1, 'add')">
          <a-icon type="plus-circle" theme="twoTone" />
        </span>
      </h2>
      <div class="mentList">
        <div
          v-for="(item, index) in parentMenuList"
          :key="index"
          class="menuItem"
        >
          <div
            :class="{ 'active-class': nowIndex === index }"
            class="menuName"
            @click="showChildMenu(2, item, index)"
          >
            <a-icon :type="item.Icon" theme="twoTone" />
            <span style="margin-left:10px">{{ item.Name }}</span>
          </div>
          <div class="menuActions">
            <a-switch
              v-model="item.isActive"
              checked-children="启用"
              un-checked-children="禁用"
              default-checked
              @change="disabledMenu(item)"
            />
            <a-divider type="vertical" />
            <a-icon type="up-circle" theme="twoTone" @click="upOrder(Id)" />
            <a-divider type="vertical" />
            <a-icon type="down-circle" theme="twoTone" @click="downOrder(Id)" />
            <a-divider type="vertical" />
            <a-icon
              type="edit"
              theme="twoTone"
              @click="addOrEditMenu(1, 'edit', item)"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 二级菜单 -->
    <div class="menuLevel">
      <h2 class="menuTitle">
        <span>二级菜单</span>
        <span class="btn" @click="addOrEditMenu(2, 'add')">
          <a-icon type="plus-circle" theme="twoTone" />
        </span>
      </h2>

      <div class="mentList" v-if="childList.length">
        <div v-for="(item, index) in childList" :key="index" class="menuItem">
          <div
            class="menuName"
            :class="{ 'active-class': nowChildIndex === index }"
            @click="showChildMenu(3, item, index)"
          >
            <span style="margin-left:10px">{{ item.Name }}</span>
          </div>
          <div class="menuActions">
            <a-switch
              v-model="item.isActive"
              checked-children="启用"
              un-checked-children="禁用"
              default-checked
              @change="disabledMenu(item)"
            />
            <a-divider type="vertical" />
            <a-icon type="up-circle" theme="twoTone" />
            <a-divider type="vertical" />
            <a-icon type="down-circle" theme="twoTone" />
            <a-divider type="vertical" />
            <a-icon
              type="edit"
              theme="twoTone"
              @click="addOrEditMenu(2, 'edit', item)"
            />
          </div>
        </div>
      </div>
      <div v-else class="noData">
        <a-empty />
      </div>
    </div>
    <!-- 如果有三级菜单，在这里加 -->
    <!-- <div class="menuLevel"></div> -->
    <!-- 菜单权限 -->
    <!-- <div class="menuLevel"></div> -->
    <!-- 新增菜单弹框 -->
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
        <a-form-model-item label="父级菜单" v-if="menuLevel !== 1">
          <a-select
            v-model="menuForm.Parent"
            style="width: 120px;margin-left:5px"
          >
            <a-select-option v-for="item in parentMenuList" :key="item.Id">
              {{ item.Name }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="菜单名称" prop="Name">
          <a-input v-model="menuForm.Name" />
        </a-form-model-item>
        <a-form-model-item label="菜单编码" prop="Url">
          <a-input v-model="menuForm.Url" :disabled="urlDisabled" />
        </a-form-model-item>
        <a-form-model-item label="菜单图标" prop="Icon" v-if="menuLevel === 1">
          <a-input v-model="menuForm.Icon" />
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
export default {
  name: 'MenuManager',
  data() {
    return {
      // 请求菜单列表参数
      dataParams: {
        PageSize: 10,
        PageIndex: 1,
        ParamItemList: [
          {
            // Name和ValueName需要保持一致，如果值为Parent则为请求一级菜单
            // Operation为is null，则是请求所有菜单，如果为=，则Value必须要有值，值为父级的Id值
            Name: 'Parent',
            ValueName: 'Parent',
            Operation: 'is null',
            Value: ''
          }
        ],
        ParamOrderList: [{ Name: 'Cdate', SortType: 0, SortNum: 0 }]
      },
      menuLevel: 1, //用作判断是一级菜单还是二级菜单
      parentMenuList: [],
      childList: [],
      nowIndex: null,
      nowChildIndex: null,

      dialogTitle: '新增菜单',
      dialogVisible: false,
      confirmLoading: false,
      // 新增编辑form
      urlDisabled: false,

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
      }
    }
  },
  computed: {
    ...mapState(['isReloadMenu'])
  },
  mounted() {
    // 请求菜单列表

    this.getMenuList(1)
  },

  methods: {
    ...mapMutations(['reloadMenu']),
    // 请求菜单list
    getMenuList(level, Id) {
      // 如果为3，则说明是点击的二级菜单
      if (level === 3) {
        return
      }
      if (level === 1) {
        this.dataParams.ParamItemList[0].Operation = 'is null'
        this.dataParams.ParamItemList[0].Value = ''
      } else {
        this.dataParams.ParamItemList[0].Operation = '='
        this.dataParams.ParamItemList[0].Value = Id
      }
      this.axios.menuManager.list(this.dataParams).then(res => {
        if (res.Code === 200) {
          if (res.Data && res.Data.List.length > 0) {
            _.each(res.Data.List, el => {
              if (el.Isactive === 1) {
                el.isActive = true
              } else {
                el.isActive = false
              }
            })
          }
          if (level === 1) {
            this.parentMenuList = res.Data.List
          } else {
            this.childList = res.Data.List
          }
        }
      })
    },

    showChildMenu(level, item, index) {
      if (level === 2) {
        this.nowIndex = index
      } else if (level === 3) {
        this.nowChildIndex = index
      } else {
        this.nowIndex = null
        this.nowChildIndex = null
      }
      this.getMenuList(level, item.Id)
    },

    // 启用/禁用
    disabledMenu(row) {
      this.reloadMenu(!this.isReloadMenu)
      let Isactive = 0
      if (row.isActive) {
        Isactive = 1
      } else {
        Isactive = 0
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
          this.$message.success('修改成功')
        } else {
          this.$message.error(res.Message)
        }
      })
    },

    /**
     * @param {
        level:菜单等级；一级菜单1，二级菜单2，...
        type:1.新增2.编辑
        item:菜单详情
    * }
     */
    addOrEditMenu(level, type, item) {
      this.dialogVisible = true
      this.menuLevel = level
      // 判断是否为新增菜单1、新增，2、编辑
      if (type === 'add') {
        this.menuForm = {
          Id: '',
          Parent: '',
          Name: '',
          Url: '',
          Icon: '',
          Isactive: 1
        }
      } else {
        this.urlDisabled = true
        this.axios.menuManager.detail(item.Id).then(res => {
          console.log(res)
        })
        this.menuForm = {
          Parent: item.Parent,
          Id: item.Id,
          Name: item.Name,
          Url: item.Url,
          Icon: item.Icon,
          Isactive: item.Isactive
        }
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
              this.getMenuList(this.menuLevel, this.menuForm.Parent)
              this.dialogVisible = false
              // 更新左侧菜单栏
              this.reloadMenu(true)
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
.menuContent {
  display: flex;
  height: 100%;
  width: 100%;

  .menuLevel {
    margin-right: 20px;
    border-radius: 10px;
    border: 1px solid #ccc;
    height: 100%;
    min-width: 300px;
    width: 500px;
    .menuTitle {
      width: 100%;
      padding: 20px;
      border-bottom: 1px solid #ccc;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .btn {
        cursor: pointer;
      }
    }
    .mentList {
      padding: 0 20px 20px;
      width: 100%;
      height: calc(~'100% - 80px');
      overflow-y: auto;
      .menuItem {
        height: 60px;
        font-size: 16px;
        border-bottom: 1px solid #ccc;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        .menuName {
          width: 50%;
        }
      }
    }
    .noData {
      width: 100%;
      // height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
