# Vue ProTable 技术方案

## 1. 架构概述

### 1.1 核心设计理念

**Headless 组件模式**：核心逻辑与 UI 渲染完全解耦，通过 Composition API 提供状态管理和业务逻辑，UI 层通过适配器模式接入任意 Vue UI 组件库。

**关键优势**：
- 核心包 `@vue-protable/core` 零 UI 依赖
- 同一套逻辑支持 Element Plus、Ant Design Vue 等多个 UI 库
- 用户可自定义适配器接入私有组件库
- 完整的 TypeScript 类型推导

### 1.2 Monorepo 包结构

```
packages/
├── core/              # 核心 Headless 逻辑（零 UI 依赖）
│   ├── useProTable    # 主编排 composable
│   ├── useColumnManager
│   ├── useEditable
│   ├── useValueEnum
│   ├── createProTable # 工厂函数，返回 Vue 组件
│   └── types.ts
├── element-plus/      # Element Plus 适配器包
└── antdv/             # Ant Design Vue 适配器包
```

---

## 2. 核心数据流

```
用户操作（表单输入 / 分页切换 / 排序筛选）
       ↓
适配器组件将 UI 事件转换为标准 onChange 回调
       ↓
useProTable 更新内部状态（searchModel / pagination / sorter / filter）
       ↓
watch 触发 fetchData（含防抖）
       ↓
调用 request(params, sorter, filter) → 更新 dataSource / pagination.total
       ↓
适配器组件将 Headless 数据映射到 UI 组件 props
       ↓
视图更新
```

---

## 3. 适配器注册机制

### 3.1 UIAdapterRegistry 接口

```typescript
interface UIAdapterEntry {
  component: Component;
  mapProps?: (standardProps: Record<string, any>) => Record<string, any>;
  mapEvents?: (standardEvents: Record<string, any>) => Record<string, any>;
}

type UIAdapterRegistry = Record<string, UIAdapterEntry | Component>;
```

`createProTable(registry)` 工厂函数接收注册表，返回一个绑定了该 UI 库的 `<ProTable>` 组件。

### 3.2 标准化 Props 接口

核心层向适配器传递以下标准化 props，各 UI 库通过 `mapProps` 转换：

| 标准 Prop | 说明 |
|-----------|------|
| `value / onChange` | 表单输入控件 |
| `current / pageSize / total / onChange` | 分页器 |
| `dataSource / columns / loading / rowSelection / onTableChange` | 表格 |
| `model / onSubmit` | 表单容器 |
| `label / prop` | 表单项 |

### 3.3 适配器示例对比

| 组件 | Element Plus | Ant Design Vue |
|------|-------------|----------------|
| 表单项 prop | `prop` | `name` |
| 分页当前页 | `current-page` | `current` |
| 分页事件 | `current-change` + `size-change` | `change` |
| 输入框 v-model | `modelValue` + `update:modelValue` | `value` + `update:value` |

---

## 4. 核心 Composable 设计

### 4.1 useProTable

主编排 composable，整合所有子 composable，对外暴露完整状态和操作接口。

**输入参数（UseProTableOptions）**：

| 参数 | 类型 | 说明 |
|------|------|------|
| `request` | `Function` | 远程数据源，接收 params/sorter/filter，返回 `{ data, total }` |
| `columns` | `ProColumnType[]` | 列配置 |
| `params` | `Object \| Function` | 额外请求参数，优先级高于表单参数 |
| `pagination` | `Object \| false` | 分页配置，false 关闭分页 |
| `manualRequest` | `boolean` | 是否手动触发首次请求 |
| `polling` | `number` | 轮询间隔（最低 2000ms） |
| `debounceTime` | `number` | 请求防抖时间 |
| `revalidateOnFocus` | `boolean` | 窗口聚焦时自动刷新 |
| `defaultData` | `T[]` | 初始数据 |
| `dataSource` | `T[]` | 本地数据源（与 request 互斥） |
| `search` | `Object \| false` | 查询表单配置 |
| `editable` | `EditableConfig` | 可编辑表格配置 |
| `rowSelection` | `Object` | 行选择配置 |
| `preserveSelectedRowKeys` | `boolean` | 跨页保留选中状态 |
| `rowKey` | `string \| Function` | 行唯一键 |
| `dateFormatter` | `string \| false` | 日期格式化方式 |
| `beforeSearchSubmit` | `Function` | 提交前参数转换拦截器 |
| `postData` | `Function` | 接口返回数据预处理 |
| `onRequestError` | `Function` | 请求失败回调 |
| `onLoad` | `Function` | 数据加载完成回调 |
| `onDataSourceChange` | `Function` | 数据变更回调 |

