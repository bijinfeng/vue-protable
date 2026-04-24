<template>
  <DocSection
    id="demo-editable"
    title="可编辑表格"
    description="支持行内编辑、新增行、删除行，支持单行和多行编辑模式。"
  >
    <TabDemo
      :tabs="[
        { title: '单行编辑', badge: 'editable.type=single', description: '编辑一行时自动关闭其他编辑行' },
        { title: '多行编辑', badge: 'editable.type=multiple', description: '可同时编辑多行' },
      ]"
    >
      <template #tab-0>
        <DemoBlock title="用户列表" description="点击编辑按钮进入编辑状态，支持保存和取消">
          <ElementProTable
            :columns="editableColumns"
            :dataSource="singleEditData"
            :editable="{
              type: 'single',
              onSave: handleSave,
              onDelete: handleDelete,
            }"
            :search="false"
            :pagination="false"
            rowKey="id"
          />
        </DemoBlock>
      </template>

      <template #tab-1>
        <DemoBlock title="用户列表" description="可同时编辑多行，每行独立保存">
          <ElementProTable
            :columns="editableColumns"
            :dataSource="multipleEditData"
            :editable="{
              type: 'multiple',
              onSave: handleSave,
              onDelete: handleDelete,
            }"
            :search="false"
            :pagination="false"
            rowKey="id"
          />
        </DemoBlock>
      </template>
    </TabDemo>
  </DocSection>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { ProColumnType } from '@vue-protable/core';

interface EditableUser {
  id: number;
  name: string;
  age: number;
  email: string;
  role: string;
}

const singleEditData = ref<EditableUser[]>([
  { id: 1, name: '张三', age: 28, email: 'zhangsan@example.com', role: 'admin' },
  { id: 2, name: '李四', age: 32, email: 'lisi@example.com', role: 'user' },
  { id: 3, name: '王五', age: 25, email: 'wangwu@example.com', role: 'user' },
]);

const multipleEditData = ref<EditableUser[]>([
  { id: 4, name: '赵六', age: 30, email: 'zhaoliu@example.com', role: 'admin' },
  { id: 5, name: '孙七', age: 27, email: 'sunqi@example.com', role: 'user' },
  { id: 6, name: '周八', age: 35, email: 'zhouba@example.com', role: 'user' },
]);

const editableColumns: ProColumnType<EditableUser>[] = [
  { title: 'ID', dataIndex: 'id', editable: false },
  {
    title: '姓名',
    dataIndex: 'name',
    valueType: 'text',
    formItemProps: { rules: [{ required: true, message: '请输入姓名' }] },
  },
  {
    title: '年龄',
    dataIndex: 'age',
    valueType: 'number',
    formItemProps: { rules: [{ required: true, message: '请输入年龄' }] },
  },
  { title: '邮箱', dataIndex: 'email', valueType: 'text' },
  {
    title: '角色',
    dataIndex: 'role',
    valueType: 'select',
    valueEnum: {
      admin: { text: '管理员' },
      user: { text: '普通用户' },
    },
  },
];

const handleSave = async (key: string | number, record: EditableUser) => {
  console.log('保存:', key, record);
  return true;
};

const handleDelete = async (key: string | number) => {
  console.log('删除:', key);
  singleEditData.value = singleEditData.value.filter((item) => item.id !== key);
  multipleEditData.value = multipleEditData.value.filter((item) => item.id !== key);
  return true;
};
</script>
