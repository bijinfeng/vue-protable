<template>
  <div class="docs-root bg-background text-foreground">
    <!-- Sidebar -->
    <aside class="sidebar bg-card border-r border-border">
      <div class="sidebar-logo border-b border-border">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="3" y="3" width="8" height="8" rx="1.5" fill="#6366F1"/>
          <rect x="13" y="3" width="8" height="8" rx="1.5" fill="#6366F1" opacity="0.5"/>
          <rect x="3" y="13" width="8" height="8" rx="1.5" fill="#6366F1" opacity="0.5"/>
          <rect x="13" y="13" width="8" height="8" rx="1.5" fill="#6366F1"/>
        </svg>
        <span class="flex-1 text-[15px] font-semibold tracking-tight text-foreground">ProTable</span>
        <span class="text-[11px] px-1.5 py-0.5 rounded bg-primary/15 text-primary font-mono">v1.0</span>
        <button
          class="flex items-center justify-center w-7 h-7 rounded-md border border-border bg-transparent text-muted-foreground cursor-pointer hover:text-foreground hover:border-primary transition-colors flex-shrink-0"
          @click="toggle"
          :aria-label="isDark ? '切换到亮色模式' : '切换到暗色模式'"
        >
          <svg v-if="isDark" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
          <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        </button>
      </div>

      <nav class="sidebar-nav" aria-label="文档导航">
        <div v-for="group in navGroups" :key="group.label" class="mb-1 px-3">
          <div class="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground px-2 pt-2 pb-1">{{ group.label }}</div>
          <a
            v-for="item in group.items"
            :key="item.id"
            :href="`#${item.id}`"
            class="block px-2 py-1.5 rounded-md text-[13.5px] no-underline transition-colors cursor-pointer"
            :class="activeId === item.id
              ? 'text-primary bg-primary/10 font-medium'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'"
            @click.prevent="scrollTo(item.id)"
          >
            {{ item.label }}
          </a>
        </div>
      </nav>
    </aside>

    <!-- Main content -->
    <main class="docs-main">
      <slot />
    </main>

    <!-- Right anchor TOC -->
    <aside class="toc border-l border-border" aria-label="页内导航">
      <div class="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-2 pl-2">本页内容</div>
      <nav>
        <a
          v-for="item in tocItems"
          :key="item.id"
          :href="`#${item.id}`"
          class="block px-2 py-1 rounded text-[12.5px] no-underline transition-colors cursor-pointer leading-snug"
          :class="activeId === item.id ? 'text-primary' : 'text-muted-foreground hover:text-foreground'"
          @click.prevent="scrollTo(item.id)"
        >
          {{ item.label }}
        </a>
      </nav>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useTheme } from '../composables/useTheme'

const { isDark, toggle } = useTheme()

const navGroups = [
  { label: '开始', items: [{ id: 'introduction', label: '介绍' }, { id: 'quick-start', label: '快速上手' }] },
  { label: 'API', items: [{ id: 'props', label: 'Props' }, { id: 'column-api', label: 'Column API' }, { id: 'slots', label: 'Slots' }] },
  { label: '示例', items: [
    { id: 'demo-adapter', label: 'Adapter 对比' },
    { id: 'demo-shadcn', label: '自定义 UI 框架' },
    { id: 'demo-custom', label: '自定义渲染' },
    { id: 'demo-value-types', label: 'ValueType 字段类型' },
    { id: 'demo-advanced-search', label: '高级搜索' },
    { id: 'demo-dependencies', label: '联动字典' },
    { id: 'demo-editable', label: '可编辑表格' },
    { id: 'demo-batch-actions', label: '批量操作' },
    { id: 'demo-toolbar', label: '工具栏自定义' },
    { id: 'demo-column-settings', label: '列设置' },
    { id: 'demo-polling', label: '轮询与异常' },
    { id: 'demo-manual', label: 'Manual 模式' },
  ]},
]

const tocItems = navGroups.flatMap(g => g.items)
const activeId = ref('introduction')

const scrollTo = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

let observer: IntersectionObserver | null = null

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      const visible = entries.filter(e => e.isIntersecting)
      if (!visible.length) return
      const top = visible.reduce((a, b) => a.boundingClientRect.top < b.boundingClientRect.top ? a : b)
      activeId.value = top.target.id
    },
    { rootMargin: '0px 0px -60% 0px', threshold: 0 }
  )
  navGroups.flatMap(g => g.items.map(i => i.id)).forEach(id => {
    const el = document.getElementById(id)
    if (el) observer?.observe(el)
  })
})

onUnmounted(() => observer?.disconnect())
</script>

<style scoped>
.docs-root {
  display: grid;
  grid-template-columns: 240px 1fr 200px;
  min-height: 100vh;
  font-family: 'IBM Plex Sans', ui-sans-serif, system-ui, sans-serif;
  transition: background 200ms, color 200ms;
}

.sidebar {
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
  padding: 20px 0;
  scrollbar-width: thin;
  transition: background 200ms, border-color 200ms;
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 16px 20px;
  margin-bottom: 16px;
}

.docs-main {
  min-width: 0;
  padding: 48px 56px 120px;
}

.toc {
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
  padding: 48px 16px 48px 8px;
  scrollbar-width: thin;
  transition: border-color 200ms;
}

@media (max-width: 1200px) {
  .docs-root { grid-template-columns: 220px 1fr; }
  .toc { display: none; }
}

@media (max-width: 768px) {
  .docs-root { grid-template-columns: 1fr; }
  .sidebar { display: none; }
  .docs-main { padding: 24px 20px 80px; }
}
</style>
