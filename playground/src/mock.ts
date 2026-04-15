import type { ProColumnType } from '@headless-pro-table/core';
import type { Ref } from 'vue';

export interface UserItem {
  id: number;
  name: string;
  age: number;
  role: string;
  status: string;
  department: string;
  createdAt: number;
}

const MOCK_DB: UserItem[] = Array.from({ length: 105 }).map((_, i) => ({
  id: i + 1,
  name: `用户 ${i + 1}`,
  age: 20 + (i % 30),
  role: i % 3 === 0 ? 'admin' : 'user',
  status: i % 5 === 0 ? 'disabled' : 'active',
  department: i % 4 === 0 ? '研发' : i % 4 === 1 ? '产品' : i % 4 === 2 ? '运营' : '销售',
  createdAt: Date.now() - i * 1000 * 60 * 60 * 24,
}));

export const fetchUserList = async (params: any, sorter: any, filter: any) => {
  return new Promise<{ data: UserItem[]; success: boolean; total: number }>((resolve) => {
    setTimeout(() => {
      let filteredData = [...MOCK_DB];

      if (params.name) {
        filteredData = filteredData.filter(item => item.name.includes(params.name));
      }
      if (params.role) {
        filteredData = filteredData.filter(item => item.role === params.role);
      }
      if (params.status) {
        filteredData = filteredData.filter(item => item.status === params.status);
      }
      if (params.department) {
        filteredData = filteredData.filter(item => item.department === params.department);
      }
      if (params.createdAtStart || params.createdAtEnd) {
        const start = params.createdAtStart ? Number(params.createdAtStart) : -Infinity;
        const end = params.createdAtEnd ? Number(params.createdAtEnd) : Infinity;
        filteredData = filteredData.filter(item => item.createdAt >= start && item.createdAt <= end);
      }

      if (sorter && sorter.age) {
        filteredData.sort((a, b) => sorter.age === 'ascend' ? a.age - b.age : b.age - a.age);
      }
      if (sorter && sorter.createdAt) {
        filteredData.sort((a, b) => sorter.createdAt === 'ascend' ? a.createdAt - b.createdAt : b.createdAt - a.createdAt);
      }

      if (filter && filter.status && filter.status.length > 0) {
        filteredData = filteredData.filter(item => filter.status.includes(item.status));
      }
      if (filter && filter.role && filter.role.length > 0) {
        filteredData = filteredData.filter(item => filter.role.includes(item.role));
      }
      if (filter && filter.department && filter.department.length > 0) {
        filteredData = filteredData.filter(item => filter.department.includes(item.department));
      }

      const total = filteredData.length;
      const { current = 1, pageSize = 10 } = params;
      const start = (current - 1) * pageSize;
      const data = filteredData.slice(start, start + pageSize);

      resolve({
        data,
        total,
        success: true,
      });
    }, 500);
  });
};

export const fetchRoleDict = () => {
  return new Promise<Record<string, any>>((resolve) => {
    setTimeout(() => {
      resolve({
        admin: { text: '管理员' },
        user: { text: '普通用户' },
      });
    }, 1000);
  });
};

export const userColumns: ProColumnType<UserItem>[] = [
  {
    title: 'ID',
    dataIndex: 'id',
    hideInSearch: true,
  },
  {
    title: '用户名',
    dataIndex: 'name',
    valueType: 'text',
    search: {
      transform: (val: any) => (typeof val === 'string' ? val.trim() : val)
    }
  },
  {
    title: '年龄',
    dataIndex: 'age',
    hideInSearch: true,
    sorter: true, // 开启表头排序
  },
  {
    title: '角色',
    dataIndex: 'role',
    valueType: 'select',
    valueEnum: fetchRoleDict, // 异步字典
  },
  {
    title: '状态',
    dataIndex: 'status',
    valueType: 'select',
    initialValue: 'active', // 测试初始值
    valueEnum: {
      active: { text: '正常', status: 'Success' },
      disabled: { text: '停用', status: 'Error' },
    },
    dependencies: ['role']
  },
  {
    title: '部门',
    dataIndex: 'department',
    valueType: 'select',
    valueEnum: [
      { label: '研发', value: '研发' },
      { label: '产品', value: '产品' },
      { label: '运营', value: '运营' },
      { label: '销售', value: '销售' },
    ]
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    valueType: 'date',
    dateFormatter: 'YYYY/MM/DD', // 测试自动格式化
    sorter: true,
  },
];

