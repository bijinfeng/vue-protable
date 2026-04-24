import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import ElementSwitchWrapper from '../src/ElementSwitchWrapper.vue';

describe('ElementSwitchWrapper', () => {
  it('renders correctly', () => {
    const wrapper = mount(ElementSwitchWrapper);
    expect(wrapper.exists()).toBe(true);
  });

  it('emits update:value on change', async () => {
    const wrapper = mount(ElementSwitchWrapper, {
      props: { value: false },
    });

    const switchComponent = wrapper.findComponent({ name: 'ElSwitch' });
    await switchComponent.vm.$emit('update:modelValue', true);

    expect(wrapper.emitted('update:value')).toBeTruthy();
    expect(wrapper.emitted('change')).toBeTruthy();
  });

  it('handles default value', () => {
    const wrapper = mount(ElementSwitchWrapper);
    expect(wrapper.vm.modelValue).toBeFalsy();
  });
});
