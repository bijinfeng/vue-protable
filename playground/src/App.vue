<template>
  <div class="page">
    <header class="hero">
      <div class="hero-inner">
        <div class="hero-badge">Playground</div>
        <h1 class="hero-title">Vue Headless ProTable</h1>
        <p class="hero-subtitle">同一套核心逻辑，Element Plus / Ant Design Vue 双适配器，多场景验证</p>
        <div class="hero-meta">
          <div class="meta-item">跨页选中</div>
          <div class="meta-dot" />
          <div class="meta-item">异步字典</div>
          <div class="meta-dot" />
          <div class="meta-item">联动依赖</div>
          <div class="meta-dot" />
          <div class="meta-item">轮询与异常</div>
        </div>
      </div>
    </header>

    <main class="content">
      <section class="section">
        <div class="section-hd">
          <h2 class="section-title">Adapter 对比：同一份 Columns</h2>
          <p class="section-desc">搜索 / 排序 / 表头筛选 / 字典回显 / 跨页选中 / 自定义单元格</p>
        </div>
        <div class="grid grid-2">
          <el-card shadow="always" class="card">
            <template #header>
              <div class="card-title">Element Plus</div>
            </template>
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
              <div class="note-k">Element 当前选中 ID</div>
              <div class="note-v">{{ elSelectedKeys.join(', ') || '-' }}</div>
            </div>
          </el-card>

          <a-card class="card" title="Ant Design Vue">
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
            <div class="note">
              <div class="note-k">Antd 当前选中 ID</div>
              <div class="note-v">{{ antdSelectedKeys.join(', ') || '-' }}</div>
            </div>
          </a-card>
        </div>
      </section>

      <section class="section">
        <div class="section-hd">
          <h2 class="section-title">高级搜索：日期区间 + transform</h2>
          <p class="section-desc">使用 `search.transform` 将 “区间” 转为后端友好的 `createdAtStart/createdAtEnd`</p>
        </div>
        <el-card shadow="always" class="card">
          <template #header>
            <div class="card-title">用户列表（高级搜索）</div>
          </template>
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
        </el-card>
      </section>

      <section class="section">
        <div class="section-hd">
          <h2 class="section-title">联动字典：类目 → 子类目</h2>
          <p class="section-desc">通过 `dependencies` 触发异步 valueEnum 重新加载</p>
        </div>
        <el-card shadow="always" class="card">
          <template #header>
            <div class="card-title">商品列表（联动 Select）</div>
          </template>
          <ElementProTable
            :request="fetchProductList"
            :columns="productColumns"
            rowKey="id"
            :search="{ defaultCollapsed: false }"
          >
            <template #form-category="{ model, field }">
              <el-select
                v-model="model[field]"
                placeholder="选择类目"
                clearable
                style="width: 220px"
                @change="handleCategoryChange"
              >
                <el-option
                  v-for="opt in categoryOptions"
                  :key="opt.value"
                  :label="opt.label"
                  :value="opt.value"
                />
              </el-select>
            </template>
          </ElementProTable>
        </el-card>
      </section>

      <section class="section">
        <div class="section-hd">
          <h2 class="section-title">轮询与异常处理</h2>
          <p class="section-desc">开启轮询后会自动刷新；也可以强制制造错误以验证 `onRequestError`</p>
        </div>
        <el-card shadow="always" class="card">
          <template #header>
            <div class="card-title">订单列表（polling / error / params）</div>
          </template>
          <div class="toolbar">
            <div class="toolbar-left">
              <el-switch v-model="orderPollingEnabled" active-text="开启轮询" inactive-text="关闭轮询" />
              <el-switch v-model="orderForceError" active-text="强制报错" inactive-text="正常请求" />
              <div class="toolbar-pill">lastTick: {{ orderTick }}</div>
            </div>
            <div class="toolbar-right">
              <div class="toolbar-label">keyword</div>
              <el-input v-model="orderKeyword" placeholder="NO-100001" style="width: 220px" clearable />
            </div>
          </div>
          <el-alert
            v-if="orderError"
            class="alert"
            type="error"
            :title="orderError"
            show-icon
            closable
            @close="orderError = ''"
          />
          <ElementProTable
            :request="fetchOrderList"
            :columns="orderColumns"
            rowKey="id"
            :polling="orderPollingEnabled ? 2000 : 0"
            :params="getOrderParams"
            :onRequestError="handleOrderError"
            :search="{ defaultCollapsed: false }"
          />
        </el-card>
      </section>

      <section class="section">
        <div class="section-hd">
          <h2 class="section-title">Manual 模式</h2>
          <p class="section-desc">`manual=true` 时不会自动请求，点击 “查询” 后才会发起请求</p>
        </div>
        <el-card shadow="always" class="card">
          <template #header>
            <div class="card-title">用户列表（manual）</div>
          </template>
          <ElementProTable
            :request="fetchUserList"
            :columns="userColumns"
            rowKey="id"
            manual
            :search="{ defaultCollapsed: false }"
          />
        </el-card>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { ElementProTable } from '@headless-pro-table/element-plus';