**暴露状态**：

| 状态 | 说明 |
|------|------|
| `dataSource` | 当前展示数据 |
| `loading` | 加载状态 |
| `pagination` | 分页信息（current / pageSize / total） |
| `searchModel` | 查询表单数据 |
| `searchableColumns` | 参与查询表单的列 |
| `tableColumns` | 最终渲染的表格列（经 displayColumns 过滤排序） |
| `selectedRowKeys` | 已选行 key 列表 |
| `valueEnumMap` | 各列枚举数据 |
| `valueEnumLoadingMap` | 各列枚举加载状态 |
| `formCollapsed` | 查询表单折叠状态 |
| `action` | ActionRef 操作对象 |

**请求生命周期**：

1. 参数合并：`searchModel` + `params` + `pagination`（params 优先级最高）
2. `beforeSearchSubmit` 拦截转换
3. `search.transform` 字段名转换
4. 防抖（`debounceTime`）
5. 执行 `request`
6. `postData` 预处理返回数据
7. 更新 `dataSource` 和 `pagination.total`
8. 触发 `onLoad` / `onDataSourceChange` 回调

**轮询机制**：
- 使用 `setInterval` 实现，间隔不低于 2000ms
- 监听 `document.visibilitychange`，页面隐藏时暂停，恢复时继续
- `revalidateOnFocus` 监听 `window.focus` 事件触发刷新

**跨页行选择**：
- `preserveSelectedRowKeys = true` 时，使用内部 `Map<rowKey, record>` 缓存所有已选行
- 翻页后合并当前页选中状态与缓存，不丢失其他页选中数据

### 4.2 useColumnManager

管理列的显隐、固定、排序状态。

**内部状态**：`columnsMap: Record<dataIndex, { show, fixed, order }>`

**displayColumns 计算逻辑**：
1. 过滤 `show === false` 的列
2. 合并 `columnsMap` 中的 `fixed` 和 `order` 覆盖
3. 按 `order` 降序排列（order 大的在前）

**columnsState 持久化**：
- 支持 `localStorage` / `sessionStorage` 两种存储方式
- 支持受控模式：外部传入 `value` + `onChange` 接管状态

### 4.3 useEditable

可编辑行状态机。

**双缓存设计**：
- `originRowsCache`：保存进入编辑前的原始数据，用于取消时还原
- `draftRowsCache`：保存编辑中的草稿数据，保存前不污染原数据

**状态流转**：

```
startEditable(record)
  → 深拷贝 record 到 originRowsCache 和 draftRowsCache
  → 将 rowKey 加入 editableKeys

cancelEditable(record)
  → 调用 onCancel 钩子（返回 false 可拦截）
  → 从 editableKeys 移除，清空两个缓存

saveEditable(record, updatedRecord)
  → 调用 onSave 钩子（返回 false 可拦截）
  → 从 editableKeys 移除，清空两个缓存

deleteRow(record)
  → 调用 onDelete 钩子（返回 false 可拦截）
```

**受控模式**：通过 `config.editableKeys` 外部控制编辑行列表。

**单行/多行编辑**：通过 `editableType: 'single' | 'multiple'` 控制，`single` 模式下 `startEditable` 会先关闭其他编辑行。

