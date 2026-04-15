<script setup lang="ts">
import { inject, type Ref } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{ value: string; class?: string }>()
const active = inject<Ref<string>>('tabs-active')!
</script>

<template>
  <button
    :class="cn(
      'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all cursor-pointer',
      active.value === value
        ? 'bg-background text-foreground shadow'
        : 'hover:text-foreground',
      $props.class
    )"
    @click="active.value = value"
  >
    <slot />
  </button>
</template>