import { AntdvProTable } from '@headless-pro-table/antdv';
import { createProductColumns, fetchCategoryDict, fetchOrderList, fetchProductList, fetchUserList, orderColumns, userAdvancedColumns, userColumns } from './mock';

const elSelectedKeys = ref<(string | number)[]>([]);
const antdSelectedKeys = ref<(string | number)[]>([]);

const categoryOptions = ref<{ label: string; value: string }[]>([]);
const selectedCategory = ref<string>();

const productColumns = computed(() => createProductColumns(selectedCategory));

const orderPollingEnabled = ref(true);
const orderForceError = ref(false);
const orderKeyword = ref('');
const orderError = ref('');
const orderTick = ref(0);

const handleElSelect = (keys: (string | number)[]) => {
  elSelectedKeys.value = keys;
};

const handleAntdSelect = (keys: (string | number)[]) => {
  antdSelectedKeys.value = keys;
};

const handleBeforeSubmit = (params: any) => {
  return {
    ...params,
    extraToken: 'abc-123'
  };
};

const handleUserPostData = (data: any[]) => {
  return data.map((item) => ({
    ...item,
    name: typeof item.name === 'string' ? item.name : String(item.name),
  }));
};

const handleCategoryChange = (val: any) => {
  selectedCategory.value = val || undefined;
};

const getOrderParams = () => {
  orderTick.value = orderTick.value + 1;
  return {
    forceError: orderForceError.value,
    keyword: orderKeyword.value || undefined,
  };
};

const handleOrderError = (e: Error) => {
  orderError.value = e.message || String(e);
};

onMounted(async () => {
  categoryOptions.value = await fetchCategoryDict();
});
</script>

<style>
body {
  margin: 0;
  padding: 0;
  background: #0b0f1a;
  color: rgba(255, 255, 255, 0.92);
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.page {
  min-height: 100vh;
}

.hero {
  position: sticky;
  top: 0;
  z-index: 10;
  backdrop-filter: blur(12px);
  background: linear-gradient(180deg, rgba(11, 15, 26, 0.92), rgba(11, 15, 26, 0.65));
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.hero-inner {
  max-width: 1320px;
  margin: 0 auto;
  padding: 18px 24px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 6px 10px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 999px;
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.8);
}

.hero-title {
  margin: 10px 0 6px;
  font-size: 30px;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.hero-subtitle {
  margin: 0;
  color: rgba(255, 255, 255, 0.72);
  font-size: 14px;
}

.hero-meta {
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.meta-item {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.12);
  padding: 5px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.04);
}

.meta-dot {
  width: 4px;
  height: 4px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.24);
}

.content {
  max-width: 1320px;
  margin: 0 auto;
  padding: 28px 24px 80px;
}

.section {
  margin-top: 22px;
  padding-top: 18px;
}

.section-hd {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.section-title {
  margin: 0;
  font-size: 16px;
  letter-spacing: 0.01em;
}

.section-desc {
  margin: 0;
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
}

.grid {
  display: grid;
  gap: 14px;
}

.grid-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.card {
  border-radius: 14px;
  overflow: hidden;
}

.card-title {
  font-weight: 600;
  letter-spacing: 0.01em;
}

.note {
  margin-top: 12px;
  padding: 10px 12px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.note-k {
  color: rgba(255, 255, 255, 0.62);
  font-size: 12px;
}

.note-v {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.88);
  max-width: 70%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.toolbar-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.62);
}

.toolbar-pill {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.78);
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.04);
}

.alert {
  margin-bottom: 12px;
}

@media (max-width: 1100px) {
  .grid-2 {
    grid-template-columns: 1fr;
  }
}
</style>
