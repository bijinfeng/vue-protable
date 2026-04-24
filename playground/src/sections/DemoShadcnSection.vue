<template>
  <DocSection
    id="demo-shadcn"
    title="自定义 UI 框架集成"
    description="展示如何使用 shadcn-vue 组件结合 @vue-protable/core 创建自定义适配器，实现完全自定义的 UI 框架集成。"
  >
    <DemoBlock
      title="shadcn-vue 自定义适配器"
      badge="createProTable  custom adapter"
      description="使用 shadcn-vue 组件从零构建 ProTable 适配器，展示 Headless 架构的灵活性"
    >
      <div class="mb-4 p-4 border border-border rounded-lg bg-muted/30">
        <h4 class="text-sm font-semibold mb-2">核心概念</h4>
        <ul class="text-sm text-muted-foreground space-y-1 list-disc list-inside">
          <li>使用 <code class="px-1 py-0.5 bg-muted rounded text-xs">createProTable(registry)</code> 创建自定义适配器</li>
          <li>通过 <code class="px-1 py-0.5 bg-muted rounded text-xs">mapProps</code> 映射标准 props 到 UI 组件</li>
          <li>完全控制表格、表单、分页等组件的渲染</li>
          <li>可集成任何 Vue UI 库或自定义组件</li>
        </ul>
      </div>

      <ShadcnProTable
        :request="fetchUserList"
        :columns="columns"
        :rowSelection="{ onChange: handleSelectionChange, selectedRowKeys }"
        rowKey="id"
        :search="{ defaultCollapsed: false }"
      >
        <template #cell-status="{ record }">
          <Badge :variant="record.status === 'active' ? 'default' : 'destructive'">
            {{ record.status === 'active' ? '正常' : '停用' }}
          </Badge>
        </template>
        <template #cell-createdAt="{ record }">
          <span class="text-sm text-muted-foreground">
            {{ new Date(record.createdAt).toLocaleDateString() }}
          </span>
        </template>
      </ShadcnProTable>

      <div class="mt-4 p-3 border border-border rounded-lg bg-card">
        <div class="flex items-center justify-between">
          <span class="text-sm text-muted-foreground">已选中</span>
          <span class="text-sm font-medium">{{ selectedKeys.length }} 项</span>
        </div>
        <div v-if="selectedKeys.length > 0" class="mt-2 text-xs text-muted-foreground">
          IDs: {{ selectedKeys.join(', ') }}
        </div>
      </div>
    </DemoBlock>

    <DemoBlock
      title="适配器代码示例"
      description="查看如何创建自定义适配器"
      style="margin-top: 16px"
    >
      <CodeBlock
        language="typescript"
        :code="adapterCode"
      />
    </DemoBlock>
  </DocSection>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DocSection from '@/components/DocSection.vue';
import DemoBlock from '@/components/DemoBlock.vue';
import CodeBlock from '@/components/CodeBlock.vue';
import { ShadcnProTable } from '@/adapters/shadcn';
import { fetchUserList } from '@/mock';
import { Badge } from '@/components/ui/badge';
import type { ProColumnType } from '@vue-protable/core';

const selectedKeys = ref<(string | number)[]>([]);

const columns: ProColumnType[] = [
  { title: 'ID', dataIndex: 'id', hideInSearch: true },
  { title: '用户名', dataIndex: 'name', valueType: 'text' },
  { title: '年龄', dataIndex: 'age', hideInSearch: true },
  {
    title: '角色',
    dataIndex: 'role',
    valueType: 'select',
    valueEnum: {
      admin: { text: '管理员' },
      user: { text: '普通用户' },
    },
  },
  {
    title: '状态',
    dataIndex: 'status',
    valueType: 'select',
    valueEnum: {
      active: { text: '正常', status: 'Success' },
      disabled: { text: '停用', status: 'Error' },
    },
  },
  { title: '创建时间', dataIndex: 'createdAt', hideInSearch: true },
];

const handleSelectionChange = (keys: (string | number)[]) => {
  selectedKeys.value = keys;
};

const adapterCode = `import { createProTable } from '@vue-protable/core';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import Table from '@/components/ui/table/Table.vue';

// 创建自定义 Table 包装器
const ShadcnTableWrapper = {
  name: 'ShadcnTableWrapper',
  props: {
    columns: Array,
    dataSource: Array,
    loading: Boolean,
    rowKey: [String, Function],
    rowSelection: Object,
  },
  setup(props) {
    return () => h(Table, {}, {
      default: () => [
        h(TableHeader, {}, { /* 表头渲染 */ }),
        h(TableBody, {}, { /* 表体渲染 */ }),
      ],
    });
  },
};

// 创建 ProTable 适配器
export const ShadcnProTable = createProTable({
  // 表格组件
  Table: ShadcnTableWrapper,

  // 表单容器
  Form: {
    component: 'div',
    mapProps: (props) => ({
      class: 'flex flex-wrap gap-4 mb-4 p-4 border rounded-lg',
    }),
  },

  // 表单项容器
  FormItem: {
    component: 'div',
    mapProps: (props) => ({
      class: 'flex flex-col gap-2 min-w-[200px]',
    }),
  },

  // 分页组件
  Pagination: {
    component: 'div',
    mapProps: (props) => ({
      // 自定义分页渲染逻辑
    }),
  },

  // 按钮组件
  Button,

  // 字段类型映射
  text: {
    component: Input,
    mapProps: (props) => ({
      modelValue: props.value,
      'onUpdate:modelValue': props.onChange,
      placeholder: '请输入',
    }),
  },

  select: {
    component: Select,
    mapProps: (props) => ({
      modelValue: props.value,
      'onUpdate:modelValue': props.onChange,
      options: props.options,
      placeholder: '请选择',
    }),
  },
});`;
</script>
