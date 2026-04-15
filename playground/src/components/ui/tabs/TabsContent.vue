<script setup lang="ts">
import { inject, type Ref } from 'vue'

const props = defineProps<{ value: string; class?: string }>()
const active = inject<Ref<string>>('tabs-active')!
</script>

<template>
  <div v-show="active.value === value" :class="$props.class">
    <slot />
  </div>
</template>
