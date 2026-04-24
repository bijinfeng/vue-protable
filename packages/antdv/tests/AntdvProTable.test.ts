import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import { AntdvProTable } from '../src/index';

describe('AntdvProTable E2E', () => {
  it('renders ProTable component with dataSource', () => {
    const wrapper = mount(AntdvProTable, {
      props: {
        columns: [
          { title: 'Name', dataIndex: 'name', hideInSearch: true },
          { title: 'Age', dataIndex: 'age', hideInSearch: true },
        ],
        dataSource: [
          { id: 1, name: 'John', age: 30 },
          { id: 2, name: 'Jane', age: 25 },
        ],
        search: false,
      },
    });

    expect(wrapper.exists()).toBe(true);
  });

  it('renders with request function', async () => {
    const mockRequest = vi.fn().mockResolvedValue({
      success: true,
      data: [
        { id: 1, name: 'John', age: 30 },
        { id: 2, name: 'Jane', age: 25 },
      ],
      total: 2,
    });

    const wrapper = mount(AntdvProTable, {
      props: {
        columns: [
          { title: 'Name', dataIndex: 'name', hideInSearch: true },
          { title: 'Age', dataIndex: 'age', hideInSearch: true },
        ],
        request: mockRequest,
        search: false,
      },
    });

    await nextTick();
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(mockRequest).toHaveBeenCalled();
  });

  it('supports pagination', () => {
    const wrapper = mount(AntdvProTable, {
      props: {
        columns: [{ title: 'Name', dataIndex: 'name', hideInSearch: true }],
        dataSource: Array.from({ length: 50 }, (_, i) => ({ id: i, name: `User ${i}` })),
        pagination: {
          defaultPageSize: 10,
          defaultCurrent: 1,
        },
        search: false,
      },
    });

    expect(wrapper.exists()).toBe(true);
  });

  it('supports row selection', () => {
    const onChange = vi.fn();
    const wrapper = mount(AntdvProTable, {
      props: {
        columns: [{ title: 'Name', dataIndex: 'name', hideInSearch: true }],
        dataSource: [
          { id: 1, name: 'John' },
          { id: 2, name: 'Jane' },
        ],
        rowSelection: {
          onChange,
        },
        search: false,
      },
    });

    expect(wrapper.exists()).toBe(true);
  });

  it('supports manual request mode', () => {
    const mockRequest = vi.fn().mockResolvedValue({
      success: true,
      data: [],
      total: 0,
    });

    const wrapper = mount(AntdvProTable, {
      props: {
        columns: [{ title: 'Name', dataIndex: 'name', hideInSearch: true }],
        request: mockRequest,
        manual: true,
        search: false,
      },
    });

    expect(wrapper.exists()).toBe(true);
    expect(mockRequest).not.toHaveBeenCalled();
  });
});