### 4.4 useValueEnum

管理列枚举数据的加载与缓存。

**同步枚举**：直接存入 `valueEnumMap[dataIndex]`

**异步枚举**：`valueEnum` 为函数时，异步调用并维护 `valueEnumLoadingMap[dataIndex]` 加载状态

**联动刷新**：`useProTable` 中通过 `dependencies` 字段配置，当依赖字段值变化时重新调用 `fetchValueEnum(col)`

---

## 5. 列配置（ProColumnType）

### 5.1 核心字段

| 字段 | 说明 |
|------|------|
| `dataIndex` | 字段名，唯一标识 |
| `title` | 列标题，支持 tooltip |
| `valueType` | 值类型，决定展示和编辑控件 |
| `valueEnum` | 枚举映射，支持同步对象或异步函数 |
| `hideInTable` | 在表格中隐藏 |
| `hideInSearch` | 在查询表单中隐藏 |
| `hideInForm` | 在表单中隐藏 |
| `hideInSetting` | 在列设置面板中隐藏 |
| `ellipsis` | 超长截断 + tooltip |
| `copyable` | 一键复制 |
| `order` | 查询表单中的排列顺序 |
| `colSize` | 查询表单中占用的列数 |
| `initialValue` | 查询表单默认值 |
| `formItemProps` | 表单项属性（校验规则等） |
| `fieldProps` | 输入控件属性 |
| `search.transform` | 查询参数字段名转换 |
| `dependencies` | 联动依赖字段列表 |
| `render` | 自定义单元格渲染 |
| `renderText` | 纯文本场景简化渲染 |
| `renderFormItem` | 自定义查询表单控件 |
| `editable` | 是否可编辑（列级控制） |
| `readonly` | 只读模式 |

### 5.2 内置 valueType

| valueType | 展示 | 编辑控件 |
|-----------|------|----------|
| `text` | 文本 | Input |
| `digit` | 数字 | InputNumber |
| `date` | 日期（dayjs 格式化） | DatePicker |
| `dateTime` | 日期时间 | DateTimePicker |
| `dateRange` | 日期范围 | DateRangePicker |
| `time` | 时间 | TimePicker |
| `money` | 金额（千分位） | InputNumber |
| `percent` | 百分比 | InputNumber |
| `progress` | 进度条 | — |
| `rating` | 评分 | Rate |
| `switch` | 开关 | Switch |
| `image` | 图片 | — |
| `color` | 颜色 | ColorPicker |
| `code` | 代码块 | — |
| `jsonCode` | JSON 格式化 | — |
| `select` | 枚举选择 | Select |
| `checkbox` | 多选 | Checkbox |
| `radio` | 单选 | Radio |
| `treeSelect` | 树形选择 | TreeSelect |
| `cascader` | 级联选择 | Cascader |

### 5.3 valueEnum 枚举映射

```typescript
type ValueEnumItem = {
  text: string;
  status?: 'Success' | 'Error' | 'Warning' | 'Processing' | 'Default';
  color?: string;
  disabled?: boolean;
};

type ValueEnum = Record<string, ValueEnumItem | string> | (() => Promise<Record<string, ValueEnumItem>>);
```

表头筛选菜单自动从 `valueEnum` 生成选项。

---

## 6. 查询表单

### 6.1 表单形态

- **query 模式**（默认）：标准展开表单，支持折叠/展开
- **light 模式**：轻量悬浮筛选，字段以 tag 形式展示，点击展开浮层

### 6.2 字段渲染优先级

```
slot form-{dataIndex}（外部插槽）
  → col.renderFormItem（列级自定义渲染函数）
    → valueType 对应的适配器组件
```

### 6.3 响应式布局

通过 `search.span` 或 `search.colSize` 配置不同断点下的列数：

