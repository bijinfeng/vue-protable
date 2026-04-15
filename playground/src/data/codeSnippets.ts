export const installCode = `# Element Plus adapter
pnpm add @headless-pro-table/element-plus element-plus

# Ant Design Vue adapter
pnpm add @headless-pro-table/antdv ant-design-vue`;

export const basicUsageCode = `<template>
  <ElementProTable
    :request="fetchUsers"
    :columns="columns"
    rowKey="id"
    :search="{ defaultCollapsed: false }"
  />
</template>

<script setup lang="ts">
import { ElementProTable } from '@headless-pro-table/element-plus'
import type { ProColumnType } from '@headless-pro-table/core'

interface User { id: number; name: string; status: string }

const columns: ProColumnType<User>[] = [
  { title: 'ID', dataIndex: 'id', hideInSearch: true },
  { title: '姓名', dataIndex: 'name', valueType: 'text' },
  {
    title: '状态', dataIndex: 'status', valueType: 'select',
    valueEnum: { active: { text: '正常' }, disabled: { text: '停用' } },
  },
]

const fetchUsers = async (params, sorter, filter) => {
  const res = await api.getUsers(params)
  return { data: res.list, total: res.total, success: true }
}
<\/script>`;

export const customAdapterCode = `import { createProTable } from '@headless-pro-table/core'
import MyTable from './MyTable.vue'
import MyForm from './MyForm.vue'
import MyFormItem from './MyFormItem.vue'
import MyPagination from './MyPagination.vue'
import MyInput from './MyInput.vue'
import MySelect from './MySelect.vue'
import MyDatePicker from './MyDatePicker.vue'

export const MyProTable = createProTable({
  Table: MyTable,
  Form: MyForm,
  FormItem: MyFormItem,
  Pagination: MyPagination,
  text: MyInput,
  select: MySelect,
  date: MyDatePicker,
})`;

export const slotsExampleCode = `<ElementProTable :request="fetch" :columns="cols" rowKey="id">
  <!-- 自定义搜索表单控件 -->
  <template #form-role="{ model, field }">
    <el-radio-group v-model="model[field]">
      <el-radio-button label="admin">管理员</el-radio-button>
      <el-radio-button label="user">普通用户</el-radio-button>
    </el-radio-group>
  </template>

  <!-- 自定义单元格渲染 -->
  <template #cell-status="{ record, index }">
    <el-tag :type="record.status === 'active' ? 'success' : 'danger'">
      {{ record.status === 'active' ? '正常' : '停用' }}
    </el-tag>
  </template>
</ElementProTable>`;
