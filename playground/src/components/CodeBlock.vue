<template>
  <div class="rounded-[10px] border border-border overflow-hidden mb-5">
    <div class="flex items-center justify-between px-3.5 py-2 bg-muted/30 border-b border-border">
      <span class="font-mono text-[11px] uppercase tracking-widest text-muted-foreground/60">{{ lang }}</span>
      <button
        class="flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[12px] cursor-pointer font-[inherit] transition-colors"
        :class="copied
          ? 'border-green-400/30 text-green-400 bg-transparent'
          : 'border-border text-muted-foreground bg-transparent hover:text-foreground hover:border-primary hover:bg-primary/5'"
        @click="copy"
      >
        <svg v-if="!copied" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
        </svg>
        <svg v-else width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        {{ copied ? '已复制' : '复制' }}
      </button>
    </div>
    <div
      class="shiki-wrap overflow-x-auto scrollbar-thin text-[13px] leading-[1.65]"
      v-html="highlighted"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect, onMounted, onUnmounted } from 'vue';
import { codeToHtml } from 'shiki';

const props = defineProps<{ code: string; lang?: string }>();
const copied = ref(false);
const highlighted = ref('');
const isDark = ref(document.documentElement.classList.contains('dark'));

let observer: MutationObserver;
onMounted(() => {
  observer = new MutationObserver(() => {
    isDark.value = document.documentElement.classList.contains('dark');
  });
  observer.observe(document.documentElement, { attributeFilter: ['class'] });
});
onUnmounted(() => observer?.disconnect());

watchEffect(async () => {
  const theme = isDark.value ? 'github-dark' : 'github-light';
  highlighted.value = await codeToHtml(props.code, {
    lang: props.lang ?? 'typescript',
    theme,
  });
});

const copy = async () => {
  try {
    await navigator.clipboard.writeText(props.code);
  } catch {
    const el = Object.assign(document.createElement('textarea'), {
      value: props.code,
      style: 'position:fixed;left:-9999px;top:-9999px',
    });
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }
  copied.value = true;
  setTimeout(() => (copied.value = false), 1800);
};
</script>

<style>
.shiki-wrap pre {
  margin: 0;
  padding: 16px 18px;
}
.shiki-wrap code {
  font-family: "JetBrains Mono", monospace;
  font-size: 13px;
  line-height: 1.65;
}
</style>
