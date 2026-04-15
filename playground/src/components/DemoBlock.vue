<template>
  <div class="border border-border rounded-xl overflow-hidden mb-6">
    <div class="px-[18px] py-3 border-b border-border bg-muted/30">
      <div class="flex items-center gap-2 mb-1">
        <span class="text-[13.5px] font-semibold text-foreground">{{ title }}</span>
        <span v-if="badge" class="text-[11px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-mono">{{ badge }}</span>
      </div>
      <p v-if="description" class="m-0 text-[12.5px] text-muted-foreground leading-snug">{{ description }}</p>
    </div>
    <div class="p-[18px] bg-background">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  description?: string;
  badge?: string;
}>();
</script>
