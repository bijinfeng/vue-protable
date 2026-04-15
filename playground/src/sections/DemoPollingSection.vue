<template>
  <DocSection
    id="demo-polling"
    title="轮询与异常处理"
    description="设置 polling 属性开启自动轮询；通过 onRequestError 回调捕获请求异常。"
  >
    <DemoBlock title="订单列表" badge="polling  onRequestError  params" description="每 2 秒自动刷新；可切换「强制报错」测试异常回调；keyword 通过 params 透传给 request">
      <div class="toolbar">
        <div class="toolbar-left">
          <el-switch v-model="pollingEnabled" active-text="开启轮询" inactive-text="关闭轮询" />
          <el-switch v-model="forceError" active-text="强制报错" inactive-text="正常请求" />
          <div class="toolbar-pill">lastTick: {{ tick }}</div>
        </div>
        <div class="toolbar-right">
          <span class="toolbar-label">keyword</span>
          <el-input v-model="keyword" placeholder="NO-100001" style="width: 200px" clearable />
        </div>
      </div>
      <el-alert v-if="errorMsg" class="alert" type="error" :title="errorMsg" show-icon closable @close="errorMsg = ''" />
      <ElementProTable
        :request="fetchOrderList"
        :columns="orderColumns"
        rowKey="id"
        :polling="pollingEnabled ? 2000 : 0"
        :params="getParams"
        :onRequestError="handleError"
        :search="{ defaultCollapsed: false }"
      />
    </DemoBlock>
  </DocSection>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElementProTable } from '@headless-pro-table/element-plus'
import { fetchOrderList, orderColumns } from '@/mock'
import DocSection from '@/components/DocSection.vue'
import DemoBlock from '@/components/DemoBlock.vue'

const pollingEnabled = ref(true)
const forceError = ref(false)
const keyword = ref('')
const errorMsg = ref('')
const tick = ref(0)

const getParams = () => {
  tick.value += 1
  return { forceError: forceError.value, keyword: keyword.value || undefined }
}
const handleError = (e: Error) => { errorMsg.value = e.message || String(e) }
</script>

<style scoped>
.toolbar { display: flex; align-items: center; justify-content: space-between; gap: 14px; margin-bottom: 12px; flex-wrap: wrap; }
.toolbar-left { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.toolbar-right { display: flex; align-items: center; gap: 8px; }
.toolbar-label { font-size: 12px; color: hsl(var(--muted-foreground)); }
.toolbar-pill { font-size: 12px; color: hsl(var(--foreground) / 0.7); padding: 3px 9px; border-radius: 999px; border: 1px solid hsl(var(--border)); background: hsl(var(--muted) / 0.3); font-family: "JetBrains Mono", monospace; }
.alert { margin-bottom: 12px; }
</style>
