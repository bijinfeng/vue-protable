<template>
  <DocSection id="quick-start" title="快速上手">
    <DocSection id="qs-install" title="安装" :level="3">
      <CodeBlock lang="bash" :code="installCode" />
    </DocSection>
    <DocSection id="qs-usage" title="基础用法" :level="3">
      <CodeBlock lang="vue" :code="basicUsageCode" />
    </DocSection>
    <DocSection
      id="qs-custom-adapter"
      title="自定义 Adapter"
      :level="3"
      description="如果内置适配器不满足需求，可以基于 createProTable 注册自己的 registry："
    >
      <CodeBlock lang="ts" :code="customAdapterCode" />
    </DocSection>
  </DocSection>
</template>

<script setup lang="ts">
import DocSection from '@/components/DocSection.vue'
import CodeBlock from '@/components/CodeBlock.vue'
import { installCode, basicUsageCode, customAdapterCode } from '@/data/codeSnippets'
</script>
