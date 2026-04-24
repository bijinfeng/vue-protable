import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import ElementCheckboxWrapper from '../src/ElementCheckboxWrapper.vue';

describe('ElementCheckboxWrapper', () => {
  it('renders with array options', () => {
    const wrapper = mount(ElementCheckboxWrapper, {
      props: {
        options: [
          { label: 'Option 1', value: '1' },
          { label: 'Option 2', value: '2' },
        ],
      },
    });
    expect(wrapper.findAll('.el-checkbox').length).toBe(2);
  });

  it('renders with object options', () => {
    const wrapper = mount(ElementCheckboxWrapper, {
      props: {
        options: { '1': 'Option 1', '2': 'Option 2' },
      },
    });
    expect(wrapper.findAll('.el-checkbox').length).toBe(2);
  });

  it('emits update:value on change', async () => {
    const wrapper = mount(ElementCheckboxWrapper, {
      props: {
        value: ['1'],
        options: [
          { label: 'Option 1', value: '1' },
          { label: 'Option 2', value: '2' },
        ],
      },
    });

    const checkboxGroup = wrapper.findComponent({ name: 'ElCheckboxGroup' });
    await checkboxGroup.vm.$emit('update:modelValue', ['1', '2']);

    expect(wrapper.emitted('update:value')).toBeTruthy();
    expect(wrapper.emitted('change')).toBeTruthy();
  });

  it('handles empty value', () => {
    const wrapper = mount(ElementCheckboxWrapper, {
      props: {
        options: [{ label: 'Option 1', value: '1' }],
      },
    });
    expect(wrapper.vm.modelValue).toEqual([]);
  });

  it('normalizes options correctly', () => {
    const wrapper = mount(ElementCheckboxWrapper, {
      props: {
        options: { a: 'Label A', b: 'Label B' },
      },
    });
    expect(wrapper.vm.normalizedOptions).toEqual([
      { label: 'Label A', value: 'a' },
      { label: 'Label B', value: 'b' },
    ]);
  });
});
