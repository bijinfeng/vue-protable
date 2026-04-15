<script setup lang="ts">
import { computed } from 'vue'
import { badgeVariants, type BadgeVariants } from '.'
import { cn } from '@/lib/utils'

const props = defineProps<BadgeVariants>()

const classes = computed(() => cn(badgeVariants({ variant: props.variant })))
</script>

<template>
  <div :class="classes">
    <slot />
  </div>
</template>
