<template>
  <DocSection
    id="demo-column-settings"
    title="列设置"
    description="支持显示/隐藏列、拖拽排序、固定列、重置配置，支持持久化到 localStorage。"
  >
    <DemoBlock
      title="用户列表"
      badge="columnsState  options.setting"
      description="点击右上角设置按钮打开列设置面板"
    >
      <ElementProTable
        :request="fetchUserList"
        :columns="userColumns"
        :search="{ defaultCollapsed: false }"
        :columnsState="{
          persistenceKey: 'demo-column-settings',
          persistenceType: 'localStorage',
        }"
        :options="{
          reload: true,
          density: true,
          setting: true,
          fullScreen: false,
        }"
      />
    </DemoBlock>
  </DocSection>
</template>

<script setup lang="ts">
import { fetchUserList, userColumns } from '@/mock';
</script>
