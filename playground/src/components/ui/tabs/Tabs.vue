<script setup lang="ts">
import { provide, ref } from 'vue'

const props = defineProps<{ defaultValue?: string }>()
const active = ref(props.defaultValue ?? '')
provide('tabs-active', active)
</script>

<template>
  <div>
    <slot />
  </div>
</template>
