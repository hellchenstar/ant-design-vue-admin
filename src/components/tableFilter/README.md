### tableFilterInput API

/\*\*

- @description: tableFilterInput API
- @param {type}
- @return {type}
  \*/

# slot：

必填，插槽名称，与列配置项保持一致

# name：

必填，组件传入插槽名称，与 slot 保持一致

# slot-scope：

必填，组件传入列方法及列信息，具体参考官方文档"
{
setSelectedKeys,
selectedKeys,
confirm,
clearFilters,
column
}

# columnInfoAndMethods：

必填，传入插槽组件内的方法及列信息，与 slot-scope 保持一致
{
setSelectedKeys,
selectedKeys,
confirm,
clearFilters,
column
}

# handleFilter：

父组件接收插槽传出数据

=================================================================================================

### tableFilterSelect API

/\*\*

- @description:
- @param {type}
- @return {type}
  \*/

# slot：

必填，插槽名称，与列配置项保持一致

# name：

必填，组件传入插槽名称，与 slot 保持一致

# slot-scope：

必填，组件传入列方法及列信息，具体参考官方文档"
{
setSelectedKeys,
selectedKeys,
confirm,
clearFilters,
column
}

# columnInfoAndMethods

必填，传入插槽组件内的方法及列信息，与 slot-scope 保持一致
{
setSelectedKeys,
selectedKeys,
confirm,
clearFilters,
column
}

# list

必填，插槽接收渲染下拉框的数组

# handleFilter

父组件接收插槽传出数据

=================================================================================================

### tableFilterDatepicker API

# slot：

必填，插槽名称，与列配置项保持一致

# name：

必填，组件传入插槽名称，与 slot 保持一致

# slot-scope：

必填，组件传入列方法及列信息，具体参考官方文档"
{
setSelectedKeys,
selectedKeys,
confirm,
clearFilters,
column
}

# columnInfoAndMethods

必填，传入插槽组件内的方法及列信息，与 slot-scope 保持一致
{
setSelectedKeys,
selectedKeys,
confirm,
clearFilters,
column
}

# valueFormat

必填，插槽接收日期格式：YYYY-MM-DD HH:mm:ss || YYYY-MM-DD HH:mm || YYYY-MM-DD

# handleFilter

父组件接收插槽传出数据

=================================================================================================

### tableFilterCheckBox API

# slot：

必填，插槽名称，与列配置项保持一致

# name：

必填，组件传入插槽名称，与 slot 保持一致

# slot-scope：

必填，组件传入列方法及列信息，具体参考官方文档"
{
setSelectedKeys,
selectedKeys,
confirm,
clearFilters,
column
}

# columnInfoAndMethods

必填，传入插槽组件内的方法及列信息，与 slot-scope 保持一致
{
setSelectedKeys,
selectedKeys,
confirm,
clearFilters,
column
}

# list

必填，插槽渲染选项数组，必须为 label:string,value:string 格式

# handleFilter

父组件接收插槽传出数据
