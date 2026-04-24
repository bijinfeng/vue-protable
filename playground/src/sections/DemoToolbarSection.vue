<template>
  <DocSection
    id="demo-toolbar"
    title="工具栏自定义"
    description="支持自定义标题、副标题、工具按钮，支持嵌入搜索框。"
  >
    <DemoBlock
      title="订单列表"
      badge="headerTitle  toolBarRender  options"
      description="自定义工具栏标题和操作按钮"
    >
      <ElementProTable
        :request="fetchOrderList"
        :columns="orderColumns"
        :search="{ defaultCollapsed: false }"
        :headerTitle="headerTitle"
        :toolBarRender="toolBarRender"
        :options="{
          reload: true,
          density: true,
          setting: true,
          fullScreen: true,
        }"
      />
    </DemoBlock>
  </DocSection>
</template>

<script setup lang="ts">
import { h } from 'vue';
import { ElButton, ElMessage } from 'element-plus';
import { fetchOrderList, orderColumns } from '@/mock';

const headerTitle = () => {
  return h('div', { style: 'display: flex; flex-direction: column; gap: 4px' }, [
    h('div', { style: 'font-size: 16px; font-weight: 600' }, '订单管理'),
    h('div', { style: 'font-size: 12px; color: var(--el-text-color-secondary)' }, '查看和管理所有订单'),
  ]);
};

const toolBarRender = () => {
  return h('div', { style: 'display: flex; gap: 8px' }, [
    h(
      ElButton,
      {
        type: 'primary',
        onClick: () => {
          ElMessage.success('导出订单数据');
        },
      },
      () => '导出'
    ),
    h(
      ElButton,
      {
        onClick: () => {
          ElMessage.info('创建新订单');
        },
      },
      () => '新建订单'
    ),
  ]);
};
</script>
