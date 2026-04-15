<template>
  <DocSection id="slots" title="Slots" description="通过具名插槽自定义表格单元格和搜索表单控件。">
    <ApiTable :columns="slotsCols" :rows="slotsRows" />
    <DocSection id="slots-example" title="插槽示例" :level="3">
      <CodeBlock lang="vue" :code="slotsExampleCode" />
    </DocSection>
  </DocSection>
</template>

<script setup lang="ts">
import DocSection from '@/components/DocSection.vue'
import ApiTable from '@/components/ApiTable.vue'
import CodeBlock from '@/components/CodeBlock.vue'
import { slotsCols, slotsRows } from '@/data/apiTableData'
import { slotsExampleCode } from '@/data/codeSnippets'
</script>
