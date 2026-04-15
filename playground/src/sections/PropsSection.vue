<template>
  <DocSection id="props" title="Props" description="ProTable 组件接受的全部 props，均对应 UseProTableOptions 的同名选项。">
    <ApiTable :columns="propsCols" :rows="propsRows" />
  </DocSection>
</template>

<script setup lang="ts">
import DocSection from '@/components/DocSection.vue'
import ApiTable from '@/components/ApiTable.vue'
import { propsCols, propsRows } from '@/data/apiTableData'
</script>