export const userAdvancedColumns: ProColumnType<UserItem>[] = [
  ...userColumns.filter((c) => c.dataIndex !== 'createdAt'),
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    valueType: 'date',
    hideInSearch: true,
    sorter: true,
  },
  {
    title: '创建时间区间',
    dataIndex: 'createdAtRange',
    hideInTable: true,
    search: {
      transform: (val: any) => {
        if (!Array.isArray(val) || val.length !== 2) return {};
        const [start, end] = val;
        const startAt = start instanceof Date ? start.getTime() : Number(start);
        const endAt = end instanceof Date ? end.getTime() : Number(end);
        return { createdAtStart: startAt, createdAtEnd: endAt };
      }
    }
  } as any,
];

export interface OrderItem {
  id: number;
  orderNo: string;
  amount: number;
  status: string;
  channel: string;
  createdAt: number;
}

const ORDER_DB: OrderItem[] = Array.from({ length: 87 }).map((_, i) => ({
  id: i + 1,
  orderNo: `NO-${String(100000 + i + 1)}`,
  amount: Math.round((Math.random() * 800 + 20) * 100) / 100,
  status: i % 4 === 0 ? 'paid' : i % 4 === 1 ? 'pending' : i % 4 === 2 ? 'refund' : 'closed',
  channel: i % 3 === 0 ? 'alipay' : i % 3 === 1 ? 'wechat' : 'card',
  createdAt: Date.now() - i * 1000 * 60 * 35,
}));

let ORDER_POLLING_TICK = 0;

export const fetchOrderList = async (params: any, sorter: any, filter: any) => {
  return new Promise<{ data: OrderItem[]; success: boolean; total: number }>((resolve, reject) => {
    setTimeout(() => {
      ORDER_POLLING_TICK += 1;

      if (params.forceError) {
        reject(new Error('Mock request error (forceError=true)'));
        return;
      }

      let data = [...ORDER_DB];

      if (params.keyword) {
        data = data.filter((o) => o.orderNo.includes(String(params.keyword)));
      }
      if (params.amountMin !== undefined || params.amountMax !== undefined) {
        const min = params.amountMin !== undefined ? Number(params.amountMin) : -Infinity;
        const max = params.amountMax !== undefined ? Number(params.amountMax) : Infinity;
        data = data.filter((o) => o.amount >= min && o.amount <= max);
      }
      if (params.status) {
        data = data.filter((o) => o.status === params.status);
      }
      if (Array.isArray(params.channel) && params.channel.length > 0) {
        data = data.filter((o) => params.channel.includes(o.channel));
      } else if (params.channel) {
        data = data.filter((o) => o.channel === params.channel);
      }

      if (filter && filter.status && filter.status.length > 0) {
        data = data.filter((o) => filter.status.includes(o.status));
      }
      if (filter && filter.channel && filter.channel.length > 0) {
        data = data.filter((o) => filter.channel.includes(o.channel));
      }

      if (sorter && sorter.amount) {
        data.sort((a, b) => sorter.amount === 'ascend' ? a.amount - b.amount : b.amount - a.amount);
      }
      if (sorter && sorter.createdAt) {
        data.sort((a, b) => sorter.createdAt === 'ascend' ? a.createdAt - b.createdAt : b.createdAt - a.createdAt);
      }

      if (ORDER_POLLING_TICK % 3 === 0) {
        data = data.map((o, idx) =>
          idx % 12 === 0 && o.status === 'pending' ? { ...o, status: 'paid' } : o
        );
      }

      const total = data.length;
      const { current = 1, pageSize = 10 } = params;
      const start = (current - 1) * pageSize;
      const page = data.slice(start, start + pageSize);
      resolve({ data: page, total, success: true });
    }, 450);
  });
};

export const fetchOrderStatusDict = () => {
  return Promise.resolve({
    pending: { text: '待支付' },
    paid: { text: '已支付' },
    refund: { text: '退款中' },
    closed: { text: '已关闭' },
  });
};

