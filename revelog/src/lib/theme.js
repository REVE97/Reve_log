import { computed, ref } from 'vue'

const STORAGE_KEY = 'revelog-theme'
const theme = ref('light')
let preference = null
let systemTheme = null
let dispose = null

export const isDarkMode = computed(() => theme.value === 'dark')

function readPreference() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    return saved === 'light' || saved === 'dark' ? saved : null
  } catch {
    return null
  }
}

function applyTheme() {
  theme.value = preference ?? (systemTheme?.matches ? 'dark' : 'light')
  document.documentElement.dataset.theme = theme.value
}

export function initializeTheme() {
  dispose?.()
  systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
  preference = readPreference()
  applyTheme()

  function syncSystemTheme() {
    if (preference === null) {
      applyTheme()
    }
  }

  function syncStoredTheme(event) {
    if (event.key === STORAGE_KEY || event.key === null) {
      preference = readPreference()
      applyTheme()
    }
  }

  systemTheme.addEventListener('change', syncSystemTheme)
  window.addEventListener('storage', syncStoredTheme)

  const mediaQuery = systemTheme

  dispose = () => {
    mediaQuery.removeEventListener('change', syncSystemTheme)
    window.removeEventListener('storage', syncStoredTheme)
  }

  return dispose
}

export function toggleTheme() {
  preference = isDarkMode.value ? 'light' : 'dark'
  applyTheme()

  try {
    window.localStorage.setItem(STORAGE_KEY, preference)
  } catch {
    // 저장이 제한된 환경에서도 현재 화면의 테마 전환은 유지
  }
}
