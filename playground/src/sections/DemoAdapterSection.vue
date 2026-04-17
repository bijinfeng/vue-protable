<template>
  <DocSection
    id="demo-adapter"
    title="Adapter 对比"
    description="同一份 columns 配置，分别传给 Element Plus Adapter 和 Ant Design Vue Adapter。搜索、排序、表头筛选、字典回显、跨页选中效果完全一致。"
  >
    <TabDemo
      :tabs="[
        { title: 'Element Plus', badge: 'ElementProTable', description: '搜索 / 排序 / 表头筛选 / 字典回显 / 跨页选中' },
        { title: 'Ant Design Vue', badge: 'AntdvProTable', description: '相同 columns 配置，不同 UI 框架渲染' },
      ]"
    >
      <template #tab-0>
        <ElementProTable
          :request="fetchUserList"
          :columns="userColumns"
          :rowSelection="{ onChange: handleElSelect }"
          preserveSelectedRowKeys
          rowKey="id"
          :debounceTime="300"
          :beforeSearchSubmit="handleBeforeSubmit"
          :search="{ defaultCollapsed: false }"
        >
          <template #cell-status="{ record }">
            <el-tag :type="record.status === 'active' ? 'success' : 'danger'">
              {{ record.status === 'active' ? '正常' : '停用' }}
            </el-tag>
          </template>
          <template #cell-createdAt="{ record }">
            {{ new Date(record.createdAt).toLocaleString() }}
          </template>
        </ElementProTable>
        <div class="note">
          <span class="note-k">当前选中 ID</span>
          <span class="note-v">{{ elSelectedKeys.join(', ') || '—' }}</span>
        </div>
      </template>

      <template #tab-1>
        <a-config-provider :theme="antdThemeConfig">
          <AntdvProTable
            :request="fetchUserList"
            :columns="userColumns"
            :rowSelection="{ onChange: handleAntdSelect }"
            preserveSelectedRowKeys
            rowKey="id"
            :debounceTime="300"
            :search="{ defaultCollapsed: false }"
          >
            <template #cell-status="{ record }">
              <a-tag :color="record.status === 'active' ? 'green' : 'red'">
                {{ record.status === 'active' ? '正常' : '停用' }}
              </a-tag>
            </template>
            <template #cell-createdAt="{ record }">
              {{ new Date(record.createdAt).toLocaleString() }}
            </template>
          </AntdvProTable>
        </a-config-provider>
        <div class="note">
          <span class="note-k">当前选中 ID</span>
          <span class="note-v">{{ antdSelectedKeys.join(', ') || '—' }}</span>
        </div>
      </template>
    </TabDemo>
  </DocSection>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElementProTable } from '@vue-protable/element-plus'
import { AntdvProTable } from '@vue-protable/antdv'
import { theme as antdTheme } from 'ant-design-vue'
import { fetchUserList, userColumns } from '@/mock'
import DocSection from '@/components/DocSection.vue'
import TabDemo from '@/components/TabDemo.vue'
import { useTheme } from '@/composables/useTheme'

const { isDark } = useTheme()
const antdThemeConfig = computed(() => ({
  algorithm: isDark.value ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
}))

const elSelectedKeys = ref<(string | number)[]>([])
const antdSelectedKeys = ref<(string | number)[]>([])

const handleElSelect = (keys: (string | number)[]) => { elSelectedKeys.value = keys }
const handleAntdSelect = (keys: (string | number)[]) => { antdSelectedKeys.value = keys }
const handleBeforeSubmit = (params: any) => ({ ...params, extraToken: 'abc-123' })
</script>

<style scoped>
.note {
  margin-top: 12px; padding: 8px 12px; border-radius: 8px;
  background: hsl(var(--muted) / 0.3); border: 1px solid hsl(var(--border));
  display: flex; align-items: center; justify-content: space-between; gap: 10px;
}
.note-k { font-size: 12px; color: hsl(var(--muted-foreground)); }
.note-v { font-size: 12px; color: hsl(var(--foreground) / 0.85); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 60%; }
</style>
