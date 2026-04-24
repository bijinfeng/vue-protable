<template>
  <DocSection
    id="demo-value-types"
    title="ValueType 字段类型"
    description="ProTable 内置多种字段类型，通过 valueType 配置自动渲染对应的展示和编辑控件。"
  >
    <DemoBlock
      title="字段类型展示"
      badge="valueType"
      description="以下展示各种 valueType 在表格中的渲染效果"
    >
      <ElementProTable
        :columns="valueTypeColumns"
        :dataSource="valueTypeData"
        :search="false"
        :pagination="false"
      />
    </DemoBlock>

    <DemoBlock
      title="字段类型编辑"
      badge="editable  valueType"
      description="点击编辑按钮查看各种 valueType 的编辑控件"
      style="margin-top: 16px"
    >
      <ElementProTable
        :columns="editableValueTypeColumns"
        :dataSource="editableValueTypeData"
        :editable="{
          type: 'single',
          onSave: () => true,
        }"
        :search="false"
        :pagination="false"
        rowKey="id"
      />
    </DemoBlock>
  </DocSection>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { ProColumnType } from '@vue-protable/core';

const valueTypeData = ref([
  {
    id: 1,
    textField: '普通文本',
    numberField: 42,
    switchField: true,
    progressField: 75,
    ratingField: 4,
    moneyField: 1234.56,
    percentField: 0.85,
    statusField: 'active',
    dateField: Date.now(),
    dateTimeField: Date.now(),
  },
  {
    id: 2,
    textField: '另一行文本',
    numberField: 100,
    switchField: false,
    progressField: 30,
    ratingField: 2,
    moneyField: 9999.99,
    percentField: 0.3,
    statusField: 'disabled',
    dateField: Date.now() - 86400000,
    dateTimeField: Date.now() - 86400000,
  },
]);

const valueTypeColumns: ProColumnType[] = [
  { title: 'ID', dataIndex: 'id', hideInSearch: true },
  { title: '文本 (text)', dataIndex: 'textField', valueType: 'text', hideInSearch: true },
  { title: '数字 (number)', dataIndex: 'numberField', valueType: 'number', hideInSearch: true },
  {
    title: '开关 (switch)',
    dataIndex: 'switchField',
    valueType: 'switch',
    hideInSearch: true,
  },
  {
    title: '进度 (progress)',
    dataIndex: 'progressField',
    valueType: 'progress',
    hideInSearch: true,
  },
  {
    title: '评分 (rating)',
    dataIndex: 'ratingField',
    valueType: 'rating',
    hideInSearch: true,
  },
  {
    title: '状态 (select)',
    dataIndex: 'statusField',
    valueType: 'select',
    hideInSearch: true,
    valueEnum: {
      active: { text: '正常', status: 'Success' },
      disabled: { text: '停用', status: 'Error' },
    },
  },
  {
    title: '日期 (date)',
    dataIndex: 'dateField',
    valueType: 'date',
    hideInSearch: true,
    dateFormatter: 'YYYY-MM-DD',
  },
  {
    title: '日期时间 (dateTime)',
    dataIndex: 'dateTimeField',
    valueType: 'dateTime',
    hideInSearch: true,
    dateFormatter: 'YYYY-MM-DD HH:mm',
  },
];

const editableValueTypeData = ref([
  {
    id: 1,
    textField: '可编辑文本',
    textareaField: '多行文本内容',
    numberField: 42,
    switchField: true,
    ratingField: 3,
    selectField: 'option1',
    radioField: 'a',
    checkboxField: ['x', 'y'],
    dateField: Date.now(),
  },
]);

const editableValueTypeColumns: ProColumnType[] = [
  { title: 'ID', dataIndex: 'id', editable: false },
  { title: '文本', dataIndex: 'textField', valueType: 'text' },
  { title: '多行文本', dataIndex: 'textareaField', valueType: 'textarea' },
  { title: '数字', dataIndex: 'numberField', valueType: 'number' },
  { title: '开关', dataIndex: 'switchField', valueType: 'switch' },
  { title: '评分', dataIndex: 'ratingField', valueType: 'rating' },
  {
    title: '下拉选择',
    dataIndex: 'selectField',
    valueType: 'select',
    valueEnum: [
      { label: '选项一', value: 'option1' },
      { label: '选项二', value: 'option2' },
      { label: '选项三', value: 'option3' },
    ],
  },
  {
    title: '单选',
    dataIndex: 'radioField',
    valueType: 'radio',
    valueEnum: [
      { label: 'A', value: 'a' },
      { label: 'B', value: 'b' },
      { label: 'C', value: 'c' },
    ],
  },
  {
    title: '多选',
    dataIndex: 'checkboxField',
    valueType: 'checkbox',
    valueEnum: [
      { label: 'X', value: 'x' },
      { label: 'Y', value: 'y' },
      { label: 'Z', value: 'z' },
    ],
  },
  { title: '日期', dataIndex: 'dateField', valueType: 'date' },
];
</script>
