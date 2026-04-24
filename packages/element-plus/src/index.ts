import { createProTable } from '@vue-protable/core';
import {
  ElButton,
  ElCascader,
  ElColorPicker,
  ElDatePicker,
  ElForm,
  ElFormItem,
  ElInput,
  ElInputNumber,
  ElPagination,
  ElRate,
  ElTimePicker,
  ElTreeSelect,
} from 'element-plus';
import ElementCheckboxWrapper from './ElementCheckboxWrapper.vue';
import ElementRadioWrapper from './ElementRadioWrapper.vue';
import ElementSelectWrapper from './ElementSelectWrapper.vue';
import ElementSwitchWrapper from './ElementSwitchWrapper.vue';
import ElementTableWrapper from './ElementTableWrapper.vue';

export const ElementProTable: import('vue').Component = createProTable({
  Table: ElementTableWrapper,
  Form: {
    component: ElForm,
    mapProps: (props: any) => ({
      model: props.model,
      inline: true,
      labelPosition: 'right',
    }),
  },
  FormItem: {
    component: ElFormItem,
    mapProps: (props: any) => ({
      label: props.label,
      prop: props.prop,
    }),
  },
  Pagination: {
    component: ElPagination,
    mapProps: (props: any) => ({
      'current-page': props.current,
      'page-size': props.pageSize,
      total: props.total,
      layout: 'total, sizes, prev, pager, next, jumper',
      'onUpdate:current-page': (val: number) => props.onChange(val, props.pageSize),
      'onUpdate:page-size': (val: number) => props.onChange(props.current, val),
    }),
  },
  Button: ElButton,

  // Fields Mapping based on `valueType`
  text: {
    component: ElInput,
    mapProps: (props: any) => ({
      modelValue: props.value,
      'onUpdate:modelValue': props.onChange,
      clearable: true,
      placeholder: '请输入',
    }),
  },
  textarea: {
    component: ElInput,
    mapProps: (props: any) => ({
      modelValue: props.value,
      'onUpdate:modelValue': props.onChange,
      type: 'textarea',
      clearable: true,
      placeholder: '请输入',
      rows: 4,
    }),
  },
  number: {
    component: ElInputNumber,
    mapProps: (props: any) => ({
      modelValue: props.value,
      'onUpdate:modelValue': props.onChange,
      placeholder: '请输入',
      style: { width: '100%' },
    }),
  },
  select: {
    component: ElementSelectWrapper,
    mapProps: (props: any) => ({
      value: props.value,
      'onUpdate:value': props.onChange,
      options: props.options,
      loading: props.loading,
    }),
  },
  date: {
    component: ElDatePicker,
    mapProps: (props: any) => ({
      modelValue: props.value,
      'onUpdate:modelValue': props.onChange,
      type: 'date',
      placeholder: '请选择日期',
      valueFormat: 'YYYY-MM-DD',
      clearable: true,
    }),
  },
  dateTime: {
    component: ElDatePicker,
    mapProps: (props: any) => ({
      modelValue: props.value,
      'onUpdate:modelValue': props.onChange,
      type: 'datetime',
      placeholder: '请选择日期时间',
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
      clearable: true,
    }),
  },
  dateRange: {
    component: ElDatePicker,
    mapProps: (props: any) => ({
      modelValue: props.value,
      'onUpdate:modelValue': props.onChange,
      type: 'daterange',
      startPlaceholder: '开始日期',
      endPlaceholder: '结束日期',
      clearable: true,
    }),
  },
  dateTimeRange: {
    component: ElDatePicker,
    mapProps: (props: any) => ({
      modelValue: props.value,
      'onUpdate:modelValue': props.onChange,
      type: 'datetimerange',
      startPlaceholder: '开始日期时间',
      endPlaceholder: '结束日期时间',
      clearable: true,
    }),
  },
  time: {
    component: ElTimePicker,
    mapProps: (props: any) => ({
      modelValue: props.value,
      'onUpdate:modelValue': props.onChange,
      placeholder: '请选择时间',
      clearable: true,
    }),
  },
  timeRange: {
    component: ElTimePicker,
    mapProps: (props: any) => ({
      modelValue: props.value,
      'onUpdate:modelValue': props.onChange,
      isRange: true,
      startPlaceholder: '开始时间',
      endPlaceholder: '结束时间',
      clearable: true,
    }),
  },
  switch: {
    component: ElementSwitchWrapper,
    mapProps: (props: any) => ({
      value: props.value,
      'onUpdate:value': props.onChange,
    }),
  },
  checkbox: {
    component: ElementCheckboxWrapper,
    mapProps: (props: any) => ({
      value: props.value,
      'onUpdate:value': props.onChange,
      options: props.options,
    }),
  },
  radio: {
    component: ElementRadioWrapper,
    mapProps: (props: any) => ({
      value: props.value,
      'onUpdate:value': props.onChange,
      options: props.options,
    }),
  },
  rating: {
    component: ElRate,
    mapProps: (props: any) => ({
      modelValue: props.value,
      'onUpdate:modelValue': props.onChange,
    }),
  },
  color: {
    component: ElColorPicker,
    mapProps: (props: any) => ({
      modelValue: props.value,
      'onUpdate:modelValue': props.onChange,
    }),
  },
  treeSelect: {
    component: ElTreeSelect,
    mapProps: (props: any) => ({
      modelValue: props.value,
      'onUpdate:modelValue': props.onChange,
      data: props.options,
      clearable: true,
      placeholder: '请选择',
    }),
  },
  cascader: {
    component: ElCascader,
    mapProps: (props: any) => ({
      modelValue: props.value,
      'onUpdate:modelValue': props.onChange,
      options: props.options,
      clearable: true,
      placeholder: '请选择',
    }),
  },
});

export default ElementProTable;
