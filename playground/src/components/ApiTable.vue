<template>
  <div class="overflow-x-auto rounded-[10px] border border-border mb-6">
    <table class="w-full border-collapse text-[13.5px]">
      <thead>
        <tr>
          <th
            v-for="col in columns" :key="col.key"
            :style="col.width ? { width: col.width } : {}"
            class="text-left px-3.5 py-2.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground bg-muted/30 border-b border-border whitespace-nowrap"
          >{{ col.label }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, i) in rows" :key="i" class="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
          <td v-for="col in columns" :key="col.key" class="px-3.5 py-2.5 align-top text-foreground/75 leading-relaxed">
            <template v-if="col.key === 'name'">
              <code class="font-mono text-[12.5px] text-primary bg-primary/10 px-1.5 py-0.5 rounded whitespace-nowrap">{{ row[col.key] }}</code>
            </template>
            <template v-else-if="col.key === 'type'">
              <code class="font-mono text-[12px] text-green-500 dark:text-green-400 bg-green-500/8 px-1.5 py-0.5 rounded whitespace-pre-wrap break-words">{{ row[col.key] }}</code>
            </template>
            <template v-else-if="col.key === 'default'">
              <code v-if="row[col.key] && row[col.key] !== '-'" class="font-mono text-[12px] text-amber-600 dark:text-amber-400 bg-amber-500/8 px-1.5 py-0.5 rounded">{{ row[col.key] }}</code>
              <span v-else class="text-muted-foreground/40">—</span>
            </template>
            <template v-else>
              <span v-html="renderDesc(row[col.key])"></span>
            </template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  columns: { key: string; label: string; width?: string }[];
  rows: Record<string, string>[];
}>();

const renderDesc = (text: string) => {
  if (!text) return '—';
  return text.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
};
</script>

<style>
.inline-code {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 12px;
  color: #be185d;
  background: rgba(190,24,93,0.07);
  padding: 1px 5px;
  border-radius: 3px;
}
.dark .inline-code {
  color: #f9a8d4;
  background: rgba(249,168,212,0.1);
}
</style>
