import { computed } from 'vue'
import { useColorMode } from '@vueuse/core'

const colorMode = useColorMode({
  attribute: 'class',
  modes: { dark: 'dark', light: 'light' },
  storageKey: 'docs-theme',
  initialValue: 'dark',
})

export function useTheme() {
  const isDark = computed(() => colorMode.value === 'dark')
  const toggle = () => { colorMode.value = isDark.value ? 'light' : 'dark' }
  return { isDark, toggle }
}
