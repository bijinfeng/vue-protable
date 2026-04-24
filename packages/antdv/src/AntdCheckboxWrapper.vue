<template>
  <a-checkbox-group
    v-model:value="modelValue"
    :options="normalizedOptions"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  value?: (string | number | boolean)[];
  options?: any[] | Record<string, { text: string; status?: string }>;
}>();

const emit = defineEmits(['update:value', 'change']);

const modelValue = computed({
  get: () => props.value ?? [],
  set: (val) => {
    emit('update:value', val);
    emit('change', val);
  },
});

const normalizedOptions = computed(() => {
  if (!props.options) return [];
  if (Array.isArray(props.options)) {
    return props.options.map((o) =>
      typeof o === 'object' && o !== null
        ? { label: o.label ?? o.text ?? String(o.value), value: o.value }
        : { label: String(o), value: o }
    );
  }
  return Object.entries(props.options).map(([value, meta]) => ({
    value,
    label: typeof meta === 'object' ? meta.text : String(meta),
  }));
});
</script>