```typescript
interface SearchConfig {
  span?: number | { xs: number; sm: number; md: number; lg: number; xl: number; xxl: number };
  collapsed?: boolean;          // 默认折叠状态
  collapseRender?: Function;    // 自定义折叠按钮
  optionRender?: Function;      // 自定义操作区
  searchText?: string;          // 查询按钮文案
  resetText?: string;           // 重置按钮文案
  submitText?: string;          // 提交按钮文案
  labelWidth?: number | 'auto'; // 标签宽度
  filterType?: 'query' | 'light';
}
```

### 6.4 参数处理流程

1. 收集 `searchModel` 中各字段值
2. 应用各列 `search.transform` 进行字段名转换
3. 调用 `beforeSearchSubmit` 全局拦截转换
4. 合并外部 `params`（优先级最高）
5. 传入 `request`

---

## 7. 工具栏

### 7.1 布局结构

```
┌─────────────────────────────────────────────────────┐
│  headerTitle / tabs / multipleLine                  │
│                              toolBarRender | options │
└─────────────────────────────────────────────────────┘
```

### 7.2 内置工具按钮（options）

| 按钮 | 功能 | 默认显示 |
|------|------|----------|
| `reload` | 刷新数据 | true |
| `density` | 密度切换（默认/中/紧凑） | true |
| `setting` | 列设置面板 | true |
| `fullScreen` | 全屏切换 | false |

通过 `options: { reload: false }` 单独控制各按钮显隐，`options: false` 隐藏全部。

### 7.3 自定义扩展

- `toolBarRender`：在工具按钮左侧插入自定义按钮/内容
- `optionsRender`：完全替换工具区渲染
- `headerTitle`：左侧标题，支持 tooltip 和副标题
- 支持嵌入搜索框（`search` 配置在工具栏中）

---

## 8. 列设置面板

### 8.1 功能

- 复选框控制列显隐
- 拖拽调整列顺序
- 固定列到左侧/右侧
- 重置按钮恢复默认状态

### 8.2 状态持久化（columnsState）

```typescript
interface ColumnsStateType {
  persistenceKey?: string;
  persistenceType?: 'localStorage' | 'sessionStorage';
  value?: Record<string, ColumnState>;
  onChange?: (map: Record<string, ColumnState>) => void;
}
```

- 非受控模式：自动读写 `localStorage` / `sessionStorage`
- 受控模式：外部传入 `value` + `onChange` 完全接管

---

## 9. 分页

- 内置分页与 `request` 联动，自动传入 `current` 和 `pageSize`
- `pagination: false` 关闭分页（适用于本地数据或无限滚动场景）
- 支持配置 `pageSize` 可选项、`showSizeChanger`、`showQuickJumper` 等标准分页参数
- `actionRef.setPageInfo({ current, pageSize })` 支持外部手动设置分页

---

## 10. 行选择与批量操作

### 10.1 行选择配置

通过 `rowSelection` 传入标准行选择配置，核心层维护 `selectedRowKeys` 状态。

### 10.2 批量操作提示条（Alert Bar）

选中行后，在表格顶部自动显示提示条：
- 左侧：显示选中数量，支持 `tableAlertRender` 自定义
- 右侧：支持 `tableAlertOptionRender` 自定义操作按钮
- `alwaysShowAlert: true` 始终显示（即使未选中）
- `clearSelected()` 清空选中状态

### 10.3 跨页保留

`preserveSelectedRowKeys: true` 时，翻页不清空已选行，内部使用 `Map<rowKey, record>` 缓存。

---

## 11. 可编辑表格

### 11.1 编辑模式

- `editableType: 'single'`：单行编辑，开始新行时自动关闭上一行
- `editableType: 'multiple'`：多行同时编辑

### 11.2 新增行（RecordCreator）

```typescript
interface RecordCreatorProps {
  record: T | (() => T);    // 新行初始数据
  position?: 'top' | 'bottom'; // 插入位置
  creatorButtonText?: string;
}
```

点击新增按钮时，将新行插入 `dataSource` 并立即进入编辑状态。

### 11.3 编辑列操作

