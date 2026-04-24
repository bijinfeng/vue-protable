import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import type { ProColumnType } from '@vue-protable/core';
import AntdTableWrapper from '../src/AntdTableWrapper.vue';

describe('AntdTableWrapper', () => {
  const mockColumns: ProColumnType[] = [
    { title: 'Name', dataIndex: 'name' },
    { title: 'Age', dataIndex: 'age', sorter: true },
    { title: 'Status', dataIndex: 'status', valueEnum: { active: { text: 'Active' }, inactive: { text: 'Inactive' } } },
  ];

  const mockData = [
    { id: 1, name: 'John', age: 30, status: 'active' },
    { id: 2, name: 'Jane', age: 25, status: 'inactive' },
  ];

  it('renders table with data and columns', () => {
    const wrapper = mount(AntdTableWrapper, {
      props: {
        dataSource: mockData,
        columns: mockColumns,
        loading: false,
      },
    });

    expect(wrapper.exists()).toBe(true);
  });

  it('shows loading state', () => {
    const wrapper = mount(AntdTableWrapper, {
      props: {
        dataSource: [],
        columns: mockColumns,
        loading: true,
      },
    });

    expect(wrapper.props('loading')).toBe(true);
  });

  it('generates antd columns with sorter', () => {
    const wrapper = mount(AntdTableWrapper, {
      props: {
        dataSource: mockData,
        columns: mockColumns,
        loading: false,
      },
    });

    const vm = wrapper.vm as any;
    const antdColumns = vm.antdColumns;

    expect(antdColumns[1].sorter).toBe(true);
  });

  it('generates filters from valueEnum', () => {
    const wrapper = mount(AntdTableWrapper, {
      props: {
        dataSource: mockData,
        columns: mockColumns,
        loading: false,
        valueEnumMap: {
          status: { active: { text: 'Active' }, inactive: { text: 'Inactive' } },
        },
      },
    });

    const vm = wrapper.vm as any;
    const antdColumns = vm.antdColumns;
    const statusColumn = antdColumns.find((c: any) => c.dataIndex === 'status');

    expect(statusColumn.filters).toEqual([
      { text: 'Active', value: 'active' },
      { text: 'Inactive', value: 'inactive' },
    ]);
  });

  it('formats value using valueEnum', () => {
    const wrapper = mount(AntdTableWrapper, {
      props: {
        dataSource: mockData,
        columns: mockColumns,
        loading: false,
        valueEnumMap: {
          status: { active: { text: 'Active' }, inactive: { text: 'Inactive' } },
        },
      },
    });

    const vm = wrapper.vm as any;
    const formatted = vm.formatValue('active', 'status');

    expect(formatted).toBe('Active');
  });

  it('handles array valueEnum', () => {
    const wrapper = mount(AntdTableWrapper, {
      props: {
        dataSource: mockData,
        columns: mockColumns,
        loading: false,
        valueEnumMap: {
          status: [
            { label: 'Active', value: 'active' },
            { label: 'Inactive', value: 'inactive' },
          ],
        },
      },
    });

    const vm = wrapper.vm as any;
    const formatted = vm.formatValue('active', 'status');

    expect(formatted).toBe('Active');
  });

  it('calls onTableChange when table changes', async () => {
    const onTableChange = vi.fn();
    const wrapper = mount(AntdTableWrapper, {
      props: {
        dataSource: mockData,
        columns: mockColumns,
        loading: false,
        onTableChange,
      },
    });

    const vm = wrapper.vm as any;
    vm.handleChange({ current: 2 }, {}, {});

    expect(onTableChange).toHaveBeenCalledWith({ current: 2 }, {}, {});
  });

  it('supports custom rowKey', () => {
    const wrapper = mount(AntdTableWrapper, {
      props: {
        dataSource: mockData,
        columns: mockColumns,
        loading: false,
        rowKey: 'id',
      },
    });

    expect(wrapper.props('rowKey')).toBe('id');
  });

  it('supports row selection', () => {
    const rowSelection = {
      selectedRowKeys: [1],
      onChange: vi.fn(),
    };

    const wrapper = mount(AntdTableWrapper, {
      props: {
        dataSource: mockData,
        columns: mockColumns,
        loading: false,
        rowSelection,
      },
    });

    expect(wrapper.props('rowSelection')).toEqual(rowSelection);
  });
});
