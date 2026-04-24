<template>
  <el-switch v-model="modelValue" v-bind="$attrs" />
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  value?: boolean;
}>();

const emit = defineEmits(['update:value', 'change']);

const modelValue = computed({
  get: () => props.value,
  set: (val) => {
    emit('update:value', val);
    emit('change', val);
  },
});
</script>
