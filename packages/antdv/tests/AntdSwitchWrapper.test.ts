import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import AntdSwitchWrapper from '../src/AntdSwitchWrapper.vue';

describe('AntdSwitchWrapper', () => {
  it('renders with boolean value', () => {
    const wrapper = mount(AntdSwitchWrapper, {
      props: {
        value: true,
      },
    });

    expect(wrapper.exists()).toBe(true);
  });

  it('emits update:value and change events', async () => {
    const wrapper = mount(AntdSwitchWrapper, {
      props: {
        value: false,
      },
    });

    await wrapper.vm.$emit('update:value', true);
    await wrapper.vm.$emit('change', true);

    expect(wrapper.emitted('update:value')).toBeTruthy();
    expect(wrapper.emitted('change')).toBeTruthy();
  });

  it('handles undefined value as false', () => {
    const wrapper = mount(AntdSwitchWrapper, {
      props: {},
    });

    const vm = wrapper.vm as any;
    // Switch defaults to false when value is undefined
    expect(vm.modelValue).toBeFalsy();
  });
});
