<template>
  <DocSection
    id="introduction"
    title="介绍"
    description="Vue Headless ProTable 是一个面向 Vue 3 的无头（Headless）ProTable 实现。核心层只负责数据请求、状态管理、列能力，再通过 UI Adapter 接入不同的组件库。"
  >
    <div class="grid grid-cols-2 gap-3">
      <div v-for="feat in features" :key="feat.title"
        class="flex items-start gap-3 p-3.5 border border-border rounded-[10px] bg-muted/20 hover:border-border/60 hover:bg-muted/30 transition-colors cursor-default"
      >
        <div class="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/8 flex-shrink-0 mt-0.5">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" :stroke="feat.color" stroke-width="2" v-html="feat.path" />
        </div>
        <div>
          <div class="text-[13.5px] font-semibold text-foreground mb-0.5">{{ feat.title }}</div>
          <div class="text-[12.5px] text-muted-foreground leading-snug">{{ feat.desc }}</div>
        </div>
      </div>
    </div>
  </DocSection>
</template>

<script setup lang="ts">
import DocSection from '@/components/DocSection.vue'

const features = [
  { title: 'Headless 架构', desc: '核心逻辑与 UI 完全解耦，可接入任意组件库', color: '#a5b4fc', path: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>' },
  { title: 'TypeScript 优先', desc: '完整类型推导，ProColumnType、SearchConfig 等类型全覆盖', color: '#86efac', path: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>' },
  { title: '内置 Adapter', desc: 'Element Plus 与 Ant Design Vue 开箱即用', color: '#fbbf24', path: '<path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>' },
  { title: '丰富能力', desc: '跨页选中、异步字典、联动依赖、轮询、可编辑行', color: '#f9a8d4', path: '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>' },
]
</script>
