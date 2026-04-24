<script setup lang="ts">
defineProps<{
  label?: string;
  prop?: string;
}>();
</script>

<template>
  <div class="flex flex-col gap-1.5 min-w-[180px]">
    <label v-if="label" class="text-sm font-medium text-foreground">{{ label }}</label>
    <slot />
  </div>
</template>
