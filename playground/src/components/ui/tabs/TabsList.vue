<script setup lang="ts">
import { cn } from '@/lib/utils'
defineProps<{ class?: string }>()
</script>

<template>
  <div :class="cn('inline-flex items-center rounded-lg bg-muted p-1 text-muted-foreground', $props.class)">
    <slot />
  </div>
</template>