每行编辑状态下自动渲染「保存」「取消」操作列，通过 `actionRender` 可自定义。

### 11.4 表单校验

- 编辑中的单元格使用 `formItemProps.rules` 进行校验
- `saveEditable` 触发校验，失败时阻止保存
- `ignoreRules: true` 跳过校验

### 11.5 外部 Form 联动

支持通过 `formRef` 将编辑表格连接到外部 Form，实现跨组件表单联动。

---

## 12. ActionRef（命令式操作）

通过 `ref` 获取 `actionRef`，在组件外部触发操作：

| 方法 | 实现说明 |
|------|----------|
| `reload(resetPageIndex?)` | 重新执行 fetchData，可选重置页码 |
| `reloadAndRest()` | 重置 searchModel + 页码，再 reload |
| `reset()` | 重置所有状态至初始值 |
| `clearSelected()` | 清空 selectedRowKeys 和跨页缓存 |
| `startEditable(rowKey)` | 调用 useEditable.startEditable |
| `cancelEditable(rowKey)` | 调用 useEditable.cancelEditable |
| `scrollTo(key)` | 滚动到指定行（依赖 UI 层实现） |
| `fullScreen()` | 切换全屏状态 |
| `setPageInfo(info)` | 直接修改 pagination 状态 |

实现方式：`useProTable` 返回 `action` 对象，`createProTable` 通过 `expose` 暴露给外部。

---

## 13. 布局与外观

| 配置项 | 说明 |
|--------|------|
| `ghost` | 去除外层卡片内边距，适用于嵌入页面场景 |
| `defaultSize` | 默认密度：`default` / `middle` / `small` |
| `cardBordered` | 控制卡片边框显示 |
| `tableRender` | 完全接管表格区域渲染 |
| `tableExtraRender` | 在搜索区与表格之间插入自定义内容 |
| `tableViewRender` | 替换表格视图（如切换为列表/看板视图） |
| `errorBoundary` | 内置错误边界，默认开启，异常不崩溃整页 |

---

## 14. createProTable 渲染策略

`createProTable(registry)` 返回的组件使用渲染函数（`h`）组装各区域：

```
<div class="headless-pro-table">
  ├── <ErrorBoundary>（可选）
  ├── <SearchForm>（query/light 模式）
  ├── <TableAlertBar>（行选择提示条）
  ├── <Toolbar>（标题 + 工具按钮）
  ├── tableExtraRender（自定义插入区）
  ├── <Table>（核心表格）
  └── <Pagination>（分页器）
```

各区域均支持通过 `slot` 或 `render` prop 完全替换。

---

## 15. TypeScript 类型设计

```typescript
// 核心泛型：T 为行数据类型，U 为请求参数类型
function useProTable<T = Record<string, any>, U = Record<string, any>>(
  options: UseProTableOptions<T, U>
): ProTableState<T>

// 列配置泛型
interface ProColumnType<T = Record<string, any>> {
  dataIndex: keyof T | string;
  render?: (value: any, record: T, index: number) => VNode | string;
  // ...
}

// ActionRef 类型
interface ActionType {
  reload: (resetPageIndex?: boolean) => Promise<void>;
  reloadAndRest: () => Promise<void>;
  reset: () => void;
  clearSelected: () => void;
  startEditable: (rowKey: string | number) => void;
  cancelEditable: (rowKey: string | number) => void;
  scrollTo: (key: string) => void;
  fullScreen: () => void;
  setPageInfo: (info: Partial<PageInfo>) => void;
}
```

---

## 16. 工程化

| 项目 | 方案 |
|------|------|
| Monorepo 管理 | pnpm workspace |
| 构建工具 | tsdown（ESM + CJS 双格式输出） |
| 类型声明 | 输出 `.d.ts`，支持完整泛型推导 |
| TypeScript | v6.0 |
| 测试 | Vitest + @vue/test-utils |
| Playground | Vite + Vue 3 开发环境验证 |
