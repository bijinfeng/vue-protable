<template>
  <DocSection id="column-api" title="Column API" description="columns 数组中每一项的配置，类型为 ProColumnType<T>。">
    <ApiTable :columns="propsCols" :rows="columnRows" />
  </DocSection>
</template>

<script setup lang="ts">
import DocSection from '@/components/DocSection.vue'
import ApiTable from '@/components/ApiTable.vue'
import { propsCols, columnRows } from '@/data/apiTableData'
</script>
