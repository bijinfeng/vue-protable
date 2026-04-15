export const propsCols = [
  { key: 'name', label: '属性名', width: '160px' },
  { key: 'type', label: '类型', width: '220px' },
  { key: 'default', label: '默认值', width: '100px' },
  { key: 'description', label: '说明' },
]

export const propsRows = [
  { name: 'request', type: '(params, sorter, filter) => Promise<{ data, total, success }>', default: '—', description: '数据请求函数，接收分页 + 搜索参数，返回 `{ data, total, success }`' },
  { name: 'columns', type: 'ProColumnType<T>[]', default: '[]', description: '列配置数组，见 Column API' },
  { name: 'rowKey', type: 'string | (record) => string | number', default: "'id'", description: '行唯一标识，用于跨页选中和可编辑行' },
  { name: 'search', type: 'false | SearchConfig', default: '{}', description: '搜索表单配置。`false` 表示隐藏搜索表单' },
  { name: 'pagination', type: 'boolean | PaginationConfig', default: 'true', description: '分页配置，`false` 关闭分页' },
  { name: 'manual', type: 'boolean', default: 'false', description: '为 `true` 时组件挂载后不自动发起请求' },
  { name: 'polling', type: 'number', default: '0', description: '轮询间隔（毫秒），`0` 或不设表示不轮询' },
  { name: 'debounceTime', type: 'number', default: '10', description: '搜索防抖时间（毫秒）' },
  { name: 'params', type: 'Ref<U> | (() => U) | U', default: '—', description: '额外透传给 `request` 的参数，支持响应式' },
  { name: 'rowSelection', type: '{ onChange, selectedRowKeys, alwaysShowAlert }', default: '—', description: '行选择配置，`onChange` 接收 `(keys, rows)` 参数' },
  { name: 'preserveSelectedRowKeys', type: 'boolean', default: 'false', description: '翻页时保留已选中的行 key' },
  { name: 'beforeSearchSubmit', type: '(params) => any', default: '—', description: '发起请求前的拦截器，可修改或追加参数' },
  { name: 'postData', type: '(data: T[]) => T[]', default: '—', description: '数据获取成功后的处理函数，可对数据进行二次加工' },
  { name: 'onRequestError', type: '(e: Error) => void', default: '—', description: '请求异常回调' },
  { name: 'editable', type: 'EditableConfig<T>', default: '—', description: '可编辑行配置，见 EditableConfig' },
]

export const columnRows = [
  { name: 'title', type: 'string', default: '—', description: '列标题' },
  { name: 'dataIndex', type: 'string', default: '—', description: '字段名，对应数据对象的 key' },
  { name: 'valueType', type: "'text' | 'select' | 'date' | 'dateTime' | string", default: "'text'", description: '表单控件类型，决定搜索表单使用哪种组件' },
  { name: 'valueEnum', type: 'Record | { label, value }[] | () => Promise<...>', default: '—', description: '枚举配置，支持对象、数组或异步函数（自动加载）' },
  { name: 'hideInSearch', type: 'boolean', default: 'false', description: '是否在搜索表单中隐藏此列' },
  { name: 'hideInTable', type: 'boolean', default: 'false', description: '是否在表格中隐藏此列' },
  { name: 'search', type: 'false | { transform: (val) => any }', default: '—', description: '`false` 表示不参与搜索；`transform` 可将表单值转换为请求参数' },
  { name: 'initialValue', type: 'any', default: '—', description: '搜索表单的默认初始值' },
  { name: 'dependencies', type: 'string[]', default: '—', description: '声明依赖的字段名，依赖字段变化时当前列 `valueEnum` 重新加载' },
  { name: 'sorter', type: 'boolean | "custom" | (a, b) => number', default: '—', description: '开启列排序，`true` 由后端处理，函数则前端排序' },
  { name: 'fixed', type: "'left' | 'right' | boolean", default: '—', description: '固定列位置' },
  { name: 'order', type: 'number', default: '—', description: '列渲染顺序权重，越大越靠前' },
  { name: 'dateFormatter', type: 'string | boolean | (val) => any', default: '—', description: '日期格式化，如 `"YYYY-MM-DD"`；`false` 禁用格式化' },
  { name: 'editable', type: 'false | (text, record, index) => boolean', default: '—', description: '单元格可编辑控制，`false` 禁用，函数动态判断' },
  { name: 'render', type: '(text, record, index) => any', default: '—', description: '自定义单元格渲染函数（也可使用 `#cell-{field}` 插槽）' },
  { name: 'renderFormItem', type: '(model, field) => any', default: '—', description: '自定义搜索表单项渲染函数（也可使用 `#form-{field}` 插槽）' },
]

export const slotsCols = [
  { key: 'name', label: '插槽名', width: '200px' },
  { key: 'type', label: '插槽 Props', width: '260px' },
  { key: 'description', label: '说明' },
]

export const slotsRows = [
  { name: 'cell-{dataIndex}', type: '{ record: T; index: number; text: any }', description: '自定义某列的单元格渲染。`{dataIndex}` 为列的 `dataIndex` 值' },
  { name: 'form-{dataIndex}', type: '{ model: Record<string, any>; field: string }', description: '自定义某列对应的搜索表单控件。`model[field]` 即表单值，使用 `v-model` 绑定' },
]
