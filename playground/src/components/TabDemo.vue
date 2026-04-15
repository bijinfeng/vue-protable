<template>
  <div class="border border-border rounded-xl overflow-hidden mb-6">
    <Tabs :default-value="`tab-0`" class="w-full">
      <div class="px-3 pt-2.5 bg-muted/30 border-b border-border">
        <TabsList class="h-auto p-0 bg-transparent gap-0.5">
          <TabsTrigger
            v-for="(tab, i) in tabs"
            :key="i"
            :value="`tab-${i}`"
            class="flex items-center gap-1.5 px-3.5 py-1.5 pb-2 rounded-t-md rounded-b-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=inactive]:bg-transparent text-[13.5px] text-muted-foreground data-[state=active]:text-foreground data-[state=active]:font-medium hover:text-foreground/75 transition-colors"
          >
            <span v-if="tab.badge" class="text-[11px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-mono font-normal">{{ tab.badge }}</span>
            {{ tab.title }}
          </TabsTrigger>
        </TabsList>
      </div>
      <div class="p-[18px] bg-background">
        <TabsContent
          v-for="(tab, i) in tabs"
          :key="i"
          :value="`tab-${i}`"
          class="mt-0"
        >
          <p v-if="tab.description" class="m-0 mb-4 text-[13px] text-muted-foreground leading-relaxed">{{ tab.description }}</p>
          <slot :name="`tab-${i}`" />
        </TabsContent>
      </div>
    </Tabs>
  </div>
</template>

<script setup lang="ts">
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

defineProps<{
  tabs: { title: string; badge?: string; description?: string }[];
}>();
</script>
