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
          <h2 class="section-title">自定义表单项 & 单元格</h2>
          <p class="section-desc">覆盖 form slot、cell slot、操作列、区间查询</p>
        </div>
        <div class="grid grid-2">
          <el-card shadow="always" class="card">
            <template #header>
              <div class="card-title">用户列表（自定义 form / cell）</div>
            </template>
            <ElementProTable
              :request="fetchUserList"
              :columns="userColumns"
              rowKey="id"
              :search="{ defaultCollapsed: false }"
            >
              <template #form-role="{ model, field }">
                <el-radio-group v-model="model[field]" size="small">
                  <el-radio-button label="admin">管理员</el-radio-button>
                  <el-radio-button label="user">普通用户</el-radio-button>
                </el-radio-group>
              </template>
              <template #form-department="{ model, field }">
                <div class="seg">
                  <el-button size="small" :type="model[field] === undefined ? 'primary' : 'default'" @click="model[field] = undefined">全部</el-button>
                  <el-button size="small" :type="model[field] === '研发' ? 'primary' : 'default'" @click="model[field] = '研发'">研发</el-button>
                  <el-button size="small" :type="model[field] === '产品' ? 'primary' : 'default'" @click="model[field] = '产品'">产品</el-button>
                  <el-button size="small" :type="model[field] === '运营' ? 'primary' : 'default'" @click="model[field] = '运营'">运营</el-button>
                  <el-button size="small" :type="model[field] === '销售' ? 'primary' : 'default'" @click="model[field] = '销售'">销售</el-button>
                </div>
              </template>
              <template #cell-name="{ record }">
                <div class="cell-name">
                  <el-avatar :size="28" :style="{ background: avatarBg(record.name) }">{{ String(record.name).slice(0, 1) }}</el-avatar>
                  <div class="cell-name-main">
                    <div class="cell-name-title">{{ record.name }}</div>
                    <div class="cell-name-sub">ID: {{ record.id }} · {{ record.department }}</div>
                  </div>
                  <el-button link type="primary" @click="copyText(record.name)">复制</el-button>
                </div>
              </template>
              <template #cell-department="{ record }">
                <el-tag :type="deptTagType(record.department)" effect="dark">
                  {{ record.department }}
                </el-tag>
              </template>
              <template #cell-status="{ record }">
                <el-tag :type="record.status === 'active' ? 'success' : 'danger'" effect="plain">
                  {{ record.status === 'active' ? '正常' : '停用' }}
                </el-tag>
              </template>
              <template #cell-createdAt="{ record }">
                <el-tooltip :content="String(record.createdAt)" placement="top">
                  <span class="mono">{{ new Date(record.createdAt).toLocaleString() }}</span>
                </el-tooltip>
              </template>
            </ElementProTable>
          </el-card>

          <el-card shadow="always" class="card">
            <template #header>
              <div class="card-title">订单列表（区间查询 + 操作列）</div>
            </template>
            <ElementProTable
              :request="fetchOrderList"
              :columns="orderShowcaseColumns"
              rowKey="id"
              :search="{ defaultCollapsed: false }"
              :debounceTime="120"
            >
              <template #form-amountRange="{ model, field }">
                <div class="range">
                  <el-slider
                    v-model="model[field]"
                    range
                    :min="0"
                    :max="900"
                    :step="10"
                    style="width: 260px"
                  />
                  <div class="range-text">{{ Array.isArray(model[field]) ? `${model[field][0]} ~ ${model[field][1]}` : '-' }}</div>
                </div>
              </template>
              <template #form-channel="{ model, field }">
                <el-checkbox-group v-model="model[field]" size="small">
                  <el-checkbox-button label="alipay">支付宝</el-checkbox-button>
                  <el-checkbox-button label="wechat">微信</el-checkbox-button>
                  <el-checkbox-button label="card">银行卡</el-checkbox-button>
                </el-checkbox-group>
              </template>
              <template #cell-orderNo="{ record }">
                <div class="cell-order">
                  <span class="mono">{{ record.orderNo }}</span>
                  <el-button link type="primary" @click="copyText(record.orderNo)">复制</el-button>
                </div>
              </template>
              <template #cell-amount="{ record }">
                <div class="cell-amount">
                  <span :class="['mono', record.amount >= 600 ? 't-hot' : record.amount >= 300 ? 't-warm' : 't-cool']">
                    ￥{{ record.amount.toFixed(2) }}
                  </span>
                  <el-progress :percentage="Math.min(100, Math.round((record.amount / 900) * 100))" :stroke-width="10" :show-text="false" />
                </div>
              </template>
              <template #cell-status="{ record }">
                <el-tag :type="orderStatusTagType(record.status)">
                  {{ orderStatusLabel(record.status) }}
                </el-tag>
              </template>
              <template #cell-actions="{ record }">
                <div class="cell-actions">
                  <el-button size="small" type="primary" plain @click="openOrder(record.orderNo)">详情</el-button>
                  <el-button size="small" @click="openOrder(record.orderNo)">退款</el-button>
                </div>
              </template>
            </ElementProTable>
          </el-card>
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
import { ElMessage } from 'element-plus';
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

