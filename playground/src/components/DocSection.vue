<template>
  <section :id="id" data-anchor class="mb-16 scroll-mt-6">
    <div class="mb-5">
      <component
        :is="headingTag"
        class="m-0 mb-2 font-semibold tracking-tight text-foreground"
        :class="level === 2
          ? 'text-[22px] pb-3 border-b border-border'
          : 'text-base text-foreground/85'"
      >
        <slot name="title">{{ title }}</slot>
      </component>
      <p v-if="description" class="m-0 text-sm text-muted-foreground leading-relaxed">{{ description }}</p>
    </div>
    <slot />
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  id: string;
  title?: string;
  description?: string;
  level?: 2 | 3;
}>();

const headingTag = computed(() => `h${props.level ?? 2}`);
</script>
