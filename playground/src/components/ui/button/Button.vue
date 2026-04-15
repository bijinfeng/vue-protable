<script setup lang="ts">
import { computed } from 'vue'
import { buttonVariants, type ButtonVariants } from '.'
import { cn } from '@/lib/utils'

const props = defineProps<ButtonVariants & { class?: string }>()
const classes = computed(() => cn(buttonVariants({ variant: props.variant, size: props.size }), props.class))
</script>

<template>
  <button :class="classes">
    <slot />
  </button>
</template>