const orderShowcaseColumns = computed(() => {
  const base = orderColumns.map((c) => c);
  const amountRange = {
    title: '金额区间',
    dataIndex: 'amountRange',
    hideInTable: true,
    search: {
      transform: (val: any) => {
        if (!Array.isArray(val) || val.length !== 2) return {};
        const [min, max] = val;
        return { amountMin: min, amountMax: max };
      }
    }
  };
  const actions = { title: '操作', dataIndex: 'actions', hideInSearch: true };
  return [amountRange as any, ...base, actions as any];
});

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

const copyText = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    ElMessage.success('已复制');
  } catch {
    const input = document.createElement('textarea');
    input.value = text;
    input.style.position = 'fixed';
    input.style.left = '-9999px';
    input.style.top = '-9999px';
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    ElMessage.success('已复制');
  }
};

const avatarBg = (name: string) => {
  let h = 0;
  for (let i = 0; i < name.length; i += 1) h = (h * 31 + name.charCodeAt(i)) % 360;
  return `hsl(${h} 70% 45%)`;
};

const deptTagType = (dept: string) => {
  if (dept === '研发') return 'success';
  if (dept === '产品') return 'warning';
  if (dept === '运营') return 'info';
  return 'danger';
};

const orderStatusLabel = (status: string) => {
  if (status === 'pending') return '待支付';
  if (status === 'paid') return '已支付';
  if (status === 'refund') return '退款中';
  return '已关闭';
};

const orderStatusTagType = (status: string) => {
  if (status === 'paid') return 'success';
  if (status === 'pending') return 'warning';
  if (status === 'refund') return 'info';
  return 'danger';
};

const openOrder = (orderNo: string) => {
  ElMessage.info(`点击了 ${orderNo}`);
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

.mono {
  font-variant-numeric: tabular-nums;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
}

.seg {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.cell-name {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 34px;
}

.cell-name-main {
  min-width: 0;
  flex: 1;
}

.cell-name-title {
  font-size: 13px;
  line-height: 1.15;
  color: rgba(15, 23, 42, 0.92);
}

.cell-name-sub {
  margin-top: 2px;
  font-size: 12px;
  color: rgba(15, 23, 42, 0.55);
}

.cell-order {
  display: flex;
  align-items: center;
  gap: 10px;
}

.cell-amount {
  display: grid;
  gap: 6px;
}

.cell-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.t-hot {
  color: #b42318;
}

.t-warm {
  color: #b54708;
}

.t-cool {
  color: #026aa2;
}

.range {
  display: flex;
  align-items: center;
  gap: 10px;
}

.range-text {
  font-size: 12px;
  color: rgba(15, 23, 42, 0.55);
  min-width: 92px;
  text-align: right;
}

@media (max-width: 1100px) {
  .grid-2 {
    grid-template-columns: 1fr;
  }
}
</style>
