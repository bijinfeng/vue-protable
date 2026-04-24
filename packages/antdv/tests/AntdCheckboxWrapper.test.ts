import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import AntdCheckboxWrapper from '../src/AntdCheckboxWrapper.vue';

describe('AntdCheckboxWrapper', () => {
  it('renders with array options', () => {
    const wrapper = mount(AntdCheckboxWrapper, {
      props: {
        value: ['option1'],
        options: [
          { label: 'Option 1', value: 'option1' },
          { label: 'Option 2', value: 'option2' },
        ],
      },
    });

    expect(wrapper.exists()).toBe(true);
  });

  it('renders with object options', () => {
    const wrapper = mount(AntdCheckboxWrapper, {
      props: {
        value: ['status1'],
        options: {
          status1: { text: 'Status 1' },
          status2: { text: 'Status 2' },
        },
      },
    });

    expect(wrapper.exists()).toBe(true);
  });

  it('emits update:value and change events', async () => {
    const wrapper = mount(AntdCheckboxWrapper, {
      props: {
        value: ['option1'],
        options: [
          { label: 'Option 1', value: 'option1' },
          { label: 'Option 2', value: 'option2' },
        ],
      },
    });

    await wrapper.vm.$emit('update:value', ['option1', 'option2']);
    await wrapper.vm.$emit('change', ['option1', 'option2']);

    expect(wrapper.emitted('update:value')).toBeTruthy();
    expect(wrapper.emitted('change')).toBeTruthy();
  });

  it('normalizes object options to array format', () => {
    const wrapper = mount(AntdCheckboxWrapper, {
      props: {
        options: {
          key1: { text: 'Label 1' },
          key2: { text: 'Label 2' },
        },
      },
    });

    const vm = wrapper.vm as any;
    const normalized = vm.normalizedOptions;

    expect(normalized).toEqual([
      { value: 'key1', label: 'Label 1' },
      { value: 'key2', label: 'Label 2' },
    ]);
  });

  it('handles empty value as empty array', () => {
    const wrapper = mount(AntdCheckboxWrapper, {
      props: {
        options: [{ label: 'Option 1', value: 'option1' }],
      },
    });

    const vm = wrapper.vm as any;
    expect(vm.modelValue).toEqual([]);
  });
});
