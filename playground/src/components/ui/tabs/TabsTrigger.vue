<script setup lang="ts">
import { inject, type Ref } from "vue";
import { cn } from "@/lib/utils";

const props = defineProps<{ value: string; class?: string }>();
const active = inject<Ref<string>>("tabs-active")!;

function setActive() {
  active.value = props.value;
}
</script>

<template>
  <button
    :class="
      cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all cursor-pointer',
        active === value
          ? 'bg-background text-foreground shadow'
          : 'hover:text-foreground',
        $props.class,
      )
    "
    @click="setActive"
  >
    <slot />
  </button>
</template>
