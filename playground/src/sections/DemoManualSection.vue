<template>
  <DocSection
    id="demo-manual"
    title="Manual 模式"
    description="设置 manual=true 后，组件不会在挂载时自动发起请求，只有用户点击「查询」按钮后才会请求。适合需要用户主动触发的场景。"
  >
    <DemoBlock title="用户列表" badge="manual" description="manual=true — 挂载时不自动请求，点击查询后才发起">
      <ElementProTable
        :request="fetchUserList"
        :columns="userColumns"
        rowKey="id"
        manual
        :search="{ defaultCollapsed: false }"
      />
    </DemoBlock>
  </DocSection>
</template>

<script setup lang="ts">
import { ElementProTable } from '@vue-protable/element-plus'
import { fetchUserList, userColumns } from '@/mock'
import DocSection from '@/components/DocSection.vue'
import DemoBlock from '@/components/DemoBlock.vue'
</script>
