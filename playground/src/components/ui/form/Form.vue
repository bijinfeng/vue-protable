<template>
  <div class="flex flex-wrap gap-4 items-end">
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  model?: Record<string, any>;
}>();
</script>