export const fetchChannelDict = () => {
  return Promise.resolve([
    { label: '支付宝', value: 'alipay' },
    { label: '微信', value: 'wechat' },
    { label: '银行卡', value: 'card' },
  ]);
};

export const orderColumns: ProColumnType<OrderItem>[] = [
  { title: '订单号', dataIndex: 'orderNo', valueType: 'text' },
  {
    title: '金额',
    dataIndex: 'amount',
    hideInSearch: true,
    sorter: true,
  },
  {
    title: '状态',
    dataIndex: 'status',
    valueType: 'select',
    valueEnum: fetchOrderStatusDict,
  },
  {
    title: '渠道',
    dataIndex: 'channel',
    valueType: 'select',
    valueEnum: fetchChannelDict,
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    valueType: 'dateTime',
    hideInSearch: true,
    sorter: true,
    dateFormatter: 'YYYY-MM-DD HH:mm:ss' as any,
  } as any,
];

export interface ProductItem {
  id: number;
  name: string;
  category: string;
  subCategory: string;
  price: number;
  stock: number;
  createdAt: number;
}

const PRODUCT_DB: ProductItem[] = Array.from({ length: 66 }).map((_, i) => {
  const category = i % 3 === 0 ? 'phone' : i % 3 === 1 ? 'laptop' : 'accessory';
  const subCategory = category === 'phone' ? (i % 2 === 0 ? 'android' : 'ios') : category === 'laptop' ? (i % 2 === 0 ? 'windows' : 'mac') : (i % 2 === 0 ? 'cable' : 'charger');
  return {
    id: i + 1,
    name: `商品 ${i + 1}`,
    category,
    subCategory,
    price: Math.round((Math.random() * 6000 + 99) * 100) / 100,
    stock: 20 + (i % 40),
    createdAt: Date.now() - i * 1000 * 60 * 60 * 18,
  };
});

export const fetchProductList = async (params: any) => {
  return new Promise<{ data: ProductItem[]; success: boolean; total: number }>((resolve) => {
    setTimeout(() => {
      let data = [...PRODUCT_DB];
      if (params.name) data = data.filter((p) => p.name.includes(String(params.name)));
      if (params.category) data = data.filter((p) => p.category === params.category);
      if (params.subCategory) data = data.filter((p) => p.subCategory === params.subCategory);
      const total = data.length;
      const { current = 1, pageSize = 10 } = params;
      const start = (current - 1) * pageSize;
      resolve({ data: data.slice(start, start + pageSize), total, success: true });
    }, 420);
  });
};

export const fetchCategoryDict = () => {
  return Promise.resolve([
    { label: '手机', value: 'phone' },
    { label: '笔记本', value: 'laptop' },
    { label: '配件', value: 'accessory' },
  ]);
};

export const fetchSubCategoryDict = (category?: string) => {
  if (category === 'phone') {
    return Promise.resolve([
      { label: 'Android', value: 'android' },
      { label: 'iOS', value: 'ios' },
    ]);
  }
  if (category === 'laptop') {
    return Promise.resolve([
      { label: 'Windows', value: 'windows' },
      { label: 'macOS', value: 'mac' },
    ]);
  }
  if (category === 'accessory') {
    return Promise.resolve([
      { label: '数据线', value: 'cable' },
      { label: '充电器', value: 'charger' },
    ]);
  }
  return Promise.resolve([]);
};

export const createProductColumns = (selectedCategory: Ref<string | undefined>) => {
  const cols: ProColumnType<ProductItem>[] = [
    { title: 'ID', dataIndex: 'id', hideInSearch: true },
    { title: '商品名', dataIndex: 'name', valueType: 'text' },
    {
      title: '类目',
      dataIndex: 'category',
      valueType: 'select',
      valueEnum: fetchCategoryDict,
    },
    {
      title: '子类目',
      dataIndex: 'subCategory',
      valueType: 'select',
      dependencies: ['category'],
      valueEnum: () => fetchSubCategoryDict(selectedCategory.value),
    },
    { title: '价格', dataIndex: 'price', hideInSearch: true },
    { title: '库存', dataIndex: 'stock', hideInSearch: true },
    { title: '上架时间', dataIndex: 'createdAt', valueType: 'date', hideInSearch: true },
  ];
  return cols;
};
