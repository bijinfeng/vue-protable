<template>
  <DocSection
    id="demo-batch-actions"
    title="批量操作"
    description="支持跨页选中、批量操作提示条、自定义批量操作按钮。"
  >
    <DemoBlock
      title="用户列表"
      badge="rowSelection  preserveSelectedRowKeys  tableAlertRender"
      description="勾选行后显示批量操作提示条，支持跨页保留选中状态"
    >
      <ElementProTable
        :request="fetchUserList"
        :columns="userColumns"
        :rowSelection="{
          onChange: handleSelectionChange,
          selectedRowKeys: selectedKeys,
        }"
        preserveSelectedRowKeys
        rowKey="id"
        :search="{ defaultCollapsed: false }"
        :tableAlertRender="tableAlertRender"
        :tableAlertOptionRender="tableAlertOptionRender"
      />
    </DemoBlock>
  </DocSection>
</template>

<script setup lang="ts">
import { ref, h } from 'vue';
import { ElButton, ElMessage } from 'element-plus';
import { fetchUserList, userColumns } from '@/mock';

const selectedKeys = ref<(string | number)[]>([]);

const handleSelectionChange = (keys: (string | number)[]) => {
  selectedKeys.value = keys;
};

const tableAlertRender = () => {
  return h('div', { style: 'display: flex; align-items: center; gap: 8px' }, [
    h('span', `已选择 ${selectedKeys.value.length} 项`),
    h(
      ElButton,
      {
        type: 'primary',
        link: true,
        onClick: () => {
          selectedKeys.value = [];
        },
      },
      () => '清空'
    ),
  ]);
};

const tableAlertOptionRender = () => {
  return h('div', { style: 'display: flex; gap: 8px' }, [
    h(
      ElButton,
      {
        type: 'primary',
        size: 'small',
        onClick: () => {
          ElMessage.success(`批量导出 ${selectedKeys.value.length} 条数据`);
        },
      },
      () => '批量导出'
    ),
    h(
      ElButton,
      {
        type: 'danger',
        size: 'small',
        onClick: () => {
          ElMessage.warning(`批量删除 ${selectedKeys.value.length} 条数据`);
          selectedKeys.value = [];
        },
      },
      () => '批量删除'
    ),
  ]);
};
</script>
