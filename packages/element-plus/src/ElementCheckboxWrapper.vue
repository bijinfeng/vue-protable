<template>
  <el-checkbox-group v-model="modelValue" v-bind="$attrs">
    <el-checkbox
      v-for="option in normalizedOptions"
      :key="option.value"
      :label="option.value"
    >
      {{ option.label }}
    </el-checkbox>
  </el-checkbox-group>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  value?: any[];
  options?: Array<{ label: string; value: any }> | Record<string, string>;
}>();

const emit = defineEmits(['update:value', 'change']);

const normalizedOptions = computed(() => {
  if (!props.options) return [];
  if (Array.isArray(props.options)) return props.options;
  return Object.entries(props.options).map(([value, label]) => ({
    label,
    value,
  }));
});

const modelValue = computed({
  get: () => props.value || [],
  set: (val) => {
    emit('update:value', val);
    emit('change', val);
  },
});
</script>
