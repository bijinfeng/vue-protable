import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import ElementSelectWrapper from '../src/ElementSelectWrapper.vue';

describe('ElementSelectWrapper', () => {
  it('renders with array options', () => {
    const wrapper = mount(ElementSelectWrapper, {
      props: {
        options: [
          { label: 'Option 1', value: '1' },
          { label: 'Option 2', value: '2' },
        ],
      },
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('renders with object options', () => {
    const wrapper = mount(ElementSelectWrapper, {
      props: {
        options: { '1': 'Option 1', '2': 'Option 2' },
      },
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('emits update:value on change', async () => {
    const wrapper = mount(ElementSelectWrapper, {
      props: {
        value: '1',
        options: [
          { label: 'Option 1', value: '1' },
          { label: 'Option 2', value: '2' },
        ],
      },
    });

    const selectComponent = wrapper.findComponent({ name: 'ElSelect' });
    await selectComponent.vm.$emit('update:modelValue', '2');

    expect(wrapper.emitted('update:value')).toBeTruthy();
    expect(wrapper.emitted('change')).toBeTruthy();
  });

  it('shows loading state', () => {
    const wrapper = mount(ElementSelectWrapper, {
      props: {
        loading: true,
        options: [],
      },
    });
    const selectComponent = wrapper.findComponent({ name: 'ElSelect' });
    expect(selectComponent.props('loading')).toBe(true);
  });
});
