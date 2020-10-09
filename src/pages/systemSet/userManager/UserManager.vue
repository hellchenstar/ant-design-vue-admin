<template>
  <div>
    <div class="userTitle">
      <div class="searchInput">
        <a-input-search
          enter-button="搜索"
          v-model="searchContent"
          placeholder="用户名/身份证/电话号"
          @search="onSearch"
        />
      </div>
      <div class="action">
        <a-button type="primary">新增</a-button>
      </div>
    </div>
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

      <!-- <a-tag
        color="blue"
        closable
        v-for="(item, index) in tagList"
        :key="index"
        @close="closeTag(index)"
      >
        {{ `${item.column.title}:${item.value.label}` }}
      </a-tag> -->
    </div>
    <div class="userTable">
      <a-table :data-source="dataList" :columns="columns" bordered rowKey="Id">
        <!-- 用户名筛选 -->
        <tableFilterInput
          slot="filterName"
          name="filterName"
          :list="sexList"
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
          soltIcon="filterIcon"
          @handleFilter="handleFilter"
        ></tableFilterInput>
        <!-- 显示性别 -->
        <span slot="Sex" slot-scope="Sex">
          <a-tag v-if="Sex === 0">未知</a-tag>
          <a-tag v-if="Sex === 1">男</a-tag>
          <a-tag v-if="Sex === 2">女</a-tag>
        </span>
        <!-- 性别筛选 filterSex-->
        <tableFilterSelect
          slot="filterSex"
          name="filterSex"
          :list="sexList"
          slot-scope="{ column }"
          :columnInfoAndMethods="{ column }"
          soltIcon="filterIcon"
          @handleFilter="handleFilter"
        ></tableFilterSelect>

        <!-- 时间筛选 -->
        <tableFilterDatepicker
          slot="filterTime"
          name="filterTime"
          slot-scope="{ column }"
          :columnInfoAndMethods="{ column }"
          soltIcon="filterIcon"
          @handleFilterTime="handleFilter"
        ></tableFilterDatepicker>
        <!-- 是否启用 -->
        <span slot="Isactive" slot-scope="Isactive">
          <a-tag v-if="Isactive" color="red">否</a-tag>
          <a-tag v-else color="green">是</a-tag>
        </span>
      </a-table>
    </div>
  </div>
</template>
<script>
import _ from 'lodash'
import tableFilterSelect from '@/components/tableFilter/tableFilterSelect'
import tableFilterInput from '@/components/tableFilter/tableFilterInput'
import tableFilterDatepicker from '@/components/tableFilter/tableFilterDatepicker'
const sexList = [
  { id: '', name: '全部' },
  { id: 0, name: '未知' },
  { id: 1, name: '男' },
  { id: 2, name: '女' }
]
const columns = [
  {
    title: '用户名',
    dataIndex: 'Name',
    key: 'Name',
    Operation: 'like',
    SortNum: 3,
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
    SortNum: 3,
    scopedSlots: {
      filterDropdown: 'filterSex',
      filterIcon: 'filterIcon',
      customRender: 'Sex'
    }
  },
  {
    title: '登录账号',
    dataIndex: 'Loginid',
    key: 'Loginid',
    Operation: 'like',
    SortNum: 3,
    scopedSlots: {
      filterDropdown: 'filterLoginid',
      filterIcon: 'filterIcon',
      customRender: 'Loginid'
    }
  },
  {
    title: '更新时间',
    dataIndex: 'Udate',
    key: 'Udate',
    Operation: 'like',
    type: 'time| checkbox | text ',
    SortNum: 3,
    scopedSlots: {
      filterDropdown: 'filterTime',
      filterIcon: 'filterIcon',
      customRender: 'Udate'
    }
  },
  {
    title: '是否启用',
    dataIndex: 'Isactive',
    key: 'Isactive',
    Operation: '=',
    SortNum: 3,
    scopedSlots: {
      filterDropdown: 'filterIsactive',
      filterIcon: 'filterIcon',
      customRender: 'Isactive'
    }
  }
]
export default {
  name: 'UserManager',
  components: {
    tableFilterSelect,
    tableFilterInput,
    tableFilterDatepicker
  },
  mounted() {
    this.getDataList()
  },
  watch: {
    tagList: {
      handler: function(val) {
        if (!val.length) {
          this.listParams.ParamItemList = []
        } else {
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
            }
            if (this.listParams.ParamItemList.length) {
              _.each(this.listParams.ParamItemList, item => {
                if (item.Name === el.column.dataIndex) {
                  item.Value = el.value.key
                } else {
                  this.listParams.ParamItemList.push(obj)
                }
              })
            } else {
              this.listParams.ParamItemList.push(obj)
            }
          })
        }

        this.getDataList()
      },
      deep: true
    }
  },

  data() {
    return {
      sexList,
      columns,
      dataList: [],
      tagList: [],
      listParams: {
        PageSize: 10,
        PageIndex: 1,
        ParamItemList: [],
        ParamOrderList: []
      },
      searchContent: ''
    }
  },
  methods: {
    // 请求list
    getDataList() {
      this.axios.userManager.list(this.listParams).then(res => {
        if (res.Code === 200) {
          this.dataList = res.Data.List
        }
      })
    },
    onSearch() {},
    // 渲染tagList
    renderTags(item) {
      if (this.tagList.length) {
        _.each(this.tagList, (el, index) => {
          if (el.column.dataIndex === item.column.dataIndex) {
            // 处理选择值为空的情况
            if (!item.value.key && item.value.key !== 0) {
              this.tagList.splice(index, 1)
            } else {
              el.value.key = item.value.key
              el.value.label = item.value.label
            }
          } else {
            this.tagList.push(item)
          }
        })
      } else {
        this.tagList.push(item)
      }
      console.log(this.tagList)
    },
    // 关闭tag的回调
    closeTag(index) {
      this.tagList.splice(index, 1)
    },
    handleFilter(obj) {
      this.renderTags(obj)
    },
    // 处理时间筛选
    handleFilterTime(val) {
      console.log(val)
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
  .action {
    width: 50px;
  }
}
.tags {
  width: 100%;
  margin-bottom: 20px;
}
.userTable {
  width: 100%;
}
</style>
