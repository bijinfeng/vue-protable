<template>
  <DocSection
    id="demo-advanced-search"
    title="高级搜索"
    description="使用 search.transform 将前端区间值转换为后端友好的 createdAtStart / createdAtEnd 参数。"
  >
    <DemoBlock title="日期区间 + transform" badge="search.transform" description="createdAtRange 列 hideInTable，transform 把 [Date, Date] 转换成 { createdAtStart, createdAtEnd }">
      <ElementProTable
        :request="fetchUserList"
        :columns="userAdvancedColumns"
        rowKey="id"
        :debounceTime="200"
        :search="{ defaultCollapsed: false }"
        :postData="handleUserPostData"
      >
        <template #form-createdAtRange="{ model, field }">
          <el-date-picker
            v-model="model[field]"
            type="daterange"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </template>
      </ElementProTable>
    </DemoBlock>
  </DocSection>
</template>

<script setup lang="ts">
import { ElementProTable } from '@vue-protable/element-plus'
import { fetchUserList, userAdvancedColumns } from '@/mock'
import DocSection from '@/components/DocSection.vue'
import DemoBlock from '@/components/DemoBlock.vue'

const handleUserPostData = (data: any[]) =>
  data.map((item) => ({ ...item, name: typeof item.name === 'string' ? item.name : String(item.name) }))
</script>
