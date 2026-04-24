import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import ElementRadioWrapper from '../src/ElementRadioWrapper.vue';

describe('ElementRadioWrapper', () => {
  it('renders with array options', () => {
    const wrapper = mount(ElementRadioWrapper, {
      props: {
        options: [
          { label: 'Option 1', value: '1' },
          { label: 'Option 2', value: '2' },
        ],
      },
    });
    expect(wrapper.findAll('.el-radio').length).toBe(2);
  });

  it('renders with object options', () => {
    const wrapper = mount(ElementRadioWrapper, {
      props: {
        options: { '1': 'Option 1', '2': 'Option 2' },
      },
    });
    expect(wrapper.findAll('.el-radio').length).toBe(2);
  });

  it('emits update:value on change', async () => {
    const wrapper = mount(ElementRadioWrapper, {
      props: {
        value: '1',
        options: [
          { label: 'Option 1', value: '1' },
          { label: 'Option 2', value: '2' },
        ],
      },
    });

    const radioGroup = wrapper.findComponent({ name: 'ElRadioGroup' });
    await radioGroup.vm.$emit('update:modelValue', '2');

    expect(wrapper.emitted('update:value')).toBeTruthy();
    expect(wrapper.emitted('change')).toBeTruthy();
  });

  it('normalizes options correctly', () => {
    const wrapper = mount(ElementRadioWrapper, {
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
