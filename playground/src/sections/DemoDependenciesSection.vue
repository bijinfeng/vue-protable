<template>
  <DocSection
    id="demo-dependencies"
    title="联动字典"
    description="通过 dependencies 声明依赖字段，当上游字段值改变时，当前列的 valueEnum 自动重新请求。"
  >
    <DemoBlock title="商品列表" badge="dependencies" description="选择「类目」后，「子类目」自动重新加载对应枚举">
      <ElementProTable
        :request="fetchProductList"
        :columns="productColumns"
        rowKey="id"
        :search="{ defaultCollapsed: false }"
      >
        <template #form-category="{ model, field }">
          <el-select v-model="model[field]" placeholder="选择类目" clearable style="width: 220px" @change="handleCategoryChange">
            <el-option v-for="opt in categoryOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
          </el-select>
        </template>
      </ElementProTable>
    </DemoBlock>
  </DocSection>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ElementProTable } from '@vue-protable/element-plus'
import { createProductColumns, fetchCategoryDict, fetchProductList } from '@/mock'
import DocSection from '@/components/DocSection.vue'
import DemoBlock from '@/components/DemoBlock.vue'

const categoryOptions = ref<{ label: string; value: string }[]>([])
const selectedCategory = ref<string>()
const productColumns = computed(() => createProductColumns(selectedCategory))
const handleCategoryChange = (val: any) => { selectedCategory.value = val || undefined }

onMounted(async () => { categoryOptions.value = await fetchCategoryDict() })
</script>
