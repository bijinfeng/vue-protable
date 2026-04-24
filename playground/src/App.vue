<template>
  <DocsLayout>
    <IntroSection />
    <QuickStartSection />

    <PropsSection />
    <ColumnApiSection />
    <SlotsSection />

    <DemoAdapterSection />
    <DemoShadcnSection />
    <DemoCustomSection />
    <DemoValueTypesSection />
    <DemoAdvancedSearchSection />
    <DemoDependenciesSection />
    <DemoEditableSection />
    <DemoBatchActionsSection />
    <DemoToolbarSection />
    <DemoColumnSettingsSection />
    <DemoPollingSection />
    <DemoManualSection />
  </DocsLayout>
</template>

<script setup lang="ts">
import DocsLayout from './components/DocsLayout.vue'
import IntroSection from './sections/IntroSection.vue'
import QuickStartSection from './sections/QuickStartSection.vue'
import PropsSection from './sections/PropsSection.vue'
import ColumnApiSection from './sections/ColumnApiSection.vue'
import SlotsSection from './sections/SlotsSection.vue'
import DemoAdapterSection from './sections/DemoAdapterSection.vue'
import DemoShadcnSection from './sections/DemoShadcnSection.vue'
import DemoCustomSection from './sections/DemoCustomSection.vue'
import DemoValueTypesSection from './sections/DemoValueTypesSection.vue'
import DemoAdvancedSearchSection from './sections/DemoAdvancedSearchSection.vue'
import DemoDependenciesSection from './sections/DemoDependenciesSection.vue'
import DemoEditableSection from './sections/DemoEditableSection.vue'
import DemoBatchActionsSection from './sections/DemoBatchActionsSection.vue'
import DemoToolbarSection from './sections/DemoToolbarSection.vue'
import DemoColumnSettingsSection from './sections/DemoColumnSettingsSection.vue'
import DemoPollingSection from './sections/DemoPollingSection.vue'
import DemoManualSection from './sections/DemoManualSection.vue'
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap");

*,
*::before,
*::after {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  font-family: "IBM Plex Sans", ui-sans-serif, system-ui, sans-serif;
  font-size: 14px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  transition: background 200ms, color 200ms;
}

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

.dark ::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.12);
  border-radius: 3px;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}

:not(.dark) ::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.12);
  border-radius: 3px;
}

:not(.dark) ::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.2);
}
</style>
